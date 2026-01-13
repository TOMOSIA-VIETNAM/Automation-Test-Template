import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A001-LOGIN_011
 * Type: Regression
 * Priority: Medium
 * Category: Boundary Negative
 * Feature: Login
 * Scenario: Email Too Long - Authentication Error
 *
 * Test Steps:
 * 1. Open Login page
 * 2. Enter email exceeding maximum length (254+ characters)
 * 3. Enter valid password
 * 4. Click Login button
 * 5. Verify authentication error message is displayed
 *
 * Expected Result:
 * - Show error message: メールアドレスまたはパスワードが間違っています (message_28)
 */

test.describe('A001-LOGIN_011: Email Too Long', () => {
  let loginPage: LoginPage;

  // 254+ character email (exceeds max length)
  const tooLongEmail =
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@libman.com';

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  // eslint-disable-next-line no-empty-pattern
  test.afterEach(async ({}, testInfo) => {
    await excelResultWriter.writeResult(testInfo);
  });

  test(
    'should show auth error when email exceeds max length',
    {
      tag: ['@login', '@regression', '@boundary', '@A001-LOGIN_011'],
    },
    async ({ page }) => {
      // Given - Login page is loaded
      await expect(page).toHaveURL(/.*login/);

      // When - Enter too long email and valid password
      await loginPage.fillEmail(tooLongEmail);
      await loginPage.fillPassword('000000');
      await loginPage.clickLogin();

      // Then - Verify auth error message is displayed
      await expect(loginPage.errorMessage).toBeVisible();
    },
  );
});
