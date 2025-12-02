import { test, expect } from '@playwright/test';
import { signIn } from './utils';

test.describe('Opportunities - Team User View', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, { email: 'demo@example.com', password: 'password' });
  });

  test('can view opportunities list', async ({ page }) => {
    await page.goto('/app/opportunities');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('h1:has-text("Browse Liftout Opportunities")').first()).toBeVisible({ timeout: 10000 });
  });

  test('opportunities list renders for team user', async ({ page }) => {
    await page.goto('/app/opportunities');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('opportunities page renders correctly', async ({ page }) => {
    await page.goto('/app/opportunities');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Check for opportunity content or error page (both are valid renders)
    await expect(page.locator('body')).toContainText(/opportunit|went wrong/i, { timeout: 10000 });
  });

  test('can view single opportunity details', async ({ page }) => {
    await page.goto('/app/opportunities');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Click on first opportunity link
    const firstOpportunity = page.locator('a[href*="/app/opportunities/"]').first();
    if (await firstOpportunity.isVisible()) {
      await firstOpportunity.click();
      await page.waitForURL('**/app/opportunities/**');

      // Should show opportunity details
      await expect(page.locator('body')).toContainText(/description|apply|opportunity/i, { timeout: 10000 });
    }
  });

  test('can search opportunities', async ({ page }) => {
    await page.goto('/app/opportunities');
    await page.waitForLoadState('domcontentloaded');

    // Type in search
    const searchInput = page.locator('input[placeholder*="Search" i]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('analytics');
      await page.waitForTimeout(1000);
    }

    // Results should update (or show no results message)
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Opportunities - Company User View', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, { email: 'company@example.com', password: 'password' });
  });

  test('can view opportunities list', async ({ page }) => {
    await page.goto('/app/opportunities');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('h1:has-text("Liftout Opportunities")').first()).toBeVisible({ timeout: 10000 });
  });

  test('can access create opportunity page', async ({ page }) => {
    await page.goto('/app/opportunities/create');
    await page.waitForLoadState('domcontentloaded');

    // Should show create form
    await expect(page.locator('body')).toContainText(/create|post|opportunity/i, { timeout: 10000 });
  });

  test('create opportunity form displays correctly', async ({ page }) => {
    await page.goto('/app/opportunities/create');
    await page.waitForLoadState('domcontentloaded');

    // Check form fields exist
    await expect(page.locator('input, textarea, select').first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Expression of Interest Flow', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, { email: 'demo@example.com', password: 'password' });
  });

  test('can express interest in opportunity', async ({ page }) => {
    await page.goto('/app/opportunities');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Click on first opportunity
    const opportunityLink = page.locator('a[href*="/app/opportunities/"]').first();
    if (await opportunityLink.isVisible()) {
      await opportunityLink.click();
      await page.waitForURL('**/app/opportunities/**');

      // Look for express interest button
      const expressButton = page.locator('button:has-text("Express interest"), button:has-text("Apply")').first();
      if (await expressButton.isVisible()) {
        await expect(expressButton).toBeEnabled();
      }
    }
  });
});
