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

  const emailInput = page.getByLabel(/email/i);
  const passwordInput = page.getByLabel(/password/i);
  await emailInput.waitFor({ state: 'visible', timeout: 20000 });
  await passwordInput.waitFor({ state: 'visible', timeout: 20000 });
  await emailInput.fill(email);
  await passwordInput.fill(password);

  await page.getByRole('button', { name: /sign in/i }).click();

  // Race dashboard/onboarding redirects; tolerate immediate navigation.
  await Promise.race([
    ...destinations.map(path => page.waitForURL(`**/app/${path}`, { timeout: 30000 })),
    page.waitForSelector('main', { timeout: 30000 }).then(() => {})
  ]);
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

  const wizardHeader = page.getByRole('heading', { name: /welcome/i });

  await Promise.race([
    wizardHeader.waitFor({ state: 'visible', timeout: 8000 }).catch(() => null),
    page.waitForURL('**/app/dashboard', { timeout: 8000 }).catch(() => null)
  ]);

  if (page.url().includes('/app/dashboard')) {
    return 'dashboard';
  }

  if (await wizardHeader.isVisible().catch(() => false)) {
    return 'wizard';
  }

  return 'loading';
}
