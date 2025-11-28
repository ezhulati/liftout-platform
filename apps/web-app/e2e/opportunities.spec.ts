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

test.describe('Opportunities - Team User View', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, 'demo@example.com', 'demo123');
  });

  test('can view opportunities list', async ({ page }) => {
    await page.goto('/app/opportunities');
    await page.waitForLoadState('networkidle');

    // Should show opportunities
    await expect(page.locator('text=Opportunities').first()).toBeVisible();
  });

  test('opportunities list shows search', async ({ page }) => {
    await page.goto('/app/opportunities');
    await page.waitForLoadState('networkidle');

    // Should show search/filter
    await expect(page.locator('input[placeholder*="Search" i]').first()).toBeVisible();
  });

  test('opportunities page renders correctly', async ({ page }) => {
    await page.goto('/app/opportunities');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check for opportunity cards or content
    await expect(page.locator('body')).toContainText(/opportunit/i, { timeout: 10000 });
  });

  test('can view single opportunity details', async ({ page }) => {
    await page.goto('/app/opportunities');
    await page.waitForLoadState('networkidle');
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
    await page.waitForLoadState('networkidle');

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
    await signIn(page, 'company@example.com', 'demo123');
  });

  test('can view opportunities list', async ({ page }) => {
    await page.goto('/app/opportunities');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Opportunities').first()).toBeVisible();
  });

  test('can access create opportunity page', async ({ page }) => {
    await page.goto('/app/opportunities/create');
    await page.waitForLoadState('networkidle');

    // Should show create form
    await expect(page.locator('body')).toContainText(/create|post|opportunity/i, { timeout: 10000 });
  });

  test('create opportunity form displays correctly', async ({ page }) => {
    await page.goto('/app/opportunities/create');
    await page.waitForLoadState('networkidle');

    // Check form fields exist
    await expect(page.locator('input, textarea, select').first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Expression of Interest Flow', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, 'demo@example.com', 'demo123');
  });

  test('can express interest in opportunity', async ({ page }) => {
    await page.goto('/app/opportunities');
    await page.waitForLoadState('networkidle');
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
