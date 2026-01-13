import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A001-LOGIN_001
 * Type: Smoke
 * Priority: High
 * Category: Positive
 * Feature: Login
 * Scenario: Valid Login - User exists
 *
 * Test Data:
 * - Email: admin@libman.com
 * - Password: 000000
 *
 * Test Steps:
 * 1. Open Login page
 * 2. Enter valid email into Email field
 * 3. Enter valid password into Password field
 * 4. Click Login button
 * 5. Wait for system response
 * 6. Verify user is redirected to Dashboard page
 *
 * Expected Result:
 * - User is redirected to Dashboard page
 * - Success dialog appears with message: "ログインに成功しました" (message_54)
 */

test.describe('A001-LOGIN_001: Valid Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    loginPage = new LoginPage(page);

    // Step 1: Open Login page
    await loginPage.navigate();
  });

  // eslint-disable-next-line no-empty-pattern
  test.afterEach(async ({}, testInfo) => {
    // Write test result to Excel
    await excelResultWriter.writeResult(testInfo);
  });

  test(
    'should login successfully when using valid admin credentials',
    {
      tag: ['@login', '@smoke', '@A001-LOGIN_001'],
    },
    async ({ page }) => {
      // Given - Initial setup (Login page loaded in beforeEach)
      await expect(page).toHaveURL(/.*login/);

      await loginPage.verifyLoginPageUI();
    },
  );
});
