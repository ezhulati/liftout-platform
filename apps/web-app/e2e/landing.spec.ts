import { test, expect } from '@playwright/test';

test.describe('Landing Pages', () => {
  test('homepage shows equal-split hero for both audiences', async ({ page }) => {
    await page.goto('http://localhost:3001/');
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'test-results/homepage.png', fullPage: true });

    // Verify tagline
    await expect(page.locator('text=The Strategic Team Acquisition Platform')).toBeVisible();
    await expect(page.locator('text=Where proven teams meet growth opportunities')).toBeVisible();

    // Verify For Companies section
    await expect(page.locator('text=For Companies')).toBeVisible();
    await expect(page.locator("text=Tired of hiring individuals that don't gel?")).toBeVisible();
    await expect(page.locator('text=Acquire Proven Teams')).toBeVisible();

    // Verify For Teams section
    await expect(page.locator('text=For Teams')).toBeVisible();
    await expect(page.locator('text=Ready for a new challenge together?')).toBeVisible();
    await expect(page.locator('text=Register Your Team')).toBeVisible();
  });

  test('for-companies page loads correctly', async ({ page }) => {
    await page.goto('http://localhost:3001/for-companies');
    await page.waitForLoadState('networkidle');

    await page.screenshot({ path: 'test-results/for-companies.png', fullPage: true });

    await expect(page.locator("text=Tired of hiring individuals that don't gel?")).toBeVisible();
    await expect(page.locator('text=Start Acquiring Proven Teams')).toBeVisible();
  });

  test('for-teams page loads correctly', async ({ page }) => {
    await page.goto('http://localhost:3001/for-teams');
    await page.waitForLoadState('networkidle');

    await page.screenshot({ path: 'test-results/for-teams.png', fullPage: true });

    await expect(page.locator("text=Ready for a new challenge, but don't want to break up your team?")).toBeVisible();
    await expect(page.locator('text=Register Your Team').first()).toBeVisible();
  });
});
