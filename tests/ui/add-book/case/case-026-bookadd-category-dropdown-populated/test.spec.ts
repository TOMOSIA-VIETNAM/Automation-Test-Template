import { test, expect } from '@fixtures/auth.fixture';
import { AddBookPage } from '@pages/add-book-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A014-BOOKADD_026
 * Type: UI
 * Priority: Medium
 * Category: Positive
 * Feature: Book
 * Scenario: Category Dropdown - UI Test
 *
 * Test Steps:
 * 1. Open Add Book screen
 * 2. Click Category dropdown
 *
 * Expected Result:
 * - Category dropdown is populated correctly
 */

test.describe('A014-BOOKADD_026: Category Dropdown', () => {
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
    'should display category dropdown populated with options',
    {
      tag: ['@add-book', '@ui', '@positive', '@A014-BOOKADD_026'],
    },
    async ({ authenticatedPage }) => {
      // Given - Add Book page is loaded
      await expect(authenticatedPage).toHaveURL(/.*add-book/);

      // When - Click on category dropdown
      // Then - Verify category dropdown is populated
      await addBookPage.verifyCategoryDropdownPopulated();
    },
  );
});
