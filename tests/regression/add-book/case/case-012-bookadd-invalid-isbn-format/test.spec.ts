import { test, expect } from '@fixtures/auth.fixture';
import { AddBookPage } from '@pages/add-book-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A014-BOOKADD_012
 * Type: Regression
 * Priority: High
 * Category: Negative
 * Feature: Book
 * Scenario: Invalid ISBN Format - Validation Error
 *
 * Test Steps:
 * 1. Open Add Book screen
 * 2. Enter invalid ISBN
 * 3. Click 送信
 *
 * Expected Result:
 * - Show error message: 不正なISBN
 */

test.describe('A014-BOOKADD_012: Invalid ISBN Format', () => {
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
    'should show error when ISBN format is invalid',
    {
      tag: ['@add-book', '@regression', '@negative', '@A014-BOOKADD_012'],
    },
    async ({ authenticatedPage }) => {
      // Given - Add Book page is loaded
      await expect(authenticatedPage).toHaveURL(/.*add-book/);

      // When - Fill all fields with invalid ISBN and submit
      await addBookPage.fillTitle('Test Book');
      await addBookPage.selectCategory('小説');
      await addBookPage.fillAuthor('Test Author');
      await addBookPage.fillPublisher('Test Publisher');
      await addBookPage.fillPublishDate('2024-01-01');
      await addBookPage.fillISBN('ABC123'); // Invalid ISBN format
      await addBookPage.fillScore('5');
      await addBookPage.fillQuantity('10');
      await addBookPage.clickSubmit();

      // Then - Verify ISBN error message is displayed
      await addBookPage.verifyISBNError();
    },
  );
});
