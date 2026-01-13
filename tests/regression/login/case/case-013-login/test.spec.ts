import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A001-LOGIN_013
 * Type: Regression
 * Priority: High
 * Category: Negative
 * Feature: Login
 * Scenario: Wrong Email - Authentication Error
 *
 * Test Steps:
 * 1. Open Login page
 * 2. Enter non-existing email
 * 3. Enter valid password
 * 4. Click Login button
 * 5. Verify authentication error message is displayed
 *
 * Expected Result:
 * - Show error message: メールアドレスまたはパスワードが間違っています (message_28)
 */

test.describe('A001-LOGIN_013: Wrong Email', () => {
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
    'should show auth error when email does not exist',
    {
      tag: ['@login', '@regression', '@negative', '@auth', '@A001-LOGIN_013'],
    },
    async ({ page }) => {
      // Given - Login page is loaded
      await expect(page).toHaveURL(/.*login/);

      // When - Enter non-existing email and valid password
      await loginPage.fillEmail('notexist@libman.com');
      await loginPage.fillPassword('000000');
      await loginPage.clickLogin();
      await page.waitForLoadState('networkidle');

      // Then - Verify auth error message is displayed
      await expect(loginPage.errorMessage).toBeVisible();
    },
  );
});
