import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A001-LOGIN_022
 * Type: Regression
 * Priority: Low
 * Category: Negative
 * Feature: Login
 * Scenario: Password Too Long
 *
 * Test Steps:
 * 1. Open Login page
 * 2. Enter valid email
 * 3. Enter long password (200 characters)
 * 4. Click Login button
 * 5. Verify authentication error message is displayed
 *
 * Expected Result:
 * - Show error message: メールアドレスまたはパスワードが間違っています (message_28)
 */

test.describe('A001-LOGIN_022: Password Too Long', () => {
  let loginPage: LoginPage;

  // Generate a 200 character password
  const longPassword = '0'.repeat(200);

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  // eslint-disable-next-line no-empty-pattern
  test.afterEach(async ({}, testInfo) => {
    await excelResultWriter.writeResult(testInfo);
  });

  test(
    'should show auth error when password is too long',
    {
      tag: ['@login', '@regression', '@negative', '@A001-LOGIN_022'],
    },
    async ({ page }) => {
      // Given - Login page is loaded
      await expect(page).toHaveURL(/.*login/);

      // When - Enter email and long password (200 characters)
      await loginPage.fillEmail('admin02@libman.com');
      await loginPage.fillPassword(longPassword);
      await loginPage.clickLogin();
      await page.waitForLoadState('networkidle');

      // Then - Verify auth error message is displayed
      await expect(loginPage.errorMessage).toBeVisible();
    },
  );
});
