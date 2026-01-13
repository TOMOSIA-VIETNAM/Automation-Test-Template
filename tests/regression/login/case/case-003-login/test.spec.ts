import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A001-LOGIN_003
 * Type: Regression
 * Priority: High
 * Category: Negative
 * Feature: Login
 * Scenario: Empty Email - Validation Error
 *
 * Test Steps:
 * 1. Open Login page
 * 2. Leave Email field empty
 * 3. Enter valid password
 * 4. Click Login button
 * 5. Verify validation message is displayed under Email field
 *
 * Expected Result:
 * - Show validation message: メールアドレスを入力してください (message_52)
 */

test.describe('A001-LOGIN_003: Empty Email Validation', () => {
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
    'should show email required message when email is empty',
    {
      tag: ['@login', '@regression', '@negative', '@A001-LOGIN_003'],
    },
    async ({ page }) => {
      // Given - Login page is loaded
      await expect(page).toHaveURL(/.*login/);

      // When - Leave email empty and enter password
      await loginPage.fillPassword('000000');
      await loginPage.clickLogin();

      // Then - Verify email required message is displayed
      await loginPage.verifyEmailError('メールアドレスを入力してください');
    },
  );
});
