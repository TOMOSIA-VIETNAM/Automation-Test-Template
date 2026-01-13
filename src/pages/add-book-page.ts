import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';
import { TIMEOUTS } from '@constants/env';

/**
 * Add Book Page Object
 * Handles all interactions with the add book page
 */
export class AddBookPage extends BasePage {
  // Form field locators
  readonly titleInput: Locator;
  readonly categoryDropdown: Locator;
  readonly authorInput: Locator;
  readonly publisherInput: Locator;
  readonly publishDateInput: Locator;
  readonly isbnInput: Locator;
  readonly scoreInput: Locator;
  readonly quantityInput: Locator;
  readonly submitButton: Locator;

  // Error message locators
  readonly categoryError: Locator;
  readonly authorError: Locator;
  readonly publisherError: Locator;
  readonly publishDateError: Locator;
  readonly scoreError: Locator;
  readonly quantityError: Locator;
  readonly isbnError: Locator;
  readonly genericError: Locator;

  // Success dialog
  readonly successDialog: Locator;

  constructor(page: Page) {
    super(page);
    // Form fields
    this.titleInput = page.getByRole('textbox', { name: '書名を入力' });
    this.categoryDropdown = page.getByRole('combobox', { name: 'カテゴリー' });
    this.authorInput = page.getByRole('textbox', { name: '著者名を入力' });
    this.publisherInput = page.getByRole('textbox', { name: '出版社名を入力' });
    this.publishDateInput = page.getByRole('textbox', { name: '日付を選択' });
    this.isbnInput = page.getByRole('textbox', { name: 'ISBNを入力' });
    this.scoreInput = page.getByRole('spinbutton', { name: '評価' });
    this.quantityInput = page.getByRole('spinbutton', { name: '数量' });
    this.submitButton = page.getByRole('button', { name: '送信' });

    // Error messages
    this.categoryError = page.getByText('カテゴリーを選択してください');
    this.authorError = page.getByText('著者名を入力してください');
    this.publisherError = page.getByText('出版社名を入力してください');
    this.publishDateError = page.getByText('日付を選択してください');
    this.scoreError = page.getByText('この欄は空にできません');
    this.quantityError = page.getByText('この欄は空にできません');
    this.isbnError = page.getByText('不正なISBN');
    this.genericError = page.getByText('0より大きい数値を入力してください');

    // Success dialog
    this.successDialog = page.getByText('送信されました');
  }

  /**
   * Navigate to add book page
   */
  async navigate(): Promise<void> {
    await this.goto('/add-book');
    await this.waitForLoadState('domcontentloaded');
  }

  /**
   * Fill title field
   */
  async fillTitle(title: string): Promise<void> {
    await this.titleInput.fill(title);
  }

  /**
   * Select category from dropdown
   */
  async selectCategory(category: string): Promise<void> {
    await this.categoryDropdown.click();
    await this.page.getByRole('option', { name: category }).click();
  }

  /**
   * Fill author field
   */
  async fillAuthor(author: string): Promise<void> {
    await this.authorInput.fill(author);
  }

  /**
   * Fill publisher field
   */
  async fillPublisher(publisher: string): Promise<void> {
    await this.publisherInput.fill(publisher);
  }

  /**
   * Fill publish date field
   */
  async fillPublishDate(date: string): Promise<void> {
    await this.publishDateInput.fill(date);
  }

  /**
   * Fill ISBN field
   */
  async fillISBN(isbn: string): Promise<void> {
    await this.isbnInput.fill(isbn);
  }

  /**
   * Fill score field
   */
  async fillScore(score: string): Promise<void> {
    await this.scoreInput.fill(score);
  }

  /**
   * Fill quantity field
   */
  async fillQuantity(quantity: string): Promise<void> {
    await this.quantityInput.fill(quantity);
  }

  /**
   * Click submit button
   */
  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Fill all book details
   */
  async fillBookDetails(data: {
    title?: string;
    category?: string;
    author?: string;
    publisher?: string;
    publishDate?: string;
    isbn?: string;
    score?: string;
    quantity?: string;
  }): Promise<void> {
    if (data.title) await this.fillTitle(data.title);
    if (data.category) await this.selectCategory(data.category);
    if (data.author) await this.fillAuthor(data.author);
    if (data.publisher) await this.fillPublisher(data.publisher);
    if (data.publishDate) await this.fillPublishDate(data.publishDate);
    if (data.isbn) await this.fillISBN(data.isbn);
    if (data.score) await this.fillScore(data.score);
    if (data.quantity) await this.fillQuantity(data.quantity);
  }

  /**
   * Verify category error is displayed
   */
  async verifyCategoryError(): Promise<void> {
    await expect(this.categoryError).toBeVisible({ timeout: TIMEOUTS.ASSERTION });
  }

  /**
   * Verify author error is displayed
   */
  async verifyAuthorError(): Promise<void> {
    await expect(this.authorError).toBeVisible({ timeout: TIMEOUTS.ASSERTION });
  }

  /**
   * Verify publisher error is displayed
   */
  async verifyPublisherError(): Promise<void> {
    await expect(this.publisherError).toBeVisible({ timeout: TIMEOUTS.ASSERTION });
  }

  /**
   * Verify publish date error is displayed
   */
  async verifyPublishDateError(): Promise<void> {
    await expect(this.publishDateError).toBeVisible({ timeout: TIMEOUTS.ASSERTION });
  }

  /**
   * Verify score/quantity empty error is displayed
   */
  async verifyEmptyFieldError(): Promise<void> {
    await expect(this.scoreError.or(this.quantityError)).toBeVisible({
      timeout: TIMEOUTS.ASSERTION,
    });
  }

  /**
   * Verify invalid ISBN error is displayed
   */
  async verifyISBNError(): Promise<void> {
    await expect(this.isbnError).toBeVisible({ timeout: TIMEOUTS.ASSERTION });
  }

  /**
   * Verify score validation error (value must be greater than 0)
   */
  async verifyScoreValidationError(): Promise<void> {
    await expect(this.genericError).toBeVisible({ timeout: TIMEOUTS.ASSERTION });
  }

  /**
   * Verify success dialog is displayed
   */
  async verifySuccessDialog(): Promise<void> {
    await expect(this.successDialog).toBeVisible({ timeout: TIMEOUTS.ASSERTION });
  }

  /**
   * Get all category options
   */
  async getCategoryOptions(): Promise<string[]> {
    await this.categoryDropdown.click();
    const options = await this.page.getByRole('option').allTextContents();
    await this.page.keyboard.press('Escape');
    return options;
  }

  /**
   * Verify category dropdown is populated
   */
  async verifyCategoryDropdownPopulated(): Promise<void> {
    const options = await this.getCategoryOptions();
    expect(options.length).toBeGreaterThan(0);
  }

  /**
   * Check if on add book page
   */
  async isOnAddBookPage(): Promise<boolean> {
    const url = await this.getURL();
    return url.includes('/add-book');
  }

  /**
   * Verify error message by text
   */
  async verifyErrorMessage(message: string): Promise<void> {
    const errorElement = this.page.getByText(message);
    await expect(errorElement).toBeVisible({ timeout: TIMEOUTS.ASSERTION });
  }
}
