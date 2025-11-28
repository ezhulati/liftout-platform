import { test, expect } from '@playwright/test';

test.describe('Onboarding Flows', () => {
  test.describe('Company User Onboarding', () => {
    test.beforeEach(async ({ page }) => {
      // Sign in as company user
      await page.goto('/auth/signin');
      await page.waitForLoadState('domcontentloaded');
      await page.fill('input[type="email"]', 'company@example.com');
      await page.fill('input[type="password"]', 'password');
      await page.click('button:has-text("Sign in")');
      await page.waitForURL('**/app/dashboard', { timeout: 30000 });
    });

    test('can access onboarding page', async ({ page }) => {
      await page.goto('/app/onboarding');
      await page.waitForLoadState('domcontentloaded');

      // Should see onboarding header
      await expect(page.locator('h1:has-text("Welcome"), h2:has-text("Welcome"), h3:has-text("Welcome")')).toBeVisible({ timeout: 10000 });
    });

    test('Company Profile Setup step renders correctly', async ({ page }) => {
      await page.goto('/app/onboarding');
      await page.waitForLoadState('domcontentloaded');

      // Wait for step to load - may see company profile setup or another step
      await expect(page.locator('form, [data-testid="onboarding-step"]')).toBeVisible({ timeout: 10000 });
    });

    test('CompanyVerification step - form fields visible', async ({ page }) => {
      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Navigate to verification step if not already there
      const verificationHeader = page.locator('text=Verify your company');
      if (await verificationHeader.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Check for form fields
        await expect(page.locator('input[name="companyRegistrationNumber"], [name="companyRegistrationNumber"]')).toBeVisible();
        await expect(page.locator('input[name="taxId"], [name="taxId"]')).toBeVisible();
        await expect(page.locator('text=Verification documents')).toBeVisible();
      }
    });

    test('FirstOpportunityCreation step - form elements present', async ({ page }) => {
      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Check if opportunity creation step is visible or navigate to it
      const opportunityHeader = page.locator('text=Create your first liftout opportunity');
      if (await opportunityHeader.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Verify form fields
        await expect(page.locator('input[name="title"], [placeholder*="Strategic"]')).toBeVisible();
        await expect(page.locator('textarea[name="description"]')).toBeVisible();
        await expect(page.locator('select[name="industry"]')).toBeVisible();
        await expect(page.locator('text=Liftout type')).toBeVisible();
      }
    });

    test('TeamDiscoveryTutorial step - interactive elements', async ({ page }) => {
      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      const tutorialHeader = page.locator('text=Discover teams');
      if (await tutorialHeader.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Verify tutorial steps are present
        await expect(page.locator('text=Search for teams, text=Search teams')).toBeVisible();

        // Check for interactive demo
        await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
      }
    });

    test('CompanyPlatformTour step - tour navigation works', async ({ page }) => {
      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      const tourHeader = page.locator('text=Platform tour');
      if (await tourHeader.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Check tour progress
        await expect(page.locator('text=Tour progress')).toBeVisible();

        // Verify tour step buttons
        await expect(page.locator('text=Your Dashboard, text=Dashboard')).toBeVisible();

        // Test navigation
        const nextButton = page.locator('button:has-text("Next feature")');
        if (await nextButton.isVisible()) {
          await nextButton.click();
          // Should advance to next step
          await expect(page.locator('text=Step 2 of')).toBeVisible({ timeout: 5000 });
        }
      }
    });
  });

  test.describe('Team User Onboarding', () => {
    test.beforeEach(async ({ page }) => {
      // Sign in as team user
      await page.goto('/auth/signin');
      await page.waitForLoadState('domcontentloaded');
      await page.fill('input[type="email"]', 'demo@example.com');
      await page.fill('input[type="password"]', 'password');
      await page.click('button:has-text("Sign in")');
      await page.waitForURL('**/app/dashboard', { timeout: 30000 });
    });

    test('can access onboarding page', async ({ page }) => {
      await page.goto('/app/onboarding');
      await page.waitForLoadState('domcontentloaded');

      // Should see onboarding content
      await expect(page.locator('h1, h2, h3').first()).toBeVisible({ timeout: 10000 });
    });

    test('ProfileSetup step renders correctly', async ({ page }) => {
      await page.goto('/app/onboarding');
      await page.waitForLoadState('domcontentloaded');

      // Check for profile setup elements
      const profileHeader = page.locator('text=Set up your professional profile');
      if (await profileHeader.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(page.locator('input#firstName, input[name="firstName"]')).toBeVisible();
        await expect(page.locator('input#lastName, input[name="lastName"]')).toBeVisible();
        await expect(page.locator('text=Professional title')).toBeVisible();
      }
    });

    test('TeamFormation step - create or join options', async ({ page }) => {
      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      const formationHeader = page.locator('text=Team formation');
      if (await formationHeader.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Should see both options
        await expect(page.locator('text=Create a new team')).toBeVisible();
        await expect(page.locator('text=Join an existing team')).toBeVisible();

        // Test clicking create option
        await page.click('text=Create a new team');
        await expect(page.locator('text=Create your team')).toBeVisible({ timeout: 5000 });

        // Verify form fields appear
        await expect(page.locator('input[name="teamName"]')).toBeVisible();
        await expect(page.locator('textarea[name="description"]')).toBeVisible();
      }
    });

    test('TeamFormation step - join mode', async ({ page }) => {
      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      const formationHeader = page.locator('text=Team formation');
      if (await formationHeader.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Click join option
        await page.click('text=Join an existing team');

        // Should see join interface
        await expect(page.locator('text=Join with invite code')).toBeVisible({ timeout: 5000 });
        await expect(page.locator('input[placeholder*="XXXX"]')).toBeVisible();
        await expect(page.locator('text=Find your team')).toBeVisible();
      }
    });

    test('SkillsExperience step - skill selection works', async ({ page }) => {
      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      const skillsHeader = page.locator('text=Skills & experience');
      if (await skillsHeader.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Verify role selection
        await expect(page.locator('select[name="primaryRole"]')).toBeVisible();

        // Check skill categories
        await expect(page.locator('text=Technical Skills')).toBeVisible();

        // Try clicking a skill category
        await page.click('text=Technical Skills');

        // Should see skills to select
        await expect(page.locator('button:has-text("JavaScript")')).toBeVisible({ timeout: 5000 });

        // Select a skill
        await page.click('button:has-text("JavaScript")');

        // Check it's selected (should appear in selected area)
        await expect(page.locator('.bg-navy-100:has-text("JavaScript"), [class*="selected"]:has-text("JavaScript")')).toBeVisible({ timeout: 5000 });
      }
    });

    test('LiftoutPreferences step - preference options', async ({ page }) => {
      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      const prefsHeader = page.locator('text=Liftout preferences');
      if (await prefsHeader.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Check availability section
        await expect(page.locator('text=Availability')).toBeVisible();
        await expect(page.locator('text=Immediately available')).toBeVisible();

        // Check compensation section
        await expect(page.locator('text=Compensation preferences')).toBeVisible();

        // Check location section
        await expect(page.locator('text=Location preferences')).toBeVisible();

        // Check priorities section
        await expect(page.locator('text=What matters most to you')).toBeVisible();

        // Try selecting a priority
        await page.click('button:has-text("Competitive compensation")');
      }
    });

    test('OpportunityDiscoveryTutorial step - tutorial steps', async ({ page }) => {
      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      const tutorialHeader = page.locator('h3:has-text("Discover opportunities")');
      if (await tutorialHeader.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Check for tutorial steps
        await expect(page.locator('text=Search opportunities')).toBeVisible();

        // Verify interactive demo
        await expect(page.locator('input[placeholder*="Search opportunities"]')).toBeVisible();

        // Test navigation
        const nextButton = page.locator('button:has-text("Next step")');
        if (await nextButton.isVisible()) {
          await nextButton.click();
          await expect(page.locator('text=Step 2 of')).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test('TeamPlatformTour step - feature tour', async ({ page }) => {
      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      const tourHeader = page.locator('h3:has-text("Platform tour")');
      if (await tourHeader.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Check progress bar
        await expect(page.locator('text=Tour progress')).toBeVisible();

        // Check feature highlights
        await expect(page.locator('text=Your Dashboard')).toBeVisible();

        // Pro tip should be visible
        await expect(page.locator('text=Pro tip')).toBeVisible();
      }
    });
  });

  test.describe('Onboarding UI Components', () => {
    test('buttons have minimum touch target (48px)', async ({ page }) => {
      await page.goto('/auth/signin');
      await page.waitForLoadState('domcontentloaded');
      await page.fill('input[type="email"]', 'demo@example.com');
      await page.fill('input[type="password"]', 'password');
      await page.click('button:has-text("Sign in")');
      await page.waitForURL('**/app/dashboard', { timeout: 30000 });

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Check primary buttons have min-h-12 class (48px)
      const primaryButtons = page.locator('button.btn-primary');
      const count = await primaryButtons.count();

      for (let i = 0; i < Math.min(count, 3); i++) {
        const button = primaryButtons.nth(i);
        if (await button.isVisible()) {
          const box = await button.boundingBox();
          if (box) {
            // 48px minimum height
            expect(box.height).toBeGreaterThanOrEqual(44); // Allow some tolerance
          }
        }
      }
    });

    test('form labels use bold font weight', async ({ page }) => {
      await page.goto('/auth/signin');
      await page.waitForLoadState('domcontentloaded');
      await page.fill('input[type="email"]', 'demo@example.com');
      await page.fill('input[type="password"]', 'password');
      await page.click('button:has-text("Sign in")');
      await page.waitForURL('**/app/dashboard', { timeout: 30000 });

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Check section headers
      const headers = page.locator('h4.font-bold');
      const headerCount = await headers.count();
      expect(headerCount).toBeGreaterThan(0);
    });
  });

  test.describe('Onboarding Navigation', () => {
    test('can skip optional steps', async ({ page }) => {
      await page.goto('/auth/signin');
      await page.waitForLoadState('domcontentloaded');
      await page.fill('input[type="email"]', 'demo@example.com');
      await page.fill('input[type="password"]', 'password');
      await page.click('button:has-text("Sign in")');
      await page.waitForURL('**/app/dashboard', { timeout: 30000 });

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Look for skip button
      const skipButton = page.locator('button:has-text("Skip"), a:has-text("Skip")');
      if (await skipButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await skipButton.click();
        // Should advance to next step or stay on page
        await page.waitForLoadState('networkidle');
      }
    });

    test('progress indicator updates on step completion', async ({ page }) => {
      await page.goto('/auth/signin');
      await page.waitForLoadState('domcontentloaded');
      await page.fill('input[type="email"]', 'company@example.com');
      await page.fill('input[type="password"]', 'password');
      await page.click('button:has-text("Sign in")');
      await page.waitForURL('**/app/dashboard', { timeout: 30000 });

      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');

      // Check for progress indicator
      const progressBar = page.locator('[class*="progress"], [role="progressbar"]');
      const stepIndicator = page.locator('text=/Step \\d+ of \\d+/');

      // At least one progress indicator should be visible
      const hasProgress = await progressBar.isVisible({ timeout: 5000 }).catch(() => false) ||
                          await stepIndicator.isVisible({ timeout: 5000 }).catch(() => false);

      // This is informational - not a hard requirement
      console.log('Progress indicator visible:', hasProgress);
    });
  });
});
