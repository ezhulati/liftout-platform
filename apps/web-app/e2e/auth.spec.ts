import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test.describe('Sign In Page', () => {
    test('displays sign in form correctly', async ({ page }) => {
      await page.goto('/auth/signin');
      await page.waitForLoadState('domcontentloaded');

      // Check page elements
      await expect(page.locator('h2:has-text("Welcome back")')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button:has-text("Sign in")')).toBeVisible();

      // Check demo credentials section
      await expect(page.locator('text=Try demo credentials')).toBeVisible();
    });

    test('can fill demo credentials for team user', async ({ page }) => {
      await page.goto('/auth/signin');
      await page.waitForLoadState('domcontentloaded');

      // Open demo credentials section
      await page.click('text=Try demo credentials');
      await page.click('button:has-text("Team lead")');

      // Verify fields are filled
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');

      await expect(emailInput).toHaveValue('demo@example.com');
      await expect(passwordInput).toHaveValue('password');
    });

    test('can fill demo credentials for company user', async ({ page }) => {
      await page.goto('/auth/signin');
      await page.waitForLoadState('domcontentloaded');

      // Open demo credentials section
      await page.click('text=Try demo credentials');
      await page.click('button:has-text("Company")');

      // Verify fields are filled
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');

      await expect(emailInput).toHaveValue('company@example.com');
      await expect(passwordInput).toHaveValue('password');
    });

    test('team user can sign in and reach dashboard', async ({ page }) => {
      await page.goto('/auth/signin');
      await page.waitForLoadState('domcontentloaded');

      // Fill credentials
      await page.fill('input[type="email"]', 'demo@example.com');
      await page.fill('input[type="password"]', 'password');

      // Submit form
      await page.click('button:has-text("Sign in")');

      // Wait for navigation to dashboard
      await page.waitForURL('**/app/dashboard', { timeout: 30000 });

      // Verify dashboard loaded - use first() to avoid strict mode violation
      await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible({ timeout: 10000 });
    });

    test('company user can sign in and reach dashboard', async ({ page }) => {
      await page.goto('/auth/signin');
      await page.waitForLoadState('domcontentloaded');

      // Fill credentials
      await page.fill('input[type="email"]', 'company@example.com');
      await page.fill('input[type="password"]', 'password');

      // Submit form
      await page.click('button:has-text("Sign in")');

      // Wait for navigation to dashboard
      await page.waitForURL('**/app/dashboard', { timeout: 30000 });

      // Verify dashboard loaded - use first() to avoid strict mode violation
      await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible({ timeout: 10000 });
    });

    test('shows error for invalid credentials', async ({ page }) => {
      await page.goto('/auth/signin');
      await page.waitForLoadState('domcontentloaded');

      // Fill invalid credentials
      await page.fill('input[type="email"]', 'invalid@example.com');
      await page.fill('input[type="password"]', 'wrongpassword');

      // Submit form
      await page.click('button:has-text("Sign in")');

      // Should show error toast
      await expect(page.locator('text=Invalid credentials')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Sign Up Page', () => {
    test('displays sign up form correctly', async ({ page }) => {
      await page.goto('/auth/signup');
      await page.waitForLoadState('domcontentloaded');

      // Check page elements
      await expect(page.locator('h2:has-text("Create your account")')).toBeVisible();
      await expect(page.locator('input#firstName')).toBeVisible();
      await expect(page.locator('input#lastName')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]').first()).toBeVisible();
    });

    test('has link to sign in page', async ({ page }) => {
      await page.goto('/auth/signup');
      await page.waitForLoadState('domcontentloaded');

      await expect(page.locator('a:has-text("Sign in")')).toBeVisible();
      await page.click('a:has-text("Sign in")');
      await page.waitForURL('**/auth/signin');
    });
  });

  test.describe('Protected Routes', () => {
    test('redirects unauthenticated users to signin', async ({ page }) => {
      await page.goto('/app/dashboard');

      // Should redirect to signin
      await page.waitForURL('**/auth/signin**', { timeout: 10000 });
    });
  });
});
