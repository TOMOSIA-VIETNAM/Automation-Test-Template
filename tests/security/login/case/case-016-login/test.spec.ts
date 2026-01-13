import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A001-LOGIN_016
 * Type: Security
 * Priority: High
 * Category: Negative
 * Feature: Login
 * Scenario: XSS Injection Attack
 *
 * Test Steps:
 * 1. Open Login page
 * 2. Enter XSS payload into Email field
 * 3. Enter password
 * 4. Click Login button
 * 5. Verify no script is executed and error message is shown
 *
 * Expected Result:
 * - Show error message: メールアドレスまたはパスワードが間違っています (message_28)
 * - No script execution
 */

test.describe('A001-LOGIN_016: XSS Injection', () => {
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
    'should reject XSS payload safely without script execution',
    {
      tag: ['@login', '@security', '@xss', '@A001-LOGIN_016'],
    },
    async ({ page }) => {
      // Given - Login page is loaded
      await expect(page).toHaveURL(/.*login/);

      // Listen for dialog (to detect if XSS is executed)
      let dialogAppeared = false;
      page.on('dialog', async (dialog) => {
        dialogAppeared = true;
        await dialog.dismiss();
      });

      // When - Enter XSS payload
      await loginPage.fillEmail('<script>alert(1)</script>');
      await loginPage.fillPassword('000000');
      await loginPage.clickLogin();
      await page.waitForLoadState('networkidle');

      // Then - Verify no dialog appeared (XSS not executed)
      expect(dialogAppeared).toBe(false);

      // Verify auth error message is displayed
      await expect(loginPage.errorMessage).toBeVisible();
    },
  );
});
