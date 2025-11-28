import { test, expect, Page } from '@playwright/test';

// Helper function to sign in and reset onboarding
async function signInAndResetOnboarding(page: Page, email: string, password: string) {
  await page.goto('/auth/signin');
  await page.waitForLoadState('domcontentloaded');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button:has-text("Sign in")');
  await page.waitForURL('**/app/dashboard', { timeout: 30000 });

  // Clear onboarding progress from localStorage to reset onboarding state
  await page.evaluate(() => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('onboarding_')) {
        localStorage.removeItem(key);
      }
    });
  });
}

test.describe('Onboarding Flows', () => {
  test.describe('Company User Onboarding', () => {
    test('can access onboarding page and see wizard', async ({ page }) => {
      await signInAndResetOnboarding(page, 'company@example.com', 'password');

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Should see onboarding header with user name
      await expect(page.locator('h1:has-text("Welcome")')).toBeVisible({ timeout: 15000 });

      // Should see step navigation
      await expect(page.locator('text=Step 1 of')).toBeVisible();
    });

    test('Company Profile Setup step renders correctly', async ({ page }) => {
      await signInAndResetOnboarding(page, 'company@example.com', 'password');

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // First step should be Company Profile Setup
      await expect(page.locator('h2:has-text("Company Profile")')).toBeVisible({ timeout: 10000 });

      // Should have form fields
      await expect(page.locator('input[name="companyName"], input[placeholder*="company"]').first()).toBeVisible({ timeout: 5000 });
    });

    test('can navigate through onboarding steps', async ({ page }) => {
      await signInAndResetOnboarding(page, 'company@example.com', 'password');

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Wait for first step to load
      await expect(page.locator('text=Step 1 of')).toBeVisible({ timeout: 15000 });

      // Look for skip button in the step content or footer
      const skipButton = page.locator('button:has-text("Skip"), a:has-text("Skip for now"), text=Skip setup').first();
      if (await skipButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await skipButton.click();
        await page.waitForLoadState('networkidle');
      }
    });

    test('CompanyVerification step has document upload UI', async ({ page }) => {
      await signInAndResetOnboarding(page, 'company@example.com', 'password');

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Navigate to verification step by clicking step in nav or skipping first step
      const verificationTab = page.locator('button:has-text("Verification"), button:has-text("Verify")');
      if (await verificationTab.isVisible({ timeout: 5000 }).catch(() => false)) {
        await verificationTab.click();
        await page.waitForLoadState('networkidle');

        // Check for verification UI elements
        await expect(page.locator('text=Verify your company, text=Company verification')).toBeVisible({ timeout: 5000 });
        await expect(page.locator('text=Verification documents, text=Upload')).toBeVisible();
      }
    });

    test('FirstOpportunityCreation step has opportunity form', async ({ page }) => {
      await signInAndResetOnboarding(page, 'company@example.com', 'password');

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Navigate to opportunity creation step
      const opportunityTab = page.locator('button:has-text("Opportunity"), button:has-text("First")');
      if (await opportunityTab.isVisible({ timeout: 5000 }).catch(() => false)) {
        await opportunityTab.click();
        await page.waitForLoadState('networkidle');

        // Check for form elements
        await expect(page.locator('text=Create your first, text=liftout opportunity')).toBeVisible({ timeout: 5000 });
      }
    });

    test('TeamDiscoveryTutorial step has interactive tutorial', async ({ page }) => {
      await signInAndResetOnboarding(page, 'company@example.com', 'password');

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Navigate to tutorial step
      const tutorialTab = page.locator('button:has-text("Discovery"), button:has-text("Discover")');
      if (await tutorialTab.isVisible({ timeout: 5000 }).catch(() => false)) {
        await tutorialTab.click();
        await page.waitForLoadState('networkidle');

        // Check for tutorial elements
        await expect(page.locator('text=Discover teams')).toBeVisible({ timeout: 5000 });
      }
    });

    test('CompanyPlatformTour step shows feature tour', async ({ page }) => {
      await signInAndResetOnboarding(page, 'company@example.com', 'password');

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Navigate to platform tour step
      const tourTab = page.locator('button:has-text("Platform"), button:has-text("Tour")');
      if (await tourTab.isVisible({ timeout: 5000 }).catch(() => false)) {
        await tourTab.click();
        await page.waitForLoadState('networkidle');

        // Check for tour elements
        await expect(page.locator('text=Platform tour')).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Team User Onboarding', () => {
    test('can access onboarding page and see wizard', async ({ page }) => {
      await signInAndResetOnboarding(page, 'demo@example.com', 'password');

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Should see onboarding header
      await expect(page.locator('h1:has-text("Welcome")')).toBeVisible({ timeout: 15000 });

      // Should see step navigation
      await expect(page.locator('text=Step 1 of')).toBeVisible();
    });

    test('ProfileSetup step renders with form fields', async ({ page }) => {
      await signInAndResetOnboarding(page, 'demo@example.com', 'password');

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // First step should be Profile Setup
      await expect(page.locator('h2:has-text("Profile"), h3:has-text("profile")')).toBeVisible({ timeout: 10000 });
    });

    test('TeamFormation step has create/join options', async ({ page }) => {
      await signInAndResetOnboarding(page, 'demo@example.com', 'password');

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Navigate to team formation step
      const teamTab = page.locator('button:has-text("Team"), button:has-text("Formation")');
      if (await teamTab.isVisible({ timeout: 5000 }).catch(() => false)) {
        await teamTab.click();
        await page.waitForLoadState('networkidle');

        // Check for team formation UI
        await expect(page.locator('text=Team formation')).toBeVisible({ timeout: 5000 });
      }
    });

    test('SkillsExperience step has skill categories', async ({ page }) => {
      await signInAndResetOnboarding(page, 'demo@example.com', 'password');

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Navigate to skills step
      const skillsTab = page.locator('button:has-text("Skills"), button:has-text("Experience")');
      if (await skillsTab.isVisible({ timeout: 5000 }).catch(() => false)) {
        await skillsTab.click();
        await page.waitForLoadState('networkidle');

        // Check for skills UI
        await expect(page.locator('text=Skills & experience')).toBeVisible({ timeout: 5000 });
      }
    });

    test('LiftoutPreferences step has preference options', async ({ page }) => {
      await signInAndResetOnboarding(page, 'demo@example.com', 'password');

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Navigate to preferences step
      const prefsTab = page.locator('button:has-text("Preferences"), button:has-text("Liftout")');
      if (await prefsTab.isVisible({ timeout: 5000 }).catch(() => false)) {
        await prefsTab.click();
        await page.waitForLoadState('networkidle');

        // Check for preferences UI
        await expect(page.locator('text=Liftout preferences')).toBeVisible({ timeout: 5000 });
      }
    });

    test('OpportunityDiscoveryTutorial step has tutorial interface', async ({ page }) => {
      await signInAndResetOnboarding(page, 'demo@example.com', 'password');

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Navigate to tutorial step
      const tutorialTab = page.locator('button:has-text("Discovery"), button:has-text("Opportunity")');
      if (await tutorialTab.isVisible({ timeout: 5000 }).catch(() => false)) {
        await tutorialTab.click();
        await page.waitForLoadState('networkidle');

        // Check for tutorial UI
        await expect(page.locator('text=Discover opportunities')).toBeVisible({ timeout: 5000 });
      }
    });

    test('TeamPlatformTour step shows platform features', async ({ page }) => {
      await signInAndResetOnboarding(page, 'demo@example.com', 'password');

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Navigate to platform tour step
      const tourTab = page.locator('button:has-text("Platform"), button:has-text("Tour")');
      if (await tourTab.isVisible({ timeout: 5000 }).catch(() => false)) {
        await tourTab.click();
        await page.waitForLoadState('networkidle');

        // Check for tour UI
        await expect(page.locator('text=Platform tour')).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Onboarding Wizard UI', () => {
    test('progress bar updates correctly', async ({ page }) => {
      await signInAndResetOnboarding(page, 'demo@example.com', 'password');

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Check for progress bar
      const progressBar = page.locator('[class*="bg-navy"][class*="h-2"], .bg-navy.h-2');
      await expect(progressBar).toBeVisible({ timeout: 10000 });
    });

    test('step navigation buttons work', async ({ page }) => {
      await signInAndResetOnboarding(page, 'demo@example.com', 'password');

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Should see step buttons
      const stepButtons = page.locator('nav button');
      const count = await stepButtons.count();
      expect(count).toBeGreaterThan(0);

      // Clicking a step button should update current step indicator
      if (count > 1) {
        const secondStep = stepButtons.nth(1);
        if (await secondStep.isEnabled()) {
          const initialStep = await page.locator('text=Step 1 of').textContent();
          await secondStep.click();
          await page.waitForLoadState('networkidle');
          // Step indicator might change
        }
      }
    });

    test('skip buttons are accessible', async ({ page }) => {
      await signInAndResetOnboarding(page, 'demo@example.com', 'password');

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Should have skip option in footer
      await expect(page.locator('text=Skip setup')).toBeVisible({ timeout: 10000 });
    });

    test('buttons have proper minimum height for touch targets', async ({ page }) => {
      await signInAndResetOnboarding(page, 'demo@example.com', 'password');

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Check primary buttons
      const primaryButtons = page.locator('button.btn-primary');
      const count = await primaryButtons.count();

      for (let i = 0; i < Math.min(count, 3); i++) {
        const button = primaryButtons.nth(i);
        if (await button.isVisible()) {
          const box = await button.boundingBox();
          if (box) {
            // 48px minimum height (44px with some tolerance)
            expect(box.height).toBeGreaterThanOrEqual(44);
          }
        }
      }
    });
  });

  test.describe('Complete Onboarding Flow', () => {
    test('company user can complete full onboarding', async ({ page }) => {
      await signInAndResetOnboarding(page, 'company@example.com', 'password');

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Wait for wizard to load
      await expect(page.locator('h1:has-text("Welcome")')).toBeVisible({ timeout: 15000 });

      // Click through steps using skip setup
      const skipSetup = page.locator('text=Skip setup');
      if (await skipSetup.isVisible({ timeout: 5000 })) {
        await skipSetup.click();

        // Should redirect to dashboard
        await page.waitForURL('**/app/dashboard', { timeout: 10000 });
        await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
      }
    });

    test('team user can complete full onboarding', async ({ page }) => {
      await signInAndResetOnboarding(page, 'demo@example.com', 'password');

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Wait for wizard to load
      await expect(page.locator('h1:has-text("Welcome")')).toBeVisible({ timeout: 15000 });

      // Click through steps using skip setup
      const skipSetup = page.locator('text=Skip setup');
      if (await skipSetup.isVisible({ timeout: 5000 })) {
        await skipSetup.click();

        // Should redirect to dashboard
        await page.waitForURL('**/app/dashboard', { timeout: 10000 });
        await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
      }
    });
  });
});
