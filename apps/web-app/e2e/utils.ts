import { Page } from '@playwright/test';

type SignInOptions = {
  email: string;
  password: string;
  /**
   * Paths to treat as successful post-auth redirects.
   * Defaults to dashboard or onboarding.
   */
  destinations?: string[];
};

export type OnboardingState = 'wizard' | 'dashboard' | 'loading';

export async function signIn(page: Page, { email, password, destinations = ['dashboard', 'onboarding'] }: SignInOptions) {
  await page.goto('/auth/signin');
  await page.waitForLoadState('domcontentloaded');

  // If already signed in and redirected, bail early.
  if (destinations.some(path => page.url().includes(`/app/${path}`))) {
    return;
  }

  const emailInput = page.locator('input[type="email"]');
  const passwordInput = page.locator('input[type="password"]');
  await emailInput.waitFor({ state: 'visible', timeout: 20000 });
  await passwordInput.waitFor({ state: 'visible', timeout: 20000 });
  await emailInput.fill(email);
  await passwordInput.fill(password);

  // Click the submit button to properly submit the form (NextAuth handles CSRF tokens)
  const submitButton = page.locator('button[type="submit"]:has-text("Sign in")');
  await submitButton.click();

  // Wait for navigation to dashboard or onboarding
  try {
    await page.waitForURL(/\/app\/(dashboard|onboarding)/, { timeout: 30000 });
  } catch {
    // If redirect didn't happen, check if we're still on signin (auth failed)
    if (page.url().includes('/auth/signin')) {
      // Check for error message
      const errorVisible = await page.locator('text=Invalid credentials').isVisible().catch(() => false);
      if (errorVisible) {
        throw new Error('Sign in failed: Invalid credentials');
      }
    }
  }
}

export async function clearOnboardingProgress(page: Page) {
  await page.evaluate(() => {
    Object.keys(localStorage)
      .filter(key => key.startsWith('onboarding_'))
      .forEach(key => localStorage.removeItem(key));
  });
}

/**
 * Go to onboarding and return what the app did.
 */
export async function goToOnboarding(page: Page): Promise<OnboardingState> {
  await page.goto('/app/onboarding');
  await page.waitForLoadState('domcontentloaded');

  const wizardHeader = page.locator('h1:has-text("Welcome to Liftout")');

  const outcome = await Promise.race<OnboardingState | null>([
    page.waitForURL('**/app/dashboard', { timeout: 8000 }).then((): OnboardingState => 'dashboard').catch(() => null),
    wizardHeader.waitFor({ state: 'visible', timeout: 8000 }).then((): OnboardingState => 'wizard').catch(() => null),
    page.waitForTimeout(8000).then(() => null),
  ]);

  if (outcome === 'dashboard') return 'dashboard';
  if (outcome === 'wizard') return 'wizard';
  const visible = await wizardHeader.isVisible().catch(() => false);
  return visible ? 'wizard' : 'loading';
}
