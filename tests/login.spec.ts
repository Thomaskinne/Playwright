import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { users } from '../config';

test.describe('SauceDemo Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateTo();
  });

  test('Standard user should log in successfully', async ({ page }) => {
    await loginPage.login(users.standard);
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('Locked out user should see account locked error', async () => {
    await loginPage.login(users.lockedOut);
    const errorText = await loginPage.getErrorMessage();
    await expect(errorText).toContain('Sorry, this user has been locked out.');
  });

  test('Problem user should log in but trigger problem behaviors', async ({ page }) => {
    await loginPage.login(users.problem);
    await expect(page).toHaveURL(/inventory.html/);
    // Add additional assertions for problem behaviors here
  });

  test('Performance glitch user should log in with potential slow loading', async ({ page }) => {
    await loginPage.login(users.performanceGlitch);
    await expect(page).toHaveURL(/inventory.html/);
    // Optionally check performance/glitch-related behaviors
  });

  test('Error user should see a specific error message', async () => {
    await loginPage.login(users.error);
    const errorText = await loginPage.getErrorMessage();
    await expect(errorText).toContain(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('Visual user should log in successfully', async ({ page }) => {
    await loginPage.login(users.visual);
    await expect(page).toHaveURL(/inventory.html/);
    // Optionally check visual differences
  });

  test('Should display all usernames on the login page', async () => {
    const displayedUsernames = await loginPage.getDisplayedUserNames();
    const expectedUsernames = Object.values(users).map(user => user.username);
    expect(displayedUsernames).toEqual(expectedUsernames);
  });
});
