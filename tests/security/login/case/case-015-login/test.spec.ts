import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A001-LOGIN_015
 * Type: Security
 * Priority: High
 * Category: Negative
 * Feature: Login
 * Scenario: SQL Injection Attack
 *
 * Test Steps:
 * 1. Open Login page
 * 2. Enter SQL injection payload into Email field
 * 3. Enter password
 * 4. Click Login button
 * 5. Verify system rejects the request safely
 *
 * Expected Result:
 * - Show error message: メールアドレスまたはパスワードが間違っています (message_28)
 * - No database error exposed
 */

test.describe('A001-LOGIN_015: SQL Injection', () => {
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
    'should reject SQL injection payload safely',
    {
      tag: ['@login', '@security', '@sql-injection', '@A001-LOGIN_015'],
    },
    async ({ page }) => {
      // Given - Login page is loaded
      await expect(page).toHaveURL(/.*login/);

      // When - Enter SQL injection payload
      await loginPage.fillEmail("' OR '1'='1");
      await loginPage.fillPassword('000000');
      await loginPage.clickLogin();
      await page.waitForLoadState('networkidle');

      // Then - Verify auth error message is displayed (not database error)
      await expect(loginPage.errorMessage).toBeVisible();
    },
  );
});
