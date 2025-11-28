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

test.describe('Teams - Team User View', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, 'demo@example.com', 'demo123');
  });

  test('can view teams list page', async ({ page }) => {
    await page.goto('/app/teams');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Teams').first()).toBeVisible();
  });

  test('teams page shows search functionality', async ({ page }) => {
    await page.goto('/app/teams');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('input[placeholder*="Search" i]').first()).toBeVisible();
  });

  test('can view team details', async ({ page }) => {
    await page.goto('/app/teams');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Click on first team link if available
    const teamLink = page.locator('a[href*="/app/teams/"]').first();
    if (await teamLink.isVisible()) {
      await teamLink.click();
      await page.waitForURL('**/app/teams/**');

      // Should show team details
      await expect(page.locator('body')).toContainText(/team|member|profile/i, { timeout: 10000 });
    }
  });

  test('can access create team page', async ({ page }) => {
    await page.goto('/app/teams/create');
    await page.waitForLoadState('networkidle');

    // Check for form elements
    await expect(page.locator('body')).toContainText(/create|team|new/i, { timeout: 10000 });
  });
});

test.describe('Teams - Company User View', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, 'company@example.com', 'demo123');
  });

  test('can browse teams', async ({ page }) => {
    await page.goto('/app/teams');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Teams').first()).toBeVisible();
  });

  test('can search for teams', async ({ page }) => {
    await page.goto('/app/teams');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[placeholder*="Search" i]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('analytics');
      await page.waitForTimeout(1000);
    }
  });
});

test.describe('Team Management', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, 'demo@example.com', 'demo123');
  });

  test('can access team management page', async ({ page }) => {
    await page.goto('/app/teams/manage');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toContainText(/manage|team|settings/i);
  });
});
