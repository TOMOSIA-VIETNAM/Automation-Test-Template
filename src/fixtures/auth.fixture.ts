import { test as base, Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '@pages/login-page';

/**
 * Test credentials for authentication
 */
export const TEST_CREDENTIALS = {
  email: 'admin02@libman.com',
  password: '000000',
};

/**
 * Custom test fixture that provides an authenticated page
 * This fixture performs login once and reuses the session for all tests
 */
export type AuthFixtures = {
  authenticatedPage: Page;
  authenticatedContext: BrowserContext;
};

/**
 * Extended test with authentication fixtures
 */
export const test = base.extend<AuthFixtures>({
  authenticatedContext: async ({ browser }, use) => {
    // Create a new browser context
    const context = await browser.newContext();
    const page = await context.newPage();

    // Perform login
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);

    // Wait for successful login and navigation to dashboard
    await page.waitForURL(/.*home|.*dashboard/, { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Close the temporary page but keep the context
    await page.close();

    // Use the authenticated context
    await use(context);

    // Cleanup
    await context.close();
  },

  authenticatedPage: async ({ authenticatedContext }, use) => {
    // Create a new page in the authenticated context
    const page = await authenticatedContext.newPage();

    // Use the authenticated page
    await use(page);

    // Page cleanup is handled automatically
  },
});

export { expect } from '@playwright/test';
