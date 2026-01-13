import { test, expect } from '@fixtures/auth.fixture';
import { AddBookPage } from '@pages/add-book-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A014-BOOKADD_015
 * Type: Regression
 * Priority: Medium
 * Category: Negative
 * Feature: Book
 * Scenario: ISBN Invalid Length - Boundary Test
 *
 * Test Steps:
 * 1. Open Add Book screen
 * 2. Enter invalid ISBN length
 * 3. Click 送信
 *
 * Expected Result:
 * - Show error message: 不正なISBN
 */

test.describe('A014-BOOKADD_015: ISBN Invalid Length', () => {
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
    'should show error when ISBN length is invalid (9 digits)',
    {
      tag: ['@add-book', '@regression', '@negative', '@boundary', '@A014-BOOKADD_015'],
    },
    async ({ authenticatedPage }) => {
      // Given - Add Book page is loaded
      await expect(authenticatedPage).toHaveURL(/.*add-book/);

      // When - Fill all fields with invalid ISBN length and submit
      await addBookPage.fillTitle('Test Book');
      await addBookPage.selectCategory('小説');
      await addBookPage.fillAuthor('Test Author');
      await addBookPage.fillPublisher('Test Publisher');
      await addBookPage.fillPublishDate('2024-01-01');
      await addBookPage.fillISBN('123456789'); // Invalid: only 9 digits
      await addBookPage.fillScore('5');
      await addBookPage.fillQuantity('10');
      await addBookPage.clickSubmit();

      // Then - Verify ISBN error message is displayed
      await addBookPage.verifyISBNError();
    },
  );
});
