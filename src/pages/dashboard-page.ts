import { Page, expect } from '@playwright/test';
import { BasePage } from './base-page';
import { TIMEOUTS } from '@constants/env';

/**
 * Dashboard Page Object
 * Handles all interactions with the dashboard page
 */
export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to dashboard page
   */
  async navigate(): Promise<void> {
    await this.goto('/dashboard');
    await this.waitForLoadState('domcontentloaded');
  }

  /**
   * Verify success dialog is displayed
   * @param expectedMessage - Expected message in the dialog
   */
  async verifySuccessDialog(expectedMessage: string): Promise<void> {
    const successDialog = this.page.getByText(expectedMessage);
    await expect(successDialog).toBeVisible({ timeout: TIMEOUTS.ASSERTION });
  }

  /**
   * Verify success dialog contains text
   * @param expectedText - Expected text in the dialog
   */
  async verifySuccessDialogContains(expectedText: string): Promise<void> {
    const successDialog = this.page.getByText(expectedText, { exact: false });
    await expect(successDialog).toBeVisible({ timeout: TIMEOUTS.ASSERTION });
  }

  /**
   * Wait for success dialog to appear
   * @param message - Success message to wait for
   */
  async waitForSuccessDialog(message: string): Promise<void> {
    const successDialog = this.page.getByText(message);
    await expect(successDialog).toBeVisible({ timeout: TIMEOUTS.ASSERTION });
  }

  /**
   * Get dialog message text
   * @param message - Dialog message to locate
   */
  async getDialogMessage(message: string): Promise<string> {
    const dialogMessage = this.page.getByText(message);
    return (await dialogMessage.textContent()) || '';
  }

  /**
   * Check if success dialog is visible
   * @param message - Success message to check
   */
  async isSuccessDialogVisible(message: string): Promise<boolean> {
    const successDialog = this.page.getByText(message);
    return await successDialog.isVisible();
  }

  /**
   * Check if on dashboard page
   */
  async isOnDashboard(): Promise<boolean> {
    const url = await this.getURL();
    return url.includes('/home');
  }
}
