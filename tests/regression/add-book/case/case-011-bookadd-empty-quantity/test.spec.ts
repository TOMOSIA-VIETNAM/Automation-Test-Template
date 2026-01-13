import { test, expect } from '@fixtures/auth.fixture';
import { AddBookPage } from '@pages/add-book-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A014-BOOKADD_011
 * Type: Regression
 * Priority: High
 * Category: Negative
 * Feature: Book
 * Scenario: Empty Quantity - Validation Error
 *
 * Test Steps:
 * 1. Open Add Book screen
 * 2. Leave Quantity empty
 * 3. Click 送信
 *
 * Expected Result:
 * - Show error message: この欄は空にできません
 */

test.describe('A014-BOOKADD_011: Empty Quantity', () => {
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
    'should show error when quantity is empty',
    {
      tag: ['@add-book', '@regression', '@negative', '@A014-BOOKADD_011'],
    },
    async ({ authenticatedPage }) => {
      // Given - Add Book page is loaded
      await expect(authenticatedPage).toHaveURL(/.*add-book/);

      // When - Fill all fields except quantity and submit
      await addBookPage.fillTitle('Test Book');
      await addBookPage.selectCategory('小説');
      await addBookPage.fillAuthor('Test Author');
      await addBookPage.fillPublisher('Test Publisher');
      await addBookPage.fillPublishDate('2024-01-01');
      await addBookPage.fillISBN('9784567890123');
      await addBookPage.fillScore('5');
      // Quantity left empty
      await addBookPage.clickSubmit();

      // Then - Verify empty field error message is displayed
      await addBookPage.verifyEmptyFieldError();
    },
  );
});
