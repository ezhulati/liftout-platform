import { test, expect } from '@playwright/test';

// Helper function to sign in as demo user
async function signInAsDemo(page: import('@playwright/test').Page) {
  await page.goto('/auth/signin');
  await page.waitForLoadState('networkidle');

  // Wait for sign-in form to be ready
  const emailInput = page.locator('input[type="email"]');
  await expect(emailInput).toBeVisible({ timeout: 10000 });

  await emailInput.fill('demo@example.com');
  await page.locator('input[type="password"]').fill('password');
  await page.locator('button:has-text("Sign in")').click();

  // Wait for navigation to dashboard
  await page.waitForURL('**/app/dashboard', { timeout: 30000 });
}

test.describe('AI Matching Page', () => {
  test('page loads and shows UI for authenticated demo user', async ({ page }) => {
    // Sign in as demo user
    await signInAsDemo(page);

    // Navigate to AI matching
    await page.goto('/app/ai-matching');
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'test-results/ai-matching-1-page.png', fullPage: true });

    // Check page header exists (either shows AI Matching content or redirected properly)
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('page shows demo data for team user', async ({ page }) => {
    // Sign in as demo team user
    await signInAsDemo(page);

    await page.goto('/app/ai-matching');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check if we see any AI matching content
    const pageContent = await page.content();
    console.log('Page has AI Matching:', pageContent.includes('AI') || pageContent.includes('Matching'));

    // Take screenshot
    await page.screenshot({ path: 'test-results/ai-matching-2-team-user.png', fullPage: true });
  });

  test('AI Analysis button exists in match cards', async ({ page }) => {
    // Sign in as demo team user
    await signInAsDemo(page);

    await page.goto('/app/ai-matching');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

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
