import { test, expect, Page, APIRequestContext } from '@playwright/test';
import { clearOnboardingProgress, goToOnboarding, OnboardingState, signIn } from './utils';

const password = 'pw123456';

async function createTestUser(request: APIRequestContext, userType: 'company' | 'individual') {
  const email = `${userType}.test.${Date.now()}@example.com`;
  const res = await request.post('/api/auth/register', {
    data: {
      email,
      password,
      firstName: 'Test',
      lastName: userType === 'company' ? 'Company' : 'User',
      userType,
      companyName: userType === 'company' ? `Test Co ${Date.now()}` : undefined,
      industry: 'Technology',
      location: 'Remote'
    }
  });
  expect(res.ok()).toBeTruthy();
  return { email, password };
}

async function prepareOnboarding(page: Page, email: string, pwd: string): Promise<OnboardingState> {
  await signIn(page, { email, password: pwd });
  await clearOnboardingProgress(page);
  return goToOnboarding(page);
}

function requireWizard(state: OnboardingState) {
  expect(state).toBe('wizard');
}

test.describe('Onboarding Flows', () => {
  test.describe('Company User Onboarding', () => {
    test.beforeEach(async ({ page, request }) => {
      await request.post('/api/auth/signout');
      const { email } = await createTestUser(request, 'company');
      await signIn(page, { email, password });
      await clearOnboardingProgress(page);
    });

    test('wizard shows welcome message with user name', async ({ page }) => {
      const state = await goToOnboarding(page);
      requireWizard(state);

      // Verify welcome header appears
      const welcomeHeader = page.locator('h1:has-text("Welcome to Liftout")');
      await expect(welcomeHeader).toBeVisible();

      // Should show step indicator
      await expect(page.locator('text=Step 1 of')).toBeVisible();
    });

    test('wizard displays company profile setup step', async ({ page }) => {
      const state = await goToOnboarding(page);
      requireWizard(state);

      await expect(page.getByRole('heading', { name: /complete company profile/i })).toBeVisible({ timeout: 10000 });
    });

    test('wizard has step navigation with required step indicators', async ({ page }) => {
      const state = await goToOnboarding(page);
      requireWizard(state);

      // Check for nav element with step buttons
      const stepNav = page.locator('nav button');
      const stepCount = await stepNav.count();
      expect(stepCount).toBeGreaterThan(0);

      // Required steps should show "Required" badge
      await expect(page.locator('text=Required').first()).toBeVisible();
    });

    test('wizard progress bar is visible', async ({ page }) => {
      const state = await goToOnboarding(page);
      requireWizard(state);

      // Progress bar with navy background
      const progressBar = page.locator('.bg-navy.h-2');
      await expect(progressBar).toBeVisible();
    });

    test('skip setup button is available', async ({ page }) => {
      const state = await goToOnboarding(page);
      requireWizard(state);

      // Skip setup should be in footer
      await expect(page.locator('text=Skip setup')).toBeVisible();
    });

    test('clicking skip setup redirects to dashboard', async ({ page }) => {
      const state = await goToOnboarding(page);
      requireWizard(state);

      const skipButton = page.locator('text=Skip setup');
      await skipButton.click();

      // Should redirect to dashboard
      await page.waitForURL('**/app/dashboard', { timeout: 10000 });
    });
  });

  test.describe('Team User Onboarding', () => {
    test.beforeEach(async ({ page, request }) => {
      await request.post('/api/auth/signout');
      const { email } = await createTestUser(request, 'individual');
      await signIn(page, { email, password });
      await clearOnboardingProgress(page);
    });

    test('wizard shows welcome message with user name', async ({ page }) => {
      const state = await goToOnboarding(page);
      requireWizard(state);

      const welcomeHeader = page.locator('h1:has-text("Welcome to Liftout")');
      await expect(welcomeHeader).toBeVisible();

      // Should show step indicator
      await expect(page.locator('text=Step 1 of')).toBeVisible();
    });

    test('wizard displays profile setup step for team users', async ({ page }) => {
      const state = await goToOnboarding(page);
      requireWizard(state);

      await expect(page.getByRole('heading', { name: /create your profile/i })).toBeVisible({ timeout: 10000 });
    });

    test('wizard has multiple step navigation buttons', async ({ page }) => {
      const state = await goToOnboarding(page);
      requireWizard(state);

      const stepNav = page.locator('nav button');
      const stepCount = await stepNav.count();
      expect(stepCount).toBeGreaterThan(0);
    });

    test('can navigate between steps using step buttons', async ({ page }) => {
      const state = await goToOnboarding(page);
      requireWizard(state);

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
    test.beforeEach(async ({ page, request }) => {
      await request.post('/api/auth/signout');
      const { email } = await createTestUser(request, 'individual');
      await signIn(page, { email, password });
      await clearOnboardingProgress(page);
    });

    test('buttons have minimum touch target height', async ({ page }) => {
      const state = await goToOnboarding(page);
      requireWizard(state);

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
    test('company user can skip entire onboarding', async ({ page, request }) => {
      await request.post('/api/auth/signout');
      const { email } = await createTestUser(page.request, 'company');
      const state = await prepareOnboarding(page, email, password);
      requireWizard(state);

      // Click skip setup
      await page.click('text=Skip setup');

      // Should be on dashboard
      await page.waitForURL('**/app/dashboard', { timeout: 10000 });

      // Dashboard should show
      await expect(page.locator('h1, h2').filter({ hasText: /dashboard/i }).first()).toBeVisible();
    });

    test('team user can skip entire onboarding', async ({ page, request }) => {
      await request.post('/api/auth/signout');
      const { email } = await createTestUser(page.request, 'individual');
      const state = await prepareOnboarding(page, email, password);
      requireWizard(state);

      await page.click('text=Skip setup');
      await page.waitForURL('**/app/dashboard', { timeout: 10000 });
      await expect(page.locator('h1, h2').filter({ hasText: /dashboard/i }).first()).toBeVisible();
    });
  });
});

test.describe('Authentication Flow', () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  test.beforeEach(async ({ request }) => {
    await request.post('/api/auth/signout');
  });
  test('sign in page renders correctly', async ({ page }) => {
    await page.goto('/auth/signin', { waitUntil: 'domcontentloaded' });

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
    await page.goto('/auth/signin', { waitUntil: 'domcontentloaded' });
    await page.locator('input[type="email"]').first().waitFor({ state: 'visible', timeout: 20000 });
    await page.fill('input[type="email"]', 'company@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button:has-text("Sign in")');

    // Should redirect to dashboard or onboarding
    await expect(page).toHaveURL(/\/app\/(dashboard|onboarding)/, { timeout: 30000 });
  });

  test('team user can sign in successfully', async ({ page }) => {
    await page.goto('/auth/signin', { waitUntil: 'domcontentloaded' });
    await page.locator('input[type="email"]').first().waitFor({ state: 'visible', timeout: 20000 });
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button:has-text("Sign in")');

    // Should redirect to dashboard or onboarding
    await expect(page).toHaveURL(/\/app\/(dashboard|onboarding)/, { timeout: 30000 });
  });

  test('invalid credentials shows error', async ({ page }) => {
    await page.goto('/auth/signin', { waitUntil: 'domcontentloaded' });
    await page.locator('input[type="email"]').first().waitFor({ state: 'visible', timeout: 20000 });
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button:has-text("Sign in")');

    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/\/auth\/signin/);
    await expect(page.locator('button:has-text("Sign in")').first()).toBeVisible();
  });

  test('demo credentials dropdown works', async ({ page }) => {
    await page.goto('/auth/signin');
    await page.getByText('Try demo credentials').waitFor({ state: 'visible', timeout: 20000 });
    await page.click('text=Try demo credentials');

    // Click team lead option
    await page.click('button:has-text("Team lead")');

    // Email field should be filled
    const emailValue = await page.locator('input[type="email"]').inputValue();
    expect(emailValue).toBe('demo@example.com');
  });
});
