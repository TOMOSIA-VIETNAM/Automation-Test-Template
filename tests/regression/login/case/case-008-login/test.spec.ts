import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A001-LOGIN_008
 * Type: Regression
 * Priority: High
 * Category: Negative
 * Feature: Login
 * Scenario: Email Missing Domain - Authentication Error
 *
 * Test Steps:
 * 1. Open Login page
 * 2. Enter email without domain part
 * 3. Enter valid password
 * 4. Click Login button
 * 5. Verify authentication error message is displayed
 *
 * Expected Result:
 * - Show error message: メールアドレスまたはパスワードが間違っています (message_28)
 */

test.describe('A001-LOGIN_008: Email Missing Domain', () => {
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
    'should show auth error when email is missing domain',
    {
      tag: ['@login', '@regression', '@negative', '@A001-LOGIN_008'],
    },
    async ({ page }) => {
      // Given - Login page is loaded
      await expect(page).toHaveURL(/.*login/);

      // When - Enter email without domain and valid password
      await loginPage.fillEmail('abc@');
      await loginPage.fillPassword('000000');
      await loginPage.clickLogin();

      // Then - Verify auth error message is displayed
      await expect(loginPage.errorMessage).toBeVisible();
    },
  );
});
