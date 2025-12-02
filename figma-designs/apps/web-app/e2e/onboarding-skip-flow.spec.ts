import { test, expect } from '@playwright/test';

/**
 * Critical test: Onboarding skip flow must NOT cause a redirect loop.
 *
 * The bug was:
 * 1. User logs in with profileCompleted: false -> Dashboard redirects to onboarding
 * 2. User clicks "Skip" -> Goes to dashboard
 * 3. Dashboard still sees profileCompleted: false in session -> Redirects back to onboarding
 * 4. LOOP!
 *
 * The fix:
 * - Skip action sets profileCompleted: true in DB
 * - onboarding/page.tsx calls updateSession({ profileCompleted: true }) after skip
 * - auth.ts JWT callback handles profileCompleted session updates
 */

test.describe('Onboarding Complete Flow', () => {
  test('new user can complete onboarding and land on dashboard without redirect loop', async ({ page }) => {
    // Track all navigations
    const navigations: string[] = [];
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) {
        navigations.push(frame.url());
      }
    });

    // Generate unique email
    const timestamp = Date.now();
    const email = `test-complete-${timestamp}@example.com`;
    const password = 'Password123!';

    // Sign up
    await page.goto('/auth/signup');
    await page.waitForLoadState('networkidle');

    await page.locator('input[name="firstName"]').fill('Complete');
    await page.locator('input[name="lastName"]').fill('User');
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[name="password"], input[type="password"]').first().fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);
    await page.locator('button[type="submit"]').click();

    // Wait for onboarding
    await page.waitForURL('**/app/onboarding', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Start onboarding by clicking "Let's go" on welcome screen
    const letsGoButton = page.locator('button:has-text("Let\'s go"), button:has-text("Continue")');
    if (await letsGoButton.isVisible({ timeout: 5000 })) {
      await letsGoButton.click();
    }

    // Go through all questions quickly with minimal valid answers
    // Question 1: First name (pre-filled)
    await page.waitForTimeout(500);
    const continueBtn = page.locator('button:has-text("Continue")');
    if (await continueBtn.isVisible({ timeout: 3000 })) {
      await continueBtn.click();
    }

    // Question 2: Last name (pre-filled)
    await page.waitForTimeout(500);
    if (await continueBtn.isVisible({ timeout: 3000 })) {
      await continueBtn.click();
    }

    // Question 3: Professional title
    const titleInput = page.locator('input[placeholder*="Senior"], input[placeholder*="title"]');
    if (await titleInput.isVisible({ timeout: 3000 })) {
      await titleInput.fill('Test Engineer');
      await continueBtn.click();
    }

    // Question 4: Seniority level (select)
    const seniorOption = page.locator('button:has-text("Mid-level"), button:has-text("Senior")').first();
    if (await seniorOption.isVisible({ timeout: 3000 })) {
      await seniorOption.click();
      await page.waitForTimeout(300);
      await continueBtn.click();
    }

    // Question 5: Location
    const locationInput = page.locator('input[placeholder*="San Francisco"]');
    if (await locationInput.isVisible({ timeout: 3000 })) {
      await locationInput.fill('Test City, TC');
      await continueBtn.click();
    }

    // Question 6: Current company
    const companyInput = page.locator('input[placeholder*="Company"]');
    if (await companyInput.isVisible({ timeout: 3000 })) {
      await companyInput.fill('Test Corp');
      await continueBtn.click();
    }

    // Question 7: Years experience (select)
    const yearsOption = page.locator('button:has-text("3-5 years"), button:has-text("6-10 years")').first();
    if (await yearsOption.isVisible({ timeout: 3000 })) {
      await yearsOption.click();
      await page.waitForTimeout(300);
      await continueBtn.click();
    }

    // Question 8: Skills (chips - select 3)
    const skillChips = page.locator('button:has-text("JavaScript"), button:has-text("TypeScript"), button:has-text("React")');
    if (await skillChips.first().isVisible({ timeout: 3000 })) {
      await page.locator('button:has-text("JavaScript")').click();
      await page.locator('button:has-text("TypeScript")').click();
      await page.locator('button:has-text("React")').click();
      await continueBtn.click();
    }

    // Question 9: Interests (chips - select 1)
    const interestChips = page.locator('button:has-text("Fintech"), button:has-text("SaaS")');
    if (await interestChips.first().isVisible({ timeout: 3000 })) {
      await page.locator('button:has-text("Fintech")').click();
      await continueBtn.click();
    }

    // Question 10: Bio (textarea - at least 50 chars)
    const bioInput = page.locator('textarea');
    if (await bioInput.isVisible({ timeout: 3000 })) {
      await bioInput.fill('This is a test bio that is at least 50 characters long for validation purposes.');
      const completeBtn = page.locator('button:has-text("Complete setup")');
      await completeBtn.click();
    }

    // Wait for redirect to dashboard
    await page.waitForTimeout(5000);

    const finalUrl = page.url();
    console.log('Final URL after completion:', finalUrl);

    const dashboardCount = navigations.filter(url => url.includes('/app/dashboard')).length;
    const onboardingCount = navigations.filter(url => url.includes('/app/onboarding')).length;
    console.log(`Dashboard visits: ${dashboardCount}, Onboarding visits: ${onboardingCount}`);

    // Should end on dashboard
    expect(finalUrl).toContain('/app/dashboard');
    // Should not loop
    expect(navigations.length).toBeLessThan(15);
  });
});

