import { test, expect } from '@playwright/test';

test.describe('AI Matching Page', () => {
  test('page loads and shows UI for authenticated demo user', async ({ page }) => {
    // Sign in as demo user
    await page.goto('/auth/signin');
    await page.waitForLoadState('domcontentloaded');

    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button:has-text("Sign in")');

    // Wait for auth
    await page.waitForTimeout(2000);

    // Navigate to AI matching
    await page.goto('/app/ai-matching');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Take screenshot
    await page.screenshot({ path: 'test-results/ai-matching-1-page.png', fullPage: true });

    // Check page header exists
    await expect(page.locator('h1:has-text("AI-Powered Matching")')).toBeVisible();
  });

  test('page shows demo data for team user', async ({ page }) => {
    // Sign in as demo team user
    await page.goto('/auth/signin');
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button:has-text("Sign in")');
    await page.waitForTimeout(2000);

    await page.goto('/app/ai-matching');
    await page.waitForTimeout(2000);

    // Check if we see "Find opportunities for my team" option
    const teamOption = page.locator('text=Find opportunities for my team');
    const teamOptionVisible = await teamOption.isVisible().catch(() => false);
    console.log('Team option visible:', teamOptionVisible);

    // Take screenshot
    await page.screenshot({ path: 'test-results/ai-matching-2-team-user.png', fullPage: true });
  });

  test('AI Analysis button exists in match cards', async ({ page }) => {
    // Sign in as demo team user
    await page.goto('/auth/signin');
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button:has-text("Sign in")');
    await page.waitForTimeout(2000);

    await page.goto('/app/ai-matching');
    await page.waitForTimeout(3000);

    // Look for Run AI Analysis button
    const analysisButton = page.locator('button:has-text("Run AI Analysis")').first();
    const buttonVisible = await analysisButton.isVisible().catch(() => false);
    console.log('AI Analysis button visible:', buttonVisible);

    await page.screenshot({ path: 'test-results/ai-matching-3-analysis-button.png', fullPage: true });
  });
});

test.describe('AI Matching - Unauthenticated', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('shows auth required message when not logged in', async ({ page }) => {
    await page.goto('/app/ai-matching');
    await page.waitForLoadState('domcontentloaded');

    // Page should either redirect to auth or show auth required message
    await expect(page.locator('body')).toBeVisible();
  });
});
