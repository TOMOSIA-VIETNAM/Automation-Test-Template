import { test, expect } from '@fixtures/auth.fixture';
import { AddBookPage } from '@pages/add-book-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A014-BOOKADD_009
 * Type: Regression
 * Priority: High
 * Category: Negative
 * Feature: Book
 * Scenario: Empty Publish Date - Validation Error
 *
 * Test Steps:
 * 1. Open Add Book screen
 * 2. Leave Publish Date empty
 * 3. Click 送信
 *
 * Expected Result:
 * - Show error message: 日付を選択してください
 */

test.describe('A014-BOOKADD_009: Empty Publish Date', () => {
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
    'should show error when publish date is empty',
    {
      tag: ['@add-book', '@regression', '@negative', '@A014-BOOKADD_009'],
    },
    async ({ authenticatedPage }) => {
      // Given - Add Book page is loaded
      await expect(authenticatedPage).toHaveURL(/.*add-book/);

      // When - Fill all fields except publish date and submit
      await addBookPage.fillTitle('Test Book');
      await addBookPage.selectCategory('小説');
      await addBookPage.fillAuthor('Test Author');
      await addBookPage.fillPublisher('Test Publisher');
      // Publish Date left empty
      await addBookPage.fillISBN('9784567890123');
      await addBookPage.fillScore('5');
      await addBookPage.fillQuantity('10');
      await addBookPage.clickSubmit();

      // Then - Verify publish date error message is displayed
      await addBookPage.verifyPublishDateError();
    },
  );
});
