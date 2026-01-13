import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A001-LOGIN_005
 * Type: Regression
 * Priority: High
 * Category: Negative
 * Feature: Login
 * Scenario: Missing Both Fields - Validation Error
 *
 * Test Steps:
 * 1. Open Login page
 * 2. Leave both Email and Password fields empty
 * 3. Click Login button
 * 4. Verify Email required message is displayed
 *
 * Expected Result:
 * - Show validation message: メールアドレスを入力してください (message_52)
 */

test.describe('A001-LOGIN_005: Missing Both Fields Validation', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  // eslint-disable-next-line no-empty-pattern
  test.afterEach(async ({}, testInfo) => {
    await excelResultWriter.writeResult(testInfo);
  });

  test(
    'should show email required message when both fields are empty',
    {
      tag: ['@login', '@regression', '@negative', '@A001-LOGIN_005'],
    },
    async ({ page }) => {
      // Given - Login page is loaded
      await expect(page).toHaveURL(/.*login/);

      // When - Click login without entering any data
      await loginPage.clickLogin();

      // Then - Verify email required message is displayed
      await loginPage.verifyEmailError('メールアドレスを入力してください');
    },
  );
});
