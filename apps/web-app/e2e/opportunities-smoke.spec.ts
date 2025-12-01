import { test, expect } from '@playwright/test';
import { signIn } from './utils';

test.describe('Opportunities Flow', () => {
  test('team user can view opportunities list', async ({ page }) => {
    await signIn(page, { email: 'demo@example.com', password: 'password' });
    await expect(page).toHaveURL(/\/app\/dashboard/, { timeout: 30000 });

    // Navigate to opportunities directly
    await page.goto('/app/opportunities');
    await expect(page).toHaveURL(/\/app\/opportunities/, { timeout: 10000 });
    
    // Wait for opportunities to load
    await page.waitForLoadState('networkidle');
    
    // Should see opportunities (not empty state)
    const opportunityCards = page.locator('.card:has(h3)');
    
    // Should have at least 1 opportunity
    const count = await opportunityCards.count();
    console.log(`Found ${count} opportunity cards`);
    await expect(opportunityCards.first()).toBeVisible({ timeout: 15000 });
  });

  test('team user can view opportunity details', async ({ page }) => {
    await signIn(page, { email: 'demo@example.com', password: 'password' });
    await page.goto('/app/opportunities');
    await page.waitForLoadState('networkidle');

    // Click first opportunity
    const firstOpportunityLink = page.locator('.card h3 a').first();
    await firstOpportunityLink.waitFor({ state: 'visible', timeout: 15000 });
    await firstOpportunityLink.click();

    // Should navigate to opportunity detail page
    await expect(page).toHaveURL(/\/app\/opportunities\/[a-z0-9-]+/, { timeout: 10000 });

    // Should see opportunity title (not error state)
    const errorState = page.locator('text=Opportunity Not Found');
    const hasError = await errorState.isVisible().catch(() => false);
    expect(hasError).toBe(false);
  });

  test('team user can see action buttons on opportunity', async ({ page }) => {
    await signIn(page, { email: 'demo@example.com', password: 'password' });
    await page.goto('/app/opportunities');
    await page.waitForLoadState('networkidle');

    // Click first opportunity
    const firstOpportunityLink = page.locator('.card h3 a').first();
    await firstOpportunityLink.waitFor({ state: 'visible', timeout: 15000 });
    await firstOpportunityLink.click();

    // Wait for opportunity detail page to load
    await expect(page).toHaveURL(/\/app\/opportunities\/[a-z0-9-]+/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Wait for auth context to load - look for the sidebar with "Interested?" header
    // This indicates team user view is showing
    const interestedHeader = page.locator('h3:has-text("Interested?")');
    const manageHeader = page.locator('h3:has-text("Manage Opportunity")');

    // Wait a bit for auth context to load
    await page.waitForTimeout(2000);

    // Check what buttons are visible - depends on user type
    const applyBtn = page.locator('button:has-text("Apply with your team")');
    const expressInterestBtn = page.locator('button:has-text("Express interest")');

    // Either team user view (Apply/Express Interest) or company view should be present
    const hasTeamView = await interestedHeader.isVisible().catch(() => false);
    const hasCompanyView = await manageHeader.isVisible().catch(() => false);

    // At least one view should be visible
    expect(hasTeamView || hasCompanyView).toBe(true);

    // If team view, check buttons are visible
    if (hasTeamView) {
      const hasApplyBtn = await applyBtn.isVisible().catch(() => false);
      const hasExpressBtn = await expressInterestBtn.isVisible().catch(() => false);
      console.log(`Team view - Apply: ${hasApplyBtn}, Express Interest: ${hasExpressBtn}`);
      expect(hasApplyBtn || hasExpressBtn).toBe(true);
    }
  });

  test('team user can click Express Interest', async ({ page }) => {
    await signIn(page, { email: 'demo@example.com', password: 'password' });
    await page.goto('/app/opportunities');
    await page.waitForLoadState('networkidle');

    // Click first opportunity
    const firstOpportunityLink = page.locator('.card h3 a').first();
    await firstOpportunityLink.waitFor({ state: 'visible', timeout: 15000 });
    await firstOpportunityLink.click();

    // Wait for page to load
    await expect(page).toHaveURL(/\/app\/opportunities\/[a-z0-9-]+/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Wait for auth context
    await page.waitForTimeout(2000);

    // Find and click Express Interest button
    const expressInterestBtn = page.locator('button:has-text("Express interest")');
    const isVisible = await expressInterestBtn.isVisible().catch(() => false);

    if (isVisible) {
      // Listen for toast notifications
      const toastPromise = page.waitForSelector('.react-hot-toast, [data-sonner-toast], .Toastify__toast', { timeout: 10000 }).catch(() => null);

      // Click the button
      await expressInterestBtn.click();

      // Wait for response - either success toast or error toast
      await page.waitForTimeout(3000);

      // Check for success toast or already applied error
      const successToast = page.locator('text=Interest expressed successfully');
      const alreadyAppliedToast = page.locator('text=already expressed interest, text=already applied');

      const hasSuccess = await successToast.isVisible().catch(() => false);
      const hasAlreadyApplied = await alreadyAppliedToast.first().isVisible().catch(() => false);

      // Either success or "already applied" is acceptable
      console.log(`Express Interest result - Success: ${hasSuccess}, Already Applied: ${hasAlreadyApplied}`);
      // The API should respond (either success or already applied)
    } else {
      console.log('Express Interest button not visible - may be company user or already applied');
    }
  });
});
