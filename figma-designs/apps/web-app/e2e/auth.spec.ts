import { test, expect } from '@playwright/test';
import { signIn } from './utils';

test.describe('Authentication Flows', () => {
  test.describe('Sign In Page', () => {
    test('displays sign in form correctly', async ({ page }) => {
      await page.goto('/auth/signin', { waitUntil: 'domcontentloaded' });

      // Check page elements
      await expect(page.locator('h2:has-text("Welcome back")')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button:has-text("Sign in")')).toBeVisible();

      // Check demo credentials section
      await expect(page.locator('text=Try demo credentials')).toBeVisible();
    });

    test('can fill demo credentials for team user', async ({ page }) => {
      await page.goto('/auth/signin', { waitUntil: 'domcontentloaded' });

      const summary = page.locator('summary:has-text("Try demo credentials")');
      await summary.click();
      const teamBtn = page.locator('button:has-text("Team lead")');
      await teamBtn.waitFor({ state: 'visible', timeout: 10000 });
      await teamBtn.click();

      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');

      await expect(emailInput).toHaveValue('demo@example.com', { timeout: 10000 });
      await expect(passwordInput).toHaveValue('password', { timeout: 10000 });
    });

    test('can fill demo credentials for company user', async ({ page }) => {
      await page.goto('/auth/signin', { waitUntil: 'domcontentloaded' });

      const summary = page.locator('summary:has-text("Try demo credentials")');
      await summary.click();
      const companyBtn = page.locator('button:has-text("Company")');
      await companyBtn.waitFor({ state: 'visible', timeout: 10000 });
      await companyBtn.click();

      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');

      await expect(emailInput).toHaveValue('company@example.com', { timeout: 10000 });
      await expect(passwordInput).toHaveValue('password', { timeout: 10000 });
    });

    test('team user can sign in and reach dashboard', async ({ page }) => {
      await signIn(page, { email: 'demo@example.com', password: 'password' });
      await expect(page).toHaveURL(/\/app\/dashboard/, { timeout: 30000 });
      await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible({ timeout: 10000 });
    });

    test('company user can sign in and reach dashboard', async ({ page }) => {
      await signIn(page, { email: 'company@example.com', password: 'password' });
      await expect(page).toHaveURL(/\/app\/dashboard/, { timeout: 30000 });
      await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible({ timeout: 10000 });
    });

    test('shows error for invalid credentials', async ({ page }) => {
      await page.goto('/auth/signin', { waitUntil: 'domcontentloaded' });
      await page.fill('input[type="email"]', 'invalid@example.com');
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.click('button:has-text("Sign in")');
      await expect(page.locator('text=Invalid credentials')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Sign Up Page', () => {
    test('displays sign up form correctly', async ({ page }) => {
      await page.goto('/auth/signup', { waitUntil: 'domcontentloaded' });

      // Check page elements
      await expect(page.locator('h2:has-text("Create your account")')).toBeVisible();
      await expect(page.locator('input#firstName')).toBeVisible();
      await expect(page.locator('input#lastName')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]').first()).toBeVisible();
    });

    test('has link to sign in page', async ({ page }) => {
      await page.goto('/auth/signup', { waitUntil: 'domcontentloaded' });

      await expect(page.locator('a:has-text("Sign in")')).toBeVisible();
      await page.click('a:has-text("Sign in")');
      await page.waitForURL('**/auth/signin');
    });
  });

  test.describe('Protected Routes', () => {
    test.use({ storageState: { cookies: [], origins: [] } });
    test('redirects unauthenticated users to signin', async ({ page }) => {
      await page.context().clearCookies();
      await page.goto('/app/dashboard', { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveURL(/\/auth\/signin/, { timeout: 10000 });
    });
  });
});
