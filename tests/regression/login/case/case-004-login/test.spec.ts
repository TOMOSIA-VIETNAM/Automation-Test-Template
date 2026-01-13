import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A001-LOGIN_004
 * Type: Regression
 * Priority: High
 * Category: Negative
 * Feature: Login
 * Scenario: Empty Password - Validation Error
 *
 * Test Steps:
 * 1. Open Login page
 * 2. Enter valid email
 * 3. Leave Password field empty
 * 4. Click Login button
 * 5. Verify validation message is displayed under Password field
 *
 * Expected Result:
 * - Show validation message: パスワードを入力してください (message_53)
 */

test.describe('A001-LOGIN_004: Empty Password Validation', () => {
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
    'should show password required message when password is empty',
    {
      tag: ['@login', '@regression', '@negative', '@A001-LOGIN_004'],
    },
    async ({ page }) => {
      // Given - Login page is loaded
      await expect(page).toHaveURL(/.*login/);

      // When - Enter email and leave password empty
      await loginPage.fillEmail('admin02@libman.com');
      await loginPage.clickLogin();

      // Then - Verify password required message is displayed
      await loginPage.verifyPasswordError('パスワードを入力してください');
    },
  );
});
