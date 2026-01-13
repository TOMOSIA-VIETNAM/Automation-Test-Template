import { Page } from '@playwright/test';
import { ENV, TIMEOUTS } from '@constants/env';

export interface NavigationOptions {
  url?: string | RegExp;
  timeout?: number;
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
}

export interface WaitOptions {
  timeout?: number;
  state?: 'attached' | 'detached' | 'visible' | 'hidden';
}

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path = ''): Promise<void> {
    const url = path.startsWith('http') ? path : `${ENV.BASE_URL}${path}`;
    await this.page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
  }

  async waitForLoadState(
    state: 'load' | 'domcontentloaded' | 'networkidle' = 'networkidle',
  ): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  async waitForNavigation(options: NavigationOptions = {}): Promise<void> {
    await this.page.waitForURL(options.url || /.*/, {
      timeout: options.timeout || TIMEOUTS.NAVIGATION,
      waitUntil: options.waitUntil || 'networkidle',
    });
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async getURL(): Promise<string> {
    return this.page.url();
  }

  async takeScreenshot(path: string): Promise<void> {
    await this.page.screenshot({ path, fullPage: true });
  }

  async waitForElement(selector: string, options: WaitOptions = {}): Promise<void> {
    await this.page.waitForSelector(selector, {
      timeout: options.timeout || TIMEOUTS.ACTION,
      state: options.state || 'visible',
    });
  }

  async clickElement(selector: string, options?: { timeout?: number }): Promise<void> {
    await this.page.locator(selector).first().click(options);
  }

  async fillInput(selector: string, value: string, options?: { timeout?: number }): Promise<void> {
    await this.page.locator(selector).first().fill(value, options);
  }

  async getText(selector: string): Promise<string | null> {
    return await this.page.locator(selector).first().textContent();
  }

  async isVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).first().isVisible();
  }

  async isEnabled(selector: string): Promise<boolean> {
    return await this.page.locator(selector).first().isEnabled();
  }

  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  async goBack(): Promise<void> {
    await this.page.goBack({ waitUntil: 'networkidle' });
  }

  async goForward(): Promise<void> {
    await this.page.goForward({ waitUntil: 'networkidle' });
  }
}
