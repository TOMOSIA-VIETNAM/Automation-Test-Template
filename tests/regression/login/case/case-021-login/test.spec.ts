import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A001-LOGIN_021
 * Type: Regression
 * Priority: Low
 * Category: Negative
 * Feature: Login
 * Scenario: Password Too Short
 *
 * Test Steps:
 * 1. Open Login page
 * 2. Enter valid email
 * 3. Enter short password (less than required length)
 * 4. Click Login button
 * 5. Verify authentication error message is displayed
 *
 * Expected Result:
 * - Show error message: メールアドレスまたはパスワードが間違っています (message_28)
 */

test.describe('A001-LOGIN_021: Password Too Short', () => {
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
    'should show auth error when password is too short',
    {
      tag: ['@login', '@regression', '@negative', '@A001-LOGIN_021'],
    },
    async ({ page }) => {
      // Given - Login page is loaded
      await expect(page).toHaveURL(/.*login/);

      // When - Enter email and short password
      await loginPage.fillEmail('admin02@libman.com');
      await loginPage.fillPassword('000');
      await loginPage.clickLogin();
      await page.waitForLoadState('networkidle');

      // Then - Verify auth error message is displayed
      await expect(loginPage.errorMessage).toBeVisible();
    },
  );
});
