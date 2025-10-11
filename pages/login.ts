import { Page, Locator, expect } from '@playwright/test';
import { LOGIN_URL } from '../config';
import { LoginCredentials } from '../types/user';

export class LoginPage {
  readonly page: Page;
  
  // Locators - use readonly and proper Playwright locator methods
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorCloseButton: Locator;
  readonly credentialsInfo: Locator;
  readonly passwordInfo: Locator;
  readonly loginForm: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize locators using page.locator() - more professional approach
    this.usernameInput = this.page.locator('[data-test="username"]');
    this.passwordInput = this.page.locator('[data-test="password"]');
    this.loginButton = this.page.locator('[data-test="login-button"]');
    this.errorMessage = this.page.locator('[data-test="error"]');
    this.errorCloseButton = this.page.locator('[data-test="error-button"]');
    this.credentialsInfo = this.page.locator('[data-test="login-credentials"]');
    this.passwordInfo = this.page.locator('[data-test="login-password"]');
    this.loginForm = this.page.locator('.login-box');
    this.logo = this.page.locator('.login_logo');
  }

  /**
   * Navigate to the login page
   */
  async goto(): Promise<void> {
    await this.page.goto(LOGIN_URL);
    await this.waitForPageToLoad();
  }

  /**
   * Wait for the login page to fully load
   */
  async waitForPageToLoad(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Fill the username field
   */
  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  /**
   * Fill the password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Click the login button
   */
  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Complete login flow with credentials
   */
  async login(credentials: LoginCredentials): Promise<void> {
    await this.fillUsername(credentials.username);
    await this.fillPassword(credentials.password);
    await this.clickLoginButton();
  }

  /**
   * Get error message text - returns null if no error
   */
  async getErrorText(): Promise<string | null> {
    try {
      return await this.errorMessage.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Close error message
   */
  async closeError(): Promise<void> {
    await this.errorCloseButton.click();
  }

  /**
   * Assert successful login by checking URL navigation
   */
  async expectSuccessfulLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/.*inventory\.html/);
  }

  /**
   * Assert error message contains expected text
   */
  async expectError(expectedText: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedText);
  }

  /**
   * Assert all visual elements are present
   */
  async expectVisualElements(): Promise<void> {
    await expect(this.logo).toBeVisible();
    await expect(this.loginForm).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Assert form placeholders are correct
   */
  async expectCorrectPlaceholders(): Promise<void> {
    await expect(this.usernameInput).toHaveAttribute('placeholder', 'Username');
    await expect(this.passwordInput).toHaveAttribute('placeholder', 'Password');
  }

  /**
   * Assert login button has correct text/value
   */
  async expectLoginButtonText(): Promise<void> {
    await expect(this.loginButton).toHaveAttribute('value', 'Login');
  }

  /**
   * Clear form fields
   */
  async clearForm(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }
}
