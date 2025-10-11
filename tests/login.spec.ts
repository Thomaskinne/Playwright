import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { users } from '../config';
import { LoginCredentials } from '../types/user';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test.describe('Successful Login Scenarios', () => {
    test('should login successfully with standard user', async () => {
      await loginPage.login(users.standard);
      await loginPage.expectSuccessfulLogin();
    });

    test('should login successfully with problem user', async () => {
      await loginPage.login(users.problem);
      await loginPage.expectSuccessfulLogin();
    });

    test('should login successfully with performance glitch user', async () => {
      await loginPage.login(users.performanceGlitch);
      await loginPage.expectSuccessfulLogin();
    });

    test('should login successfully with error user', async () => {
      await loginPage.login(users.error);
      await loginPage.expectSuccessfulLogin();
    });

    test('should login successfully with visual user', async () => {
      await loginPage.login(users.visual);
      await loginPage.expectSuccessfulLogin();
    });
  });

  test.describe('Failed Login Scenarios', () => {
    test('should show error for locked out user', async () => {
      await loginPage.login(users.lockedOut);
      await loginPage.expectError('Epic sadface: Sorry, this user has been locked out.');
    });

    test('should show error for invalid credentials', async () => {
      const invalidCredentials: LoginCredentials = {
        username: 'invalid_user',
        password: 'invalid_password'
      };
      
      await loginPage.login(invalidCredentials);
      await loginPage.expectError('Epic sadface: Username and password do not match any user in this service');
    });

    test('should show error for empty username', async () => {
      const emptyUsername: LoginCredentials = {
        username: '',
        password: 'some_password'
      };
      
      await loginPage.login(emptyUsername);
      await loginPage.expectError('Epic sadface: Username is required');
    });
  });

  test.describe('Error Message Handling', () => {
    test('should be able to close error messages', async () => {
      await loginPage.login(users.lockedOut);
      await expect(loginPage.errorMessage).toBeVisible();
      
      await loginPage.closeError();
      await expect(loginPage.errorMessage).not.toBeVisible();
    });

    test('should retain form values after error', async ({ page }) => {
      const credentials: LoginCredentials = {
        username: 'standard_user',
        password: 'wrong_password'
      };
      
      await loginPage.login(credentials);
      await expect(loginPage.errorMessage).toBeVisible();
      
      // Verify form retains values
      await expect(loginPage.usernameInput).toHaveValue('standard_user');
      await expect(loginPage.passwordInput).toHaveValue('wrong_password');
    });
  });
});

test.describe('UI Components Validation', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display all required visual elements', async ({ page }) => {
    await loginPage.expectVisualElements();
    await expect(page).toHaveTitle('Swag Labs');
  });

  test('should have correct form field placeholders', async () => {
    await loginPage.expectCorrectPlaceholders();
  });

  test('should have correct login button text', async () => {
    await loginPage.expectLoginButtonText();
  });

  test('should display credential information', async () => {
    // Verify credentials information is visible
    await expect(loginPage.credentialsInfo).toBeVisible();
    await expect(loginPage.passwordInfo).toBeVisible();
    
    // Verify content
    await expect(loginPage.credentialsInfo).toContainText('Accepted usernames are');
    await expect(loginPage.passwordInfo).toContainText('secret_sauce');
  });

  test('should have enabled login button by default', async () => {
    await expect(loginPage.loginButton).toBeEnabled();
  });
});

test.describe('Form Interactions', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should allow typing in username field', async () => {
    await loginPage.fillUsername('test_user');
    await expect(loginPage.usernameInput).toHaveValue('test_user');
  });

  test('should allow typing in password field', async () => {
    await loginPage.fillPassword('test_password');
    await expect(loginPage.passwordInput).toHaveValue('test_password');
  });

  test('should clear form fields', async () => {
    await loginPage.fillUsername('test_user');
    await loginPage.fillPassword('test_password');
    
    await loginPage.clearForm();
    
    await expect(loginPage.usernameInput).toHaveValue('');
    await expect(loginPage.passwordInput).toHaveValue('');
  });
});

// Visual regression tests (separate describe block)
test.describe('Visual Regression Tests', () => {
  test('should match login page visual baseline', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Take screenshot for visual comparison
    await expect(page).toHaveScreenshot('login-page-baseline.png');
  });

  test('should match error state visual baseline', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    await loginPage.login(users.lockedOut);
    await expect(loginPage.errorMessage).toBeVisible();
    
    // Take screenshot of error state
    await expect(page).toHaveScreenshot('login-page-error-state.png');
  });
});
