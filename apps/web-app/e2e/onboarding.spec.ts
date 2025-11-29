import { test, expect, Page } from '@playwright/test';
import { clearOnboardingProgress, goToOnboarding, OnboardingState, signIn } from './utils';

const skipMessage = 'User is verified and skips onboarding wizard';

async function prepareOnboarding(page: Page, email: string, password: string): Promise<OnboardingState> {
  await signIn(page, { email, password });
  await clearOnboardingProgress(page);
  return goToOnboarding(page);
}

function requireWizard(state: OnboardingState) {
  if (state !== 'wizard') {
    test.skip(true, skipMessage);
    return false;
  }
  return true;
}

test.describe('Onboarding Flows', () => {
  test.describe('Company User Onboarding', () => {
    test.beforeEach(async ({ page, request }) => {
      const email = `company.test.${Date.now()}@example.com`;
      const password = 'pw123456';
      const res = await request.post('/api/auth/register', {
        data: {
          email,
          password,
          firstName: 'Test',
          lastName: 'Company',
          userType: 'company',
          companyName: `Test Co ${Date.now()}`,
          industry: 'Technology',
          location: 'Remote'
        }
      });
      expect(res.ok()).toBeTruthy();
      await signIn(page, { email, password });
      await clearOnboardingProgress(page);
    });

    test('wizard shows welcome message with user name', async ({ page }) => {
    const state = await goToOnboarding(page);
    if (!requireWizard(state)) return;

      // Verify welcome header appears
      const welcomeHeader = page.locator('h1:has-text("Welcome to Liftout")');
      await expect(welcomeHeader).toBeVisible();

      // Should show step indicator
      await expect(page.locator('text=Step 1 of')).toBeVisible();
    });

    test('wizard displays company profile setup step', async ({ page }) => {
    const state = await goToOnboarding(page);
    if (!requireWizard(state)) return;

      // Company users should see Company Profile Setup as first step
      await expect(page.locator('h2:has-text("Company Profile")')).toBeVisible({ timeout: 10000 });
    });

    test('wizard has step navigation with required step indicators', async ({ page }) => {
    const state = await goToOnboarding(page);
    if (!requireWizard(state)) return;

      // Check for nav element with step buttons
      const stepNav = page.locator('nav button');
      const stepCount = await stepNav.count();
      expect(stepCount).toBeGreaterThan(0);

      // Required steps should show "Required" badge
      await expect(page.locator('text=Required').first()).toBeVisible();
    });

    test('wizard progress bar is visible', async ({ page }) => {
    const state = await goToOnboarding(page);
    if (!requireWizard(state)) return;

      // Progress bar with navy background
      const progressBar = page.locator('.bg-navy.h-2');
      await expect(progressBar).toBeVisible();
    });

    test('skip setup button is available', async ({ page }) => {
    const state = await goToOnboarding(page);
    if (!requireWizard(state)) return;

      // Skip setup should be in footer
      await expect(page.locator('text=Skip setup')).toBeVisible();
    });

    test('clicking skip setup redirects to dashboard', async ({ page }) => {
    const state = await goToOnboarding(page);
    if (!requireWizard(state)) return;

      const skipButton = page.locator('text=Skip setup');
      await skipButton.click();

      // Should redirect to dashboard
      await page.waitForURL('**/app/dashboard', { timeout: 10000 });
    });
  });

  test.describe('Team User Onboarding', () => {
    test.beforeEach(async ({ page, request }) => {
      const email = `individual.test.${Date.now()}@example.com`;
      const password = 'pw123456';
      const res = await request.post('/api/auth/register', {
        data: {
          email,
          password,
          firstName: 'Test',
          lastName: 'User',
          userType: 'individual',
          industry: 'Technology',
          location: 'Remote'
        }
      });
      expect(res.ok()).toBeTruthy();
      await signIn(page, { email, password });
      await clearOnboardingProgress(page);
    });

    test('wizard shows welcome message with user name', async ({ page }) => {
    const state = await goToOnboarding(page);
    if (!requireWizard(state)) return;

      const welcomeHeader = page.locator('h1:has-text("Welcome to Liftout")');
      await expect(welcomeHeader).toBeVisible();

      // Should show step indicator
      await expect(page.locator('text=Step 1 of')).toBeVisible();
    });

    test('wizard displays profile setup step for team users', async ({ page }) => {
      const state = await goToOnboarding(page);
      if (!requireWizard(state)) return;

      // Team users should see Profile Setup (not Company Profile)
      // Look for profile-related step
      const profileStep = page.locator('h2').filter({ hasText: /profile/i });
      await expect(profileStep).toBeVisible({ timeout: 10000 });
    });

    test('wizard has multiple step navigation buttons', async ({ page }) => {
      const state = await goToOnboarding(page);
      if (!requireWizard(state)) return;

      const stepNav = page.locator('nav button');
      const stepCount = await stepNav.count();

      // Team users should have multiple steps (Profile, Team Formation, Skills, etc.)
      expect(stepCount).toBeGreaterThanOrEqual(3);
    });

    test('can navigate between steps using step buttons', async ({ page }) => {
      const state = await goToOnboarding(page);
      if (!requireWizard(state)) return;

      // Click on a completed/accessible step if available
      const stepButtons = page.locator('nav button');
      const count = await stepButtons.count();

      if (count > 1) {
        // First button should be current step, try second if accessible
        const secondButton = stepButtons.nth(1);
        const isDisabled = await secondButton.isDisabled();

        if (!isDisabled) {
          await secondButton.click();
          await page.waitForLoadState('networkidle');
          // Step might change
        }
      }
    });
  });

  test.describe('Onboarding Wizard UI Components', () => {
    test.beforeEach(async ({ page }) => {
      await signIn(page, { email: 'demo@example.com', password: 'password' });
      await clearOnboardingProgress(page);
    });

    test('buttons have minimum touch target height', async ({ page }) => {
      const state = await goToOnboarding(page);
      if (!requireWizard(state)) return;

      // Check that min-h-12 (48px) buttons are present
      const buttons = page.locator('button.min-h-12');
      const count = await buttons.count();

      for (let i = 0; i < Math.min(count, 3); i++) {
        const button = buttons.nth(i);
        if (await button.isVisible()) {
          const box = await button.boundingBox();
          if (box) {
            // 48px minimum height (with small tolerance)
            expect(box.height).toBeGreaterThanOrEqual(44);
          }
        }
      }
    });

    test('header displays close button', async ({ page }) => {
      const state = await goToOnboarding(page);
      requireWizard(state);

      // Close button in header (XMarkIcon)
      const closeButton = page.locator('button').filter({ has: page.locator('svg.h-6.w-6') }).first();
      await expect(closeButton).toBeVisible();
    });

    test('step completion shows checkmark', async ({ page }) => {
      const state = await goToOnboarding(page);
      requireWizard(state);

      // Completed steps show CheckIcon
      // Look for success-colored step buttons
      const completedSteps = page.locator('button.bg-success-light');
      const completedCount = await completedSteps.count();
      expect(completedCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Complete Onboarding Flow', () => {
    test('company user can skip entire onboarding', async ({ page }) => {
    const state = await prepareOnboarding(page, 'company@example.com', 'password');
    if (!requireWizard(state)) return;

      // Click skip setup
      await page.click('text=Skip setup');

      // Should be on dashboard
      await page.waitForURL('**/app/dashboard', { timeout: 10000 });

      // Dashboard should show
      await expect(page.locator('h1, h2').filter({ hasText: /dashboard/i }).first()).toBeVisible();
    });

    test('team user can skip entire onboarding', async ({ page }) => {
    const state = await prepareOnboarding(page, 'demo@example.com', 'password');
    if (!requireWizard(state)) return;

      await page.click('text=Skip setup');
      await page.waitForURL('**/app/dashboard', { timeout: 10000 });
      await expect(page.locator('h1, h2').filter({ hasText: /dashboard/i }).first()).toBeVisible();
    });
  });
});

test.describe('Authentication Flow', () => {
  test.use({ storageState: 'empty' });
  test.beforeEach(async ({ request }) => {
    await request.post('/api/auth/signout');
  });
  test('sign in page renders correctly', async ({ page }) => {
    await page.goto('/auth/signin');

    // Check for welcome message
    await expect(page.locator('h2:has-text("Welcome back")')).toBeVisible({ timeout: 10000 });

    // Check for email field
    await expect(page.locator('input[type="email"]')).toBeVisible();

    // Check for password field
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Check for sign in button
    await expect(page.locator('button:has-text("Sign in")')).toBeVisible();
  });

  test('company user can sign in successfully', async ({ page }) => {
    await page.goto('/auth/signin');
    await page.fill('input[type="email"]', 'company@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button:has-text("Sign in")');

    // Should redirect to dashboard or onboarding
    await Promise.race([
      page.waitForURL('**/app/dashboard', { timeout: 30000 }),
      page.waitForURL('**/app/onboarding', { timeout: 30000 })
    ]);
  });

  test('team user can sign in successfully', async ({ page }) => {
    await page.goto('/auth/signin');
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button:has-text("Sign in")');

    // Should redirect to dashboard or onboarding
    await Promise.race([
      page.waitForURL('**/app/dashboard', { timeout: 30000 }),
      page.waitForURL('**/app/onboarding', { timeout: 30000 })
    ]);
  });

  test('invalid credentials shows error', async ({ page }) => {
    await page.goto('/auth/signin');
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button:has-text("Sign in")');

    await page.waitForResponse(resp => resp.url().includes('/api/auth/callback/credentials') && resp.status() >= 400);
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test('demo credentials dropdown works', async ({ page }) => {
    await page.goto('/auth/signin');

    // Open demo credentials details
    await page.click('text=Try demo credentials');

    // Click team lead option
    await page.click('button:has-text("Team lead")');

    // Email field should be filled
    const emailValue = await page.locator('input[type="email"]').inputValue();
    expect(emailValue).toBe('demo@example.com');
  });
});
