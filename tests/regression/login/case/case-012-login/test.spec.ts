import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A001-LOGIN_012
 * Type: Regression
 * Priority: High
 * Category: Negative
 * Feature: Login
 * Scenario: Wrong Password - Authentication Error
 * Precondition: User exists
 *
 * Test Steps:
 * 1. Open Login page
 * 2. Enter valid email
 * 3. Enter incorrect password
 * 4. Click Login button
 * 5. Verify authentication error message is displayed
 *
 * Expected Result:
 * - Show error message: メールアドレスまたはパスワードが間違っています (message_28)
 */

test.describe('A001-LOGIN_012: Wrong Password', () => {
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
    'should show auth error when password is incorrect',
    {
      tag: ['@login', '@regression', '@negative', '@auth', '@A001-LOGIN_012'],
    },
    async ({ page }) => {
      // Given - Login page is loaded
      await expect(page).toHaveURL(/.*login/);

      // When - Enter valid email and wrong password
      await loginPage.fillEmail('admin02@libman.com');
      await loginPage.fillPassword('wrong123');
      await loginPage.clickLogin();
      await page.waitForLoadState('networkidle');

      // Then - Verify auth error message is displayed
      await expect(loginPage.errorMessage).toBeVisible();
    },
  );
});
