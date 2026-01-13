import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A001-LOGIN_019
 * Type: UI/Usability
 * Priority: Medium
 * Category: Usability
 * Feature: Login
 * Scenario: Trim Input - Email with leading/trailing spaces
 *
 * Test Steps:
 * 1. Open Login page
 * 2. Enter email with leading/trailing spaces
 * 3. Enter valid password
 * 4. Click Login button
 * 5. Verify authentication error message is displayed
 *
 * Expected Result:
 * - Show error message: メールアドレスまたはパスワードが間違っています (message_28)
 */

test.describe('A001-LOGIN_019: Trim Input', () => {
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
    'should show auth error when email has leading/trailing spaces',
    {
      tag: ['@login', '@regression', '@usability', '@A001-LOGIN_019'],
    },
    async ({ page }) => {
      // Given - Login page is loaded
      await expect(page).toHaveURL(/.*login/);

      // When - Enter email with spaces and valid password
      await loginPage.fillEmail(' admin02@libman.com ');
      await loginPage.fillPassword('000000');
      await loginPage.clickLogin();
      await page.waitForLoadState('networkidle');

      // Then - Verify auth error message is displayed
      await expect(loginPage.errorMessage).toBeVisible();
    },
  );
});
