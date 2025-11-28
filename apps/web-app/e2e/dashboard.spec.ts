import { test, expect } from '@playwright/test';

// Helper to sign in
async function signIn(page: any, email: string, password: string) {
  await page.goto('/auth/signin');
  await page.waitForLoadState('networkidle');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button:has-text("Sign in")');
  await page.waitForURL('**/app/dashboard', { timeout: 15000 });
}

test.describe('Dashboard - Team User', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, 'demo@example.com', 'demo123');
  });

  test('displays dashboard correctly', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();

    // Check for key dashboard elements
    await expect(page.locator('text=Quick actions')).toBeVisible();
  });

  test('navigation sidebar works', async ({ page }) => {
    // Check sidebar links are visible (use first() for multiple matches)
    await expect(page.locator('a[href="/app/dashboard"]').first()).toBeVisible();
    await expect(page.locator('a[href="/app/opportunities"]').first()).toBeVisible();
    await expect(page.locator('a[href="/app/teams"]').first()).toBeVisible();
    await expect(page.locator('a[href="/app/messages"]').first()).toBeVisible();
  });

  test('can navigate to opportunities page', async ({ page }) => {
    await page.goto('/app/opportunities');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Opportunities').first()).toBeVisible({ timeout: 10000 });
  });

  test('can navigate to teams page', async ({ page }) => {
    await page.goto('/app/teams');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Teams').first()).toBeVisible({ timeout: 10000 });
  });

  test('can navigate to messages page', async ({ page }) => {
    await page.goto('/app/messages');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Messages').first()).toBeVisible({ timeout: 10000 });
  });

  test('can navigate to profile page', async ({ page }) => {
    await page.goto('/app/profile');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Profile').first()).toBeVisible({ timeout: 10000 });
  });

  test('can navigate to settings page', async ({ page }) => {
    await page.goto('/app/settings');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Settings').first()).toBeVisible({ timeout: 10000 });
  });

  test('user menu shows correct user name', async ({ page }) => {
    // Click on user menu
    await expect(page.locator('text=Alex Chen')).toBeVisible();
  });

  test('can sign out', async ({ page }) => {
    // Open user menu and sign out
    await page.click('button:has-text("Open user menu"), [aria-label="Open user menu"]');
    await page.click('button:has-text("Sign out")');

    // Should redirect to homepage or signin
    await page.waitForURL('**/', { timeout: 10000 });
  });
});

test.describe('Dashboard - Company User', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, 'company@example.com', 'demo123');
  });

  test('displays dashboard correctly', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  });

  test('user menu shows correct user name', async ({ page }) => {
    await expect(page.locator('text=Sarah Rodriguez')).toBeVisible();
  });

  test('shows company-specific options', async ({ page }) => {
    // Company users should see Post Opportunity button
    await expect(page.locator('text=Post opportunity')).toBeVisible({ timeout: 10000 });
  });
});
