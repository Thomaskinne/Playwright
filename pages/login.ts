import { Page } from '@playwright/test';
import { LOGIN_URL, users } from '../config';

export class LoginPage {
  private page: Page;
  private usernameInput = '[data-tests="username"]';
  private passwordInput = '[data-tests="password"]'; 
  private loginButton = '[data-tests="login-button"]';
  private userNames = '[data-test="login-credentials"]';

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to the login page
  async navigateTo(): Promise<void> {
    await this.page.goto(LOGIN_URL);
  }

  // Fill in the username
  async enterUsername(username: string): Promise<void> {
    await this.page.fill(this.usernameInput, username);
  }

  // Fill in the password
  async enterPassword(password: string): Promise<void> {
    await this.page.fill(this.passwordInput, password);
  }

  // Click the login button
  async clickLogin(): Promise<void> {
    await this.page.click(this.loginButton);
  }

  // Perform the full login process using a user object from config
  async login(user: { username: string; password: string }): Promise<void> {
    await this.enterUsername(user.username);
    await this.enterPassword(user.password);
    await this.clickLogin();
  }

  // Optional: verify all usernames displayed on the login page
  async verifyUserNames(): Promise<string[]> {
    return this.page.locator(this.userNames).allTextContents();
  }
}
