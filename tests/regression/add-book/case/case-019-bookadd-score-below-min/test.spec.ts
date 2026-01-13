import { test, expect } from '@fixtures/auth.fixture';
import { AddBookPage } from '@pages/add-book-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A014-BOOKADD_019
 * Type: Regression
 * Priority: Medium
 * Category: Negative
 * Feature: Book
 * Scenario: Score Below Min - Boundary Test
 *
 * Test Steps:
 * 1. Open Add Book screen
 * 2. Enter score below min
 * 3. Click 送信
 *
 * Expected Result:
 * - Show error message: 0より大きい数値を入力してください
 */

test.describe('A014-BOOKADD_019: Score Below Min', () => {
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
    'should show error when score is below minimum (-1)',
    {
      tag: ['@add-book', '@regression', '@negative', '@boundary', '@A014-BOOKADD_019'],
    },
    async ({ authenticatedPage }) => {
      // Given - Add Book page is loaded
      await expect(authenticatedPage).toHaveURL(/.*add-book/);

      // When - Fill all fields with score = -1 and submit
      await addBookPage.fillTitle('Test Book');
      await addBookPage.selectCategory('小説');
      await addBookPage.fillAuthor('Test Author');
      await addBookPage.fillPublisher('Test Publisher');
      await addBookPage.fillPublishDate('2024-01-01');
      await addBookPage.fillISBN('9784567890125');
      await addBookPage.fillScore('-1'); // Score below min
      await addBookPage.fillQuantity('10');
      await addBookPage.clickSubmit();

      // Then - Verify score validation error message is displayed
      await addBookPage.verifyScoreValidationError();
    },
  );
});
