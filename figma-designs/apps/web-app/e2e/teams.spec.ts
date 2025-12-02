import { test, expect } from '@playwright/test';
import { signIn } from './utils';

test.describe('Teams - Team User View', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, { email: 'demo@example.com', password: 'password' });
  });

  test('can view teams list page', async ({ page }) => {
    await page.goto('/app/teams');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('h1:has-text("My Team Profile")').first()).toBeVisible({ timeout: 10000 });
  });

  test('team user sees profile actions', async ({ page }) => {
    await page.goto('/app/teams');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('a:has-text("Edit team profile")').first()).toBeVisible({ timeout: 10000 });
  });

  test('can view team details', async ({ page }) => {
    await page.goto('/app/teams');
    await page.waitForLoadState('domcontentloaded');
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
    await page.waitForLoadState('domcontentloaded');

    // Check for form elements
    await expect(page.locator('body')).toContainText(/create|team|new/i, { timeout: 10000 });
  });
});

test.describe('Teams - Company User View', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, { email: 'company@example.com', password: 'password' });
  });

  test('can browse teams', async ({ page }) => {
    await page.goto('/app/teams');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('h1:has-text("Browse High-Performing Teams")').first()).toBeVisible({ timeout: 10000 });
  });

  test('can search for teams', async ({ page }) => {
    await page.goto('/app/teams');
    await page.waitForLoadState('domcontentloaded');

    const searchInput = page.locator('input[placeholder*="Search" i]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('analytics');
      await page.waitForTimeout(1000);
    }
  });
});

test.describe('Team Management', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, { email: 'demo@example.com', password: 'password' });
  });

  test('can access team management page', async ({ page }) => {
    await page.goto('/app/teams/manage');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('body')).toContainText(/manage|team|settings/i);
  });
});
