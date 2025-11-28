import { test, expect } from '@playwright/test';

test.describe('Landing Pages', () => {
  test('homepage shows hero content correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Verify main headline
    await expect(page.locator('h1:has-text("Acquire teams that deliver from day one")')).toBeVisible();

    // Verify eyebrow text
    await expect(page.locator('text=Tired of hiring individuals who take months to gel?')).toBeVisible();

    // Verify CTA buttons
    await expect(page.locator('text=Browse verified teams').first()).toBeVisible();
    await expect(page.locator('text=List your team').first()).toBeVisible();
  });

  test('for-companies page loads correctly', async ({ page }) => {
    await page.goto('/for-companies');
    await page.waitForLoadState('domcontentloaded');

    // Check page loads with company-focused content
    await expect(page.locator('h1').first()).toBeVisible();
    // CTA says "Browse verified teams"
    await expect(page.locator('text=Browse verified teams').first()).toBeVisible();
  });

  test('for-teams page loads correctly', async ({ page }) => {
    await page.goto('/for-teams');
    await page.waitForLoadState('domcontentloaded');

    // Check page loads with team-focused content
    await expect(page.locator('h1').first()).toBeVisible();
    // CTA says "Register your team"
    await expect(page.locator('text=Register your team').first()).toBeVisible();
  });

  test('homepage has working navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Check header navigation links exist
    await expect(page.locator('a[href="/for-companies"]').first()).toBeVisible();
    await expect(page.locator('a[href="/for-teams"]').first()).toBeVisible();
  });

  test('homepage has working sign in links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Check sign in and sign up links
    await expect(page.locator('a[href="/auth/signin"]').first()).toBeVisible();
    await expect(page.locator('a[href="/auth/signup"]').first()).toBeVisible();
  });
});
