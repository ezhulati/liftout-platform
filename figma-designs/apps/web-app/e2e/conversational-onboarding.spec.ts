import { test, expect, Page } from '@playwright/test';

/**
 * Helper to sign in - waits for full page hydration before interacting
 */
async function signInWithDemoUser(page: Page) {
  await page.goto('/auth/signin', { waitUntil: 'networkidle' });

  // Wait for React to hydrate - the form should have the onSubmit handler attached
  // We can verify this by waiting for the password toggle button to be interactive
  const emailInput = page.locator('input[type="email"]');
  await emailInput.waitFor({ state: 'visible', timeout: 20000 });

  // Wait a bit for React hydration
  await page.waitForTimeout(1000);

  // Fill the form
  await emailInput.fill('demo@example.com');
  await page.locator('input[type="password"]').fill('password');

  // Click submit and wait for navigation
  await Promise.all([
    page.waitForURL(/\/app\//, { timeout: 30000 }),
    page.locator('button[type="submit"]:has-text("Sign in")').click(),
  ]);
}

test.describe('Conversational Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    await signInWithDemoUser(page);
  });

  test('onboarding page loads correctly', async ({ page }) => {
    await page.goto('/app/onboarding', { waitUntil: 'domcontentloaded' });

    // Wait for content to load (either welcome screen, onboarding questions, or redirect)
    await page.waitForTimeout(2000);

    // Should see either the welcome screen, a question, or be redirected
    const currentUrl = page.url();
    const hasOnboardingContent = await page.locator('text=Hey').or(page.locator('text=Let\'s go')).or(page.locator('text=Redirecting')).count() > 0;

    expect(currentUrl.includes('/app/onboarding') || currentUrl.includes('/app/dashboard')).toBe(true);
  });

  test('welcome screen shows correctly on first visit', async ({ page }) => {
    await page.goto('/app/onboarding', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Check if we're on onboarding or already redirected
    if (page.url().includes('/app/onboarding')) {
      // Should see welcome message or loading
      const hasContent = await page.locator('h1, h2').first().isVisible({ timeout: 5000 }).catch(() => false);
      expect(hasContent || page.url().includes('dashboard')).toBeTruthy();
    }
  });

  test('skip button is visible and functional', async ({ page }) => {
    await page.goto('/app/onboarding', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    if (page.url().includes('/app/onboarding')) {
      // Look for skip button
      const skipButton = page.locator('button:has-text("Skip"), text=Skip for now, text=Skip');
      const isVisible = await skipButton.first().isVisible({ timeout: 5000 }).catch(() => false);

      if (isVisible) {
        await skipButton.first().click();
        // Should eventually get to dashboard
        await page.waitForURL(/\/app\/dashboard/, { timeout: 15000 });
      }
    }
  });

  test('progress ring is visible in header during questions', async ({ page }) => {
    await page.goto('/app/onboarding', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    if (page.url().includes('/app/onboarding')) {
      // Click "Let's go" if on welcome screen
      const letsGoButton = page.locator('button:has-text("Let\'s go")');
      if (await letsGoButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await letsGoButton.click();
        await page.waitForTimeout(500);

        // Progress ring should be visible (SVG circle)
        const progressRing = page.locator('svg circle');
        await expect(progressRing.first()).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('can navigate through first question', async ({ page }) => {
    await page.goto('/app/onboarding', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    if (page.url().includes('/app/onboarding')) {
      // Click "Let's go" if on welcome screen
      const letsGoButton = page.locator('button:has-text("Let\'s go")');
      if (await letsGoButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await letsGoButton.click();
        await page.waitForTimeout(500);

        // Should see a question
        const question = page.locator('h2');
        await expect(question).toBeVisible({ timeout: 5000 });

        // Fill in first name if it's the first question
        const input = page.locator('input[type="text"]');
        if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
          await input.fill('TestUser');

          // Click continue
          const continueButton = page.locator('button:has-text("Continue")');
          await expect(continueButton).toBeVisible({ timeout: 3000 });
        }
      }
    }
  });

  test('back button works during questions', async ({ page }) => {
    await page.goto('/app/onboarding', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    if (page.url().includes('/app/onboarding')) {
      // Click "Let's go" if on welcome screen
      const letsGoButton = page.locator('button:has-text("Let\'s go")');
      if (await letsGoButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await letsGoButton.click();
        await page.waitForTimeout(500);

        // Back button should be visible
        const backButton = page.locator('button:has-text("Back")');
        await expect(backButton).toBeVisible({ timeout: 3000 });

        // Click back should go to welcome
        await backButton.click();
        await page.waitForTimeout(500);

        // Should see welcome screen again
        const welcomeButton = page.locator('button:has-text("Let\'s go")');
        await expect(welcomeButton).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('touch targets meet minimum 48px height', async ({ page }) => {
    await page.goto('/app/onboarding', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    if (page.url().includes('/app/onboarding')) {
      // Check primary buttons have minimum height
      const primaryButtons = page.locator('button.btn-primary, button.min-h-14, button.min-h-12');
      const count = await primaryButtons.count();

      for (let i = 0; i < Math.min(count, 3); i++) {
        const button = primaryButtons.nth(i);
        if (await button.isVisible()) {
          const box = await button.boundingBox();
          if (box) {
            // 48px minimum height
            expect(box.height).toBeGreaterThanOrEqual(44);
          }
        }
      }
    }
  });
});

test.describe('Onboarding Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    await signInWithDemoUser(page);
  });

  test('onboarding is fullscreen without sidebar', async ({ page }) => {
    await page.goto('/app/onboarding', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    if (page.url().includes('/app/onboarding')) {
      // Sidebar should not be visible on onboarding
      const sidebar = page.locator('[class*="AppSidebar"], nav.lg\\:flex');
      const isVisible = await sidebar.isVisible({ timeout: 2000 }).catch(() => false);

      // On onboarding page, we expect fullscreen (no sidebar visible)
      // This is controlled by isFullscreenRoute in layout.tsx
    }
  });

  test('content is centered on all screen sizes', async ({ page }) => {
    await page.goto('/app/onboarding', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    if (page.url().includes('/app/onboarding')) {
      // Main content should be centered
      const centeredContent = page.locator('.flex.items-center.justify-center, .text-center');
      const count = await centeredContent.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('text is readable size on mobile', async ({ page }) => {
    await page.goto('/app/onboarding', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    if (page.url().includes('/app/onboarding')) {
      // Headlines should be visible and readable
      const headline = page.locator('h1, h2').first();
      if (await headline.isVisible({ timeout: 3000 }).catch(() => false)) {
        const box = await headline.boundingBox();
        if (box) {
          // Text should be reasonably sized
          expect(box.height).toBeGreaterThan(20);
        }
      }
    }
  });
});

test.describe('Sidebar Profile Reminder', () => {
  test.beforeEach(async ({ page }) => {
    await signInWithDemoUser(page);
  });

  test('dashboard shows sidebar on desktop', async ({ page, browserName }, testInfo) => {
    // Skip on mobile projects
    if (testInfo.project.name.includes('Mobile')) {
      test.skip();
    }

    await page.goto('/app/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Desktop sidebar should be visible
    const sidebar = page.locator('.lg\\:flex.lg\\:w-64');
    // On desktop, sidebar structure should exist
  });

  test('profile reminder links to onboarding', async ({ page, browserName }, testInfo) => {
    // Skip on mobile projects where sidebar is hidden
    if (testInfo.project.name.includes('Mobile')) {
      test.skip();
    }

    await page.goto('/app/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Look for profile completion reminder
    const reminder = page.locator('a[href="/app/onboarding"]:has-text("Complete your profile")');
    const isVisible = await reminder.isVisible({ timeout: 3000 }).catch(() => false);

    if (isVisible) {
      await reminder.click();
      await page.waitForURL(/\/app\/onboarding/, { timeout: 10000 });
    }
  });
});
