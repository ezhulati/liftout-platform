import { test, expect } from '@playwright/test';

test('debug onboarding redirect - new signup user', async ({ page }) => {
  // Track all navigations
  const navigations: string[] = [];
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) {
      navigations.push(frame.url());
      console.log('Navigated to:', frame.url());
    }
  });

  // Generate unique email
  const timestamp = Date.now();
  const email = `test-${timestamp}@example.com`;
  const password = 'Password123!';

  // Go to signup
  await page.goto('/auth/signup');
  await page.waitForLoadState('networkidle');

  // Fill signup form
  await page.locator('input[name="firstName"]').fill('Test');
  await page.locator('input[name="lastName"]').fill('User');
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').first().fill(password);

  // Look for confirm password field
  const confirmPassword = page.locator('input[name="confirmPassword"], input[placeholder*="Confirm"]');
  if (await confirmPassword.count() > 0) {
    await confirmPassword.fill(password);
  }

  // Submit
  await page.locator('button[type="submit"]').click();

  // Wait for navigation
  await page.waitForTimeout(10000);

  // Log all navigations
  console.log('\n=== All navigations (signup flow) ===');
  navigations.forEach((url, i) => console.log(`${i + 1}. ${url}`));

  // Check final URL
  const finalUrl = page.url();
  console.log('\nFinal URL:', finalUrl);

  // Count visits
  const dashboardCount = navigations.filter(url => url.includes('/app/dashboard')).length;
  const onboardingCount = navigations.filter(url => url.includes('/app/onboarding')).length;

  console.log(`Dashboard visits: ${dashboardCount}`);
  console.log(`Onboarding visits: ${onboardingCount}`);

  // Check for loop - should not have more than 3 of either
  expect(dashboardCount + onboardingCount).toBeLessThan(6);
});

test('debug onboarding redirect - john.doe user', async ({ page }) => {
  // This user should have profileCompleted: false or null
  const navigations: string[] = [];
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) {
      navigations.push(frame.url());
      console.log('Navigated to:', frame.url());
    }
  });

  await page.goto('/auth/signin');
  await page.waitForLoadState('networkidle');

  // Try john.doe user from seed (might have profileCompleted: false)
  await page.locator('input[type="email"]').fill('john.doe@example.com');
  await page.locator('input[type="password"]').fill('password123');

  await page.locator('button[type="submit"]:has-text("Sign in")').click();
  await page.waitForTimeout(10000);

  console.log('\n=== All navigations (john.doe) ===');
  navigations.forEach((url, i) => console.log(`${i + 1}. ${url}`));
  console.log('\nFinal URL:', page.url());

  const dashboardCount = navigations.filter(url => url.includes('/app/dashboard')).length;
  const onboardingCount = navigations.filter(url => url.includes('/app/onboarding')).length;
  console.log(`Dashboard visits: ${dashboardCount}, Onboarding visits: ${onboardingCount}`);
});
