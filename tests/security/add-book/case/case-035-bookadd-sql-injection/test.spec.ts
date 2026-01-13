import { test, expect } from '@fixtures/auth.fixture';
import { AddBookPage } from '@pages/add-book-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A014-BOOKADD_035
 * Type: Security
 * Priority: High
 * Category: Negative
 * Feature: Book
 * Scenario: SQL Injection - Security Test
 *
 * Test Steps:
 * 1. Open Add Book screen
 * 2. Enter SQL injection string in Title field
 * 3. Click 送信
 *
 * Expected Result:
 * - SQL injection is prevented, no data corruption
 */

test.describe('A014-BOOKADD_035: SQL Injection', () => {
  let addBookPage: AddBookPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    addBookPage = new AddBookPage(authenticatedPage);
    await addBookPage.navigate();
  });

  // eslint-disable-next-line no-empty-pattern
  test.afterEach(async ({}, testInfo) => {
    await excelResultWriter.writeResult(testInfo);
  });

  test(
    'should safely handle SQL injection payload in title field',
    {
      tag: ['@add-book', '@security', '@sql-injection', '@A014-BOOKADD_035'],
    },
    async ({ authenticatedPage }) => {
      // Given - Add Book page is loaded
      await expect(authenticatedPage).toHaveURL(/.*add-book/);

      // When - Enter SQL injection payload in title and submit
      await addBookPage.fillTitle("'; DROP TABLE books; --");
      await addBookPage.selectCategory('小説');
      await addBookPage.fillAuthor('Test Author');
      await addBookPage.fillPublisher('Test Publisher');
      await addBookPage.fillPublishDate('2024-01-01');
      await addBookPage.fillISBN('9784567890127');
      await addBookPage.fillScore('5');
      await addBookPage.fillQuantity('10');
      await addBookPage.clickSubmit();

      // Wait for page response
      await authenticatedPage.waitForLoadState('networkidle');

      // Then - Verify no database error is exposed (page should handle gracefully)
      // Check that no 500 error or database error message is displayed
      const pageContent = await authenticatedPage.content();
      expect(pageContent).not.toContain('SQL');
      expect(pageContent).not.toContain('database error');
      expect(pageContent).not.toContain('syntax error');
    },
  );
});
