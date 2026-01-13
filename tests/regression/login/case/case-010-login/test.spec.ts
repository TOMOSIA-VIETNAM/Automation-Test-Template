import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { DashboardPage } from '@pages/dashboard-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A001-LOGIN_010
 * Type: Regression
 * Priority: Medium
 * Category: Boundary Positive
 * Feature: Login
 * Scenario: Email Max Length - Login Success
 * Precondition: Account with 253 char email exists
 *
 * Test Steps:
 * 1. Open Login page
 * 2. Enter email with maximum allowed length (253 characters)
 * 3. Enter valid password
 * 4. Click Login button
 * 5. Verify login is successful
 *
 * Expected Result:
 * - Go to dashboard and show success message: ログインに成功しました (message_54)
 */

test.describe('A001-LOGIN_010: Email Max Length', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  // 253 character email
  const maxLengthEmail =
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@libman.com';

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  // eslint-disable-next-line no-empty-pattern
  test.afterEach(async ({}, testInfo) => {
    await excelResultWriter.writeResult(testInfo);
  });

  test(
    'should login successfully with max length email',
    {
      tag: ['@login', '@regression', '@boundary', '@A001-LOGIN_010'],
    },
    async ({ page }) => {
      // Given - Login page is loaded
      await expect(page).toHaveURL(/.*login/);

      // When - Enter max length email and valid password
      await loginPage.fillEmail(maxLengthEmail);
      await loginPage.fillPassword('000000');
      await loginPage.clickLogin();
      await page.waitForLoadState('networkidle');

      // Then - Verify successful login
      await expect(page).toHaveURL(/.*home/);
      await dashboardPage.verifySuccessDialog('ログインに成功しました');
    },
  );
});
