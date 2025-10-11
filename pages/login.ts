import { Page } from '@playwright/test';
import { LOGIN_URL } from '../config';

export class LoginPage {
  private page: Page;
  private usernameInput = '[data-tests="username"]';
  private passwordInput = '[data-tests="password"]';
  private loginButton = '[data-tests="login-button"]';
  private userNames = '[data-test="login-credentials"]';
  private errorMessageLocator = '[data-test="error"]';

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(): Promise<void> {
    await this.page.goto(LOGIN_URL);
  }

  async enterUsername(username: string): Promise<void> {
    await this.page.fill(this.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.page.fill(this.passwordInput, password);
  }

  async clickLogin(): Promise<void> {
    await this.page.click(this.loginButton);
  }

  async login(user: { username: string; password: string }): Promise<void> {
    await this.enterUsername(user.username);
    await this.enterPassword(user.password);
    await this.clickLogin();
  }

  // TS-safe: always returns a string, never null
  async getErrorMessage(): Promise<string> {
    const text = await this.page.locator(this.errorMessageLocator).textContent();
    return text || '';
  }

  async getDisplayedUserNames(): Promise<string[]> {
    return this.page.locator(this.userNames).allTextContents();
  }
}
