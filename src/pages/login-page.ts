import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';
import { ENV, TIMEOUTS } from '@constants/env';

/**
 * Login Page Object
 * Handles all interactions with the login page
 */
export class LoginPage extends BasePage {
  // Locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly successMessage: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    super(page);
    // Use getByRole for better accessibility and reliability
    this.emailInput = page.getByRole('textbox', { name: 'メールアドレスを入力' });
    this.passwordInput = page.getByRole('textbox', { name: 'パスワードを入力' });
    this.loginButton = page.getByRole('button', { name: 'ログイン' });
    this.errorMessage = page.getByText('メールアドレスまたはパスワードが間違っています');
    this.emailError = page.getByText('メールアドレスを入力してください');
    this.passwordError = page.getByText('パスワードを入力してください');
    this.successMessage = page.getByText('ログインに成功しました');
    this.logo = page.getByText('ログイン').first();
  }

  /**
   * Navigate to login page
   */
  async navigate(): Promise<void> {
    await this.goto(ENV.LOGIN_PATH);
    await this.waitForLoadState('domcontentloaded');
  }

  /**
   * Fill email field
   * @param email - Email address to enter
   */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Fill password field
   * @param password - Password to enter
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Click login button
   */
  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Perform login with credentials
   * @param email - Email address
   * @param password - Password
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  /**
   * Wait for login to complete and redirect
   * @param expectedUrl - URL pattern to wait for (default: dashboard)
   */
  async waitForLoginSuccess(expectedUrl?: string | RegExp): Promise<void> {
    await this.waitForNavigation({
      url: expectedUrl || /\/dashboard/,
      timeout: TIMEOUTS.NAVIGATION,
      waitUntil: 'domcontentloaded',
    });
  }

  /**
   * Verify email validation error
   * @param expectedMessage - Expected error message
   */
  async verifyEmailError(expectedMessage: string): Promise<void> {
    await expect(this.emailError).toBeVisible({ timeout: TIMEOUTS.ASSERTION });
    await expect(this.emailError).toHaveText(expectedMessage);
  }

  /**
   * Verify password validation error
   * @param expectedMessage - Expected error message
   */
  async verifyPasswordError(expectedMessage: string): Promise<void> {
    await expect(this.passwordError).toBeVisible({ timeout: TIMEOUTS.ASSERTION });
    await expect(this.passwordError).toHaveText(expectedMessage);
  }

  /**
   * Verify success message
   * @param expectedMessage - Expected success message
   */
  async verifySuccessMessage(expectedMessage: string): Promise<void> {
    await expect(this.successMessage).toBeVisible({ timeout: TIMEOUTS.ASSERTION });
    await expect(this.successMessage).toHaveText(expectedMessage);
  }

  /**
   * Clear login form
   */
  async clearForm(): Promise<void> {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Check if login button is enabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }

  /**
   * Check if on login page
   */
  async isOnLoginPage(): Promise<boolean> {
    const url = await this.getURL();
    return url.includes('/login');
  }

  /**
   * Verify ui of login page
   */
  async verifyLoginPageUI(): Promise<void> {
    await expect(this.logo).toBeVisible({ timeout: TIMEOUTS.ASSERTION });
    await expect(this.emailInput).toBeVisible({ timeout: TIMEOUTS.ASSERTION });
    await expect(this.passwordInput).toBeVisible({ timeout: TIMEOUTS.ASSERTION });
    await expect(this.loginButton).toBeVisible({ timeout: TIMEOUTS.ASSERTION });
  }
}
