import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A001-LOGIN_023
 * Type: Performance
 * Priority: High
 * Category: Load
 * Feature: Login
 * Scenario: Spam Login - Rapid login attempts
 *
 * Test Steps:
 * 1. Open Login page
 * 2. Perform 20 rapid login attempts within 5 seconds
 * 3. Verify system handles the load and responds appropriately
 *
 * Expected Result:
 * - System handles rapid login attempts without crashing
 * - Show error message: メールアドレスまたはパスワードが間違っています (message_28)
 */

test.describe('A001-LOGIN_023: Spam Login', () => {
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
    'should handle rapid login attempts without crashing',
    {
      tag: ['@login', '@performance', '@load', '@A001-LOGIN_023'],
    },
    async ({ page }) => {
      // Given - Login page is loaded
      await expect(page).toHaveURL(/.*login/);

      const attemptsCount = 20;
      const startTime = Date.now();

      // When - Perform rapid login attempts
      for (let i = 0; i < attemptsCount; i++) {
        await loginPage.fillEmail('admin02@libman.com');
        await loginPage.fillPassword('wrongpassword');
        await loginPage.clickLogin();

        // Wait for response but don't wait too long
        await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});

        // Verify error message is displayed
        await expect(loginPage.errorMessage).toBeVisible({ timeout: 3000 });

        // Clear form for next attempt
        await loginPage.clearForm();
      }

      const endTime = Date.now();
      const totalTimeSeconds = (endTime - startTime) / 1000;

      // Then - Verify system handled the load
      console.log(
        `Completed ${attemptsCount} login attempts in ${totalTimeSeconds.toFixed(2)} seconds`,
      );

      // Verify the page is still responsive
      await expect(page).toHaveURL(/.*login/);
      await expect(loginPage.loginButton).toBeVisible();
    },
  );
});
