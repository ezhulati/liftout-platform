import { test, expect } from '@playwright/test';

// Helper to sign in
async function signIn(page: any, email: string, password: string) {
  await page.goto('/auth/signin');
  await page.waitForLoadState('domcontentloaded');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button:has-text("Sign in")');
  await page.waitForURL('**/app/dashboard', { timeout: 30000 });
}

test.describe('Dashboard - Team User', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, 'demo@example.com', 'password');
  });

  test('displays dashboard correctly', async ({ page }) => {
    // Check for key dashboard elements with timeout
    await expect(page.locator('text=Quick actions')).toBeVisible({ timeout: 10000 });

    // Dashboard link should exist in the DOM
    await expect(page.locator('a[href="/app/dashboard"]').first()).toBeAttached();
  });

  test('navigation sidebar works', async ({ page }) => {
    // Check that navigation links exist in the DOM (may be hidden on mobile viewport)
    await expect(page.locator('a[href="/app/dashboard"]').first()).toBeAttached();
    await expect(page.locator('a[href="/app/opportunities"]').first()).toBeAttached();
    await expect(page.locator('a[href="/app/teams"]').first()).toBeAttached();
    await expect(page.locator('a[href="/app/messages"]').first()).toBeAttached();
  });

  test('can navigate to opportunities page', async ({ page }) => {
    await page.goto('/app/opportunities');
    await page.waitForLoadState('domcontentloaded');
    // Page shows "Liftout Opportunities" as the heading
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
  });

  test('can navigate to teams page', async ({ page }) => {
    await page.goto('/app/teams');
    await page.waitForLoadState('domcontentloaded');
    // Team users see "My Team Profile" heading
    await expect(page.locator('h1:has-text("My Team Profile")').first()).toBeVisible({ timeout: 10000 });
  });

  test('can navigate to messages page', async ({ page }) => {
    await page.goto('/app/messages');
    await page.waitForLoadState('domcontentloaded');
    // Check the page loaded successfully with main content
    await expect(page.locator('main').first()).toBeVisible({ timeout: 10000 });
  });

  test('can navigate to profile page', async ({ page }) => {
    await page.goto('/app/profile');
    await page.waitForLoadState('domcontentloaded');
    // Check page loaded
    await expect(page.locator('main').first()).toBeVisible({ timeout: 10000 });
  });

  test('can navigate to settings page', async ({ page }) => {
    await page.goto('/app/settings');
    await page.waitForLoadState('domcontentloaded');
    // Check page loaded
    await expect(page.locator('main').first()).toBeVisible({ timeout: 10000 });
  });

  test('user menu shows correct user name', async ({ page }) => {
    // Click on user menu
    await expect(page.locator('text=Alex Chen')).toBeVisible();
  });

  test('can sign out', async ({ page }) => {
    // Open user menu and sign out
    await page.click('button:has-text("Open user menu"), [aria-label="Open user menu"]');
    await page.click('button:has-text("Sign out")');

    // Should redirect to homepage or signin - wait for navigation to complete
    await page.waitForURL(/\/(auth\/signin)?$/, { timeout: 15000 });
  });
});

test.describe('Dashboard - Company User', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, 'company@example.com', 'password');
  });

  test('displays dashboard correctly', async ({ page }) => {
    // Dashboard link should exist in the DOM
    await expect(page.locator('a[href="/app/dashboard"]').first()).toBeAttached();
  });

  test('user menu shows correct user name', async ({ page }) => {
    await expect(page.locator('text=Sarah Rodriguez')).toBeVisible({ timeout: 10000 });
  });

  test('shows company-specific options', async ({ page }) => {
    // Company users should see Post Liftout Opportunity in Quick Actions
    await expect(page.locator('text=Post Liftout Opportunity')).toBeVisible({ timeout: 10000 });
  });
});
