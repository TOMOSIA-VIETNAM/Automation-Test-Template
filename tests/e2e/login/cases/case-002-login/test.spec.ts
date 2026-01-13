import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { DashboardPage } from '@pages/dashboard-page';
import { excelResultWriter } from '@utils/excel-result-writer';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const testData = JSON.parse(readFileSync(join(__dirname, 'test-data.json'), 'utf-8'));

/**
 * Test Case: A001-LOGIN_002
 * Type: E2E
 * Priority: High
 * Category: Positive
 * Feature: Login
 * Scenario: Valid Login - User exists
 *
 * Test Data:
 * - Email: admin02@libman.com
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

test.describe('A001-LOGIN_002: Valid Login', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    // Step 1: Open Login page
    await loginPage.navigate();
  });

  // eslint-disable-next-line no-empty-pattern
  test.afterEach(async ({}, testInfo) => {
    // Write test result to Excel
    await excelResultWriter.writeResult(testInfo);
  });

  test(
    'should login successfully when using valid admin02 credentials',
    {
      tag: ['@login', '@smoke', '@e2e', '@A001-LOGIN_002'],
    },
    async ({ page }) => {
      // Test data is already loaded at the top of the file
      const { email, password, expectedMessage } = testData;

      // Given - Initial setup (Login page loaded in beforeEach)
      await expect(page).toHaveURL(/.*login/);

      // When - Perform login actions
      // Step 2: Enter valid email into Email field
      await loginPage.fillEmail(email);

      // Step 3: Enter valid password into Password field
      await loginPage.fillPassword(password);

      // Step 4: Click Login button
      await loginPage.clickLogin();

      // Step 5: Wait for system response
      await page.waitForLoadState('networkidle');

      // Then - Verify successful login
      // Step 6: Verify user is redirected to Dashboard page
      await expect(page).toHaveURL(/.*home/);

      // Verify success dialog appears
      await dashboardPage.verifySuccessDialog(expectedMessage);
    },
  );
});
