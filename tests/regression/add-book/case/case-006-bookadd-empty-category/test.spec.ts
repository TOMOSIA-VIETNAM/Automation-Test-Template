import { test, expect } from '@fixtures/auth.fixture';
import { AddBookPage } from '@pages/add-book-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A014-BOOKADD_006
 * Type: Regression
 * Priority: High
 * Category: Negative
 * Feature: Book
 * Scenario: Empty Category - Validation Error
 *
 * Test Steps:
 * 1. Open Add Book screen
 * 2. Do not select Category
 * 3. Click 送信
 *
 * Expected Result:
 * - Show error message: カテゴリーを選択してください
 */

test.describe('A014-BOOKADD_006: Empty Category', () => {
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
    'should show error when category is not selected',
    {
      tag: ['@add-book', '@regression', '@negative', '@A014-BOOKADD_006'],
    },
    async ({ authenticatedPage }) => {
      // Given - Add Book page is loaded
      await expect(authenticatedPage).toHaveURL(/.*add-book/);

      // When - Fill other fields but not category and submit
      await addBookPage.fillTitle('Test Book');
      await addBookPage.fillAuthor('Test Author');
      await addBookPage.fillPublisher('Test Publisher');
      await addBookPage.fillPublishDate('2024-01-01');
      await addBookPage.fillISBN('9784567890123');
      await addBookPage.fillScore('5');
      await addBookPage.fillQuantity('10');
      await addBookPage.clickSubmit();

      // Then - Verify category error message is displayed
      await addBookPage.verifyCategoryError();
    },
  );
});
