import { test, expect } from '@fixtures/auth.fixture';
import { AddBookPage } from '@pages/add-book-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A014-BOOKADD_013
 * Type: Regression
 * Priority: High
 * Category: Positive
 * Feature: Book
 * Scenario: ISBN Length 13 - Boundary Test (Success)
 *
 * Test Steps:
 * 1. Open Add Book screen
 * 2. Enter ISBN 13 digits
 * 3. Click 送信
 *
 * Expected Result:
 * - Show success dialog: 送信されました
 */

test.describe('A014-BOOKADD_013: ISBN Length 13', () => {
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
    'should accept valid ISBN with 13 digits',
    {
      tag: ['@add-book', '@regression', '@positive', '@boundary', '@A014-BOOKADD_013'],
    },
    async ({ authenticatedPage }) => {
      // Given - Add Book page is loaded
      await expect(authenticatedPage).toHaveURL(/.*add-book/);

      // When - Fill all fields with valid ISBN 13 and submit
      await addBookPage.fillTitle('Test Book ISBN13');
      await addBookPage.selectCategory('小説');
      await addBookPage.fillAuthor('Test Author');
      await addBookPage.fillPublisher('Test Publisher');
      await addBookPage.fillPublishDate('2024-01-01');
      await addBookPage.fillISBN('9784567890123'); // Valid ISBN-13
      await addBookPage.fillScore('5');
      await addBookPage.fillQuantity('10');
      await addBookPage.clickSubmit();

      // Then - Verify success dialog is displayed
      await addBookPage.verifySuccessDialog();
    },
  );
});
