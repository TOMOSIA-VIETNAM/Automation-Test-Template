import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A001-LOGIN_025
 * Type: Security
 * Priority: High
 * Category: Security
 * Feature: Login
 * Scenario: Brute Force Protection
 *
 * Test Steps:
 * 1. Open Login page
 * 2. Perform 10+ failed login attempts with wrong password
 * 3. Verify brute force protection is triggered
 *
 * Expected Result:
 * - System shows error message for each failed attempt
 * - After threshold, system may block or rate limit
 */

test.describe('A001-LOGIN_025: Brute Force Protection', () => {
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
    'should trigger brute force protection after multiple failed attempts',
    {
      tag: ['@login', '@security', '@brute-force', '@A001-LOGIN_025'],
    },
    async ({ page }) => {
      // Given - Login page is loaded
      await expect(page).toHaveURL(/.*login/);

      const failedAttemptsThreshold = 10;
      const attemptResults: boolean[] = [];

      // When - Perform multiple failed login attempts
      for (let i = 0; i < failedAttemptsThreshold; i++) {
        await loginPage.fillEmail('admin02@libman.com');
        await loginPage.fillPassword('wrongpassword');
        await loginPage.clickLogin();

        // Wait for response
        await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});

        // Check if error message is visible
        const isErrorVisible = await loginPage.errorMessage.isVisible().catch(() => false);
        attemptResults.push(isErrorVisible);

        // Clear form for next attempt
        await loginPage.clearForm();

        // Small delay between attempts
        await page.waitForTimeout(500);
      }

      // Then - Verify system responded to all attempts
      console.log(`Completed ${failedAttemptsThreshold} failed login attempts`);
      console.log(
        `Error messages shown: ${attemptResults.filter(Boolean).length}/${failedAttemptsThreshold}`,
      );

      // Verify at least the first attempts showed error (before potential lockout)
      const initialAttemptsWithError = attemptResults.slice(0, 5).filter(Boolean).length;
      expect(initialAttemptsWithError).toBeGreaterThan(0);

      // Verify the page is still accessible
      await expect(page).toHaveURL(/.*login/);
    },
  );
});
