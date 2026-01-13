import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A001-LOGIN_018
 * Type: UI/Usability
 * Priority: Medium
 * Category: Usability
 * Feature: Login
 * Scenario: Responsive Layout
 *
 * Test Steps:
 * 1. Open Login page
 * 2. Resize browser to different viewports
 * 3. Verify UI layout displays correctly at each viewport
 *
 * Expected Result:
 * - UI layout displays correctly at all viewport sizes
 */

test.describe('A001-LOGIN_018: Responsive Layout', () => {
  let loginPage: LoginPage;

  const viewports = [
    { name: 'desktop', width: 1920, height: 1080 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 667 },
  ];

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  // eslint-disable-next-line no-empty-pattern
  test.afterEach(async ({}, testInfo) => {
    await excelResultWriter.writeResult(testInfo);
  });

  for (const viewport of viewports) {
    test(
      `should display correctly on ${viewport.name} (${viewport.width}x${viewport.height})`,
      {
        tag: ['@login', '@ui', '@responsive', '@A001-LOGIN_018'],
      },
      async ({ page }) => {
        // When - Set viewport and navigate
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        await loginPage.navigate();

        // Then - Verify UI elements are visible
        await loginPage.verifyLoginPageUI();

        // Verify no layout issues (all elements within viewport)
        const emailBox = await loginPage.emailInput.boundingBox();
        const passwordBox = await loginPage.passwordInput.boundingBox();
        const buttonBox = await loginPage.loginButton.boundingBox();

        expect(emailBox).not.toBeNull();
        expect(passwordBox).not.toBeNull();
        expect(buttonBox).not.toBeNull();

        // Verify elements are within viewport bounds
        if (emailBox && passwordBox && buttonBox) {
          expect(emailBox.x).toBeGreaterThanOrEqual(0);
          expect(passwordBox.x).toBeGreaterThanOrEqual(0);
          expect(buttonBox.x).toBeGreaterThanOrEqual(0);
        }
      },
    );
  }
});
