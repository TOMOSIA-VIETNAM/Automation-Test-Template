import { test, expect } from '@fixtures/auth.fixture';
import { AddBookPage } from '@pages/add-book-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A014-BOOKADD_008
 * Type: Regression
 * Priority: High
 * Category: Negative
 * Feature: Book
 * Scenario: Empty Publisher - Validation Error
 *
 * Test Steps:
 * 1. Open Add Book screen
 * 2. Leave Publisher empty
 * 3. Click 送信
 *
 * Expected Result:
 * - Show error message: 出版社名を入力してください
 */

test.describe('A014-BOOKADD_008: Empty Publisher', () => {
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
    'should show error when publisher is empty',
    {
      tag: ['@add-book', '@regression', '@negative', '@A014-BOOKADD_008'],
    },
    async ({ authenticatedPage }) => {
      // Given - Add Book page is loaded
      await expect(authenticatedPage).toHaveURL(/.*add-book/);

      // When - Fill all fields except publisher and submit
      await addBookPage.fillTitle('Test Book');
      await addBookPage.selectCategory('小説');
      await addBookPage.fillAuthor('Test Author');
      // Publisher left empty
      await addBookPage.fillPublishDate('2024-01-01');
      await addBookPage.fillISBN('9784567890123');
      await addBookPage.fillScore('5');
      await addBookPage.fillQuantity('10');
      await addBookPage.clickSubmit();

      // Then - Verify publisher error message is displayed
      await addBookPage.verifyPublisherError();
    },
  );
});