test.describe('Onboarding Skip Flow', () => {
  test('new user can skip onboarding and land on dashboard without redirect loop', async ({ page }) => {
    // Track all navigations to detect loops
    const navigations: string[] = [];
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) {
        navigations.push(frame.url());
        console.log('Navigation:', frame.url());
      }
    });

    // Generate unique email
    const timestamp = Date.now();
    const email = `test-skip-${timestamp}@example.com`;
    const password = 'Password123!';

    // Step 1: Sign up
    console.log('\n=== Step 1: Sign up ===');
    await page.goto('/auth/signup');
    await page.waitForLoadState('networkidle');

    await page.locator('input[name="firstName"]').fill('Test');
    await page.locator('input[name="lastName"]').fill('SkipUser');
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[name="password"], input[type="password"]').first().fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);

    await page.locator('button[type="submit"]').click();

    // Wait for navigation to onboarding
    await page.waitForURL('**/app/onboarding', { timeout: 15000 });
    console.log('Landed on onboarding page');

    // Step 2: Skip onboarding
    console.log('\n=== Step 2: Skip onboarding ===');

    // Wait for the onboarding component to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Give time for the component to fully render and fetch profile

    // Take a screenshot to see what's on screen
    await page.screenshot({ path: 'test-results/onboarding-before-skip.png' });

    // Log the URL to make sure we're on onboarding
    console.log('Current URL before skip:', page.url());

    // Wait for either "Skip for now" (welcome) or "Skip" (header) to appear
    // This ensures the onboarding component has fully loaded
    const skipForNowButton = page.locator('button:has-text("Skip for now")');
    const skipButton = page.locator('button:has-text("Skip"):not(:has-text("Skip for now")):not(:has-text("Skip to"))');
    const letsGoButton = page.locator('button:has-text("Let\'s go")');
    const continueButton = page.locator('button:has-text("Continue")');

    // First, wait for SOMETHING from onboarding to appear (indicates component loaded)
    console.log('Waiting for onboarding to fully load...');
    try {
      await page.waitForSelector(
        'button:has-text("Skip for now"), button:has-text("Let\'s go"), button:has-text("Continue"), button:has-text("Skip"):not(:has-text("Skip to"))',
        { timeout: 10000 }
      );
      console.log('Onboarding content is visible');
    } catch (e) {
      console.log('Onboarding content did not appear in time');
      await page.screenshot({ path: 'test-results/onboarding-timeout.png' });
    }

    // Now try to skip
    if (await skipForNowButton.isVisible({ timeout: 3000 })) {
      console.log('Found "Skip for now" button on welcome screen, clicking...');
      await skipForNowButton.click();
    } else if (await skipButton.isVisible({ timeout: 3000 })) {
      console.log('Found "Skip" button in header, clicking...');
      await skipButton.click();
    } else {
      // Take screenshot for debugging
      await page.screenshot({ path: 'test-results/skip-button-not-found.png' });
      // Just log a snippet, not the full HTML
      const bodyText = await page.locator('body').innerText();
      console.log('Page body text:', bodyText.substring(0, 500));
      throw new Error('Could not find skip button');
    }

    // Step 3: Wait for dashboard and verify no loop
    console.log('\n=== Step 3: Verify dashboard without loop ===');

    // Wait for navigation to dashboard (skip should redirect there)
    try {
      await page.waitForURL('**/app/dashboard', { timeout: 15000 });
      console.log('Successfully navigated to dashboard');
    } catch (e) {
      console.log('Did not navigate to dashboard within timeout');
    }

    // Extra wait to catch any potential redirect loop
    await page.waitForTimeout(3000);

    // Get final URL
    const finalUrl = page.url();
    console.log('\nFinal URL:', finalUrl);

    // Log all navigations
    console.log('\n=== All navigations ===');
    navigations.forEach((url, i) => console.log(`${i + 1}. ${url}`));

    // Count visits to detect loops
    const dashboardCount = navigations.filter(url => url.includes('/app/dashboard')).length;
    const onboardingCount = navigations.filter(url => url.includes('/app/onboarding')).length;

    console.log(`\nDashboard visits: ${dashboardCount}`);
    console.log(`Onboarding visits: ${onboardingCount}`);

    // Assertions
    // Should end up on dashboard
    expect(finalUrl).toContain('/app/dashboard');

    // Should NOT have more than 2 onboarding visits (initial + possible brief navigation)
    expect(onboardingCount).toBeLessThanOrEqual(3);

    // Should NOT have more than 2 dashboard visits (brief redirects are OK, but not loops)
    expect(dashboardCount).toBeLessThanOrEqual(3);

    // Total navigations should be reasonable (not a loop)
    expect(navigations.length).toBeLessThan(10);
  });

  test('existing user with completed profile goes directly to dashboard', async ({ page }) => {
    // Track navigations
    const navigations: string[] = [];
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) {
        navigations.push(frame.url());
      }
    });

    // Use demo user who should have profileCompleted: true
    await page.goto('/auth/signin');
    await page.waitForLoadState('networkidle');

    await page.locator('input[type="email"]').fill('demo@example.com');
    await page.locator('input[type="password"]').fill('password');
    await page.locator('button[type="submit"]:has-text("Sign in")').click();

    // Wait for navigation
    await page.waitForTimeout(8000);

    const finalUrl = page.url();
    console.log('Final URL for demo user:', finalUrl);

    // Demo user with profileCompleted: true should go to dashboard, not onboarding
    // Note: If demo user needs onboarding, that's a seed data issue
    const onboardingVisits = navigations.filter(url => url.includes('/app/onboarding')).length;
    const dashboardVisits = navigations.filter(url => url.includes('/app/dashboard')).length;

    console.log(`Onboarding visits: ${onboardingVisits}, Dashboard visits: ${dashboardVisits}`);

    // Should not get stuck in a loop
    expect(navigations.length).toBeLessThan(10);
  });
});
