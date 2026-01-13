import { test, expect } from '@fixtures/auth.fixture';
import { AddBookPage } from '@pages/add-book-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A014-BOOKADD_033
 * Type: Security
 * Priority: High
 * Category: Negative
 * Feature: Book
 * Scenario: XSS Title - Security Test
 *
 * Test Steps:
 * 1. Open Add Book screen
 * 2. Enter XSS payload in Title field
 * 3. Click 送信
 *
 * Expected Result:
 * - No script executed, input is safely handled
 */

test.describe('A014-BOOKADD_033: XSS Title', () => {
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
    'should safely handle XSS payload in title field',
    {
      tag: ['@add-book', '@security', '@xss', '@A014-BOOKADD_033'],
    },
    async ({ authenticatedPage }) => {
      // Given - Add Book page is loaded
      await expect(authenticatedPage).toHaveURL(/.*add-book/);

      // Store a flag to detect if XSS is executed
      let xssExecuted = false;
      authenticatedPage.on('dialog', async (dialog) => {
        xssExecuted = true;
        await dialog.dismiss();
      });

      // When - Enter XSS payload in title and submit
      await addBookPage.fillTitle("<script>alert('XSS')</script>");
      await addBookPage.selectCategory('小説');
      await addBookPage.fillAuthor('Test Author');
      await addBookPage.fillPublisher('Test Publisher');
      await addBookPage.fillPublishDate('2024-01-01');
      await addBookPage.fillISBN('9784567890126');
      await addBookPage.fillScore('5');
      await addBookPage.fillQuantity('10');
      await addBookPage.clickSubmit();

      // Wait a bit for any potential XSS execution
      await authenticatedPage.waitForTimeout(1000);

      // Then - Verify no XSS was executed
      expect(xssExecuted).toBe(false);
    },
  );
});
