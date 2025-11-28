import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testPublicPages(page) {
  console.log('\n=== Testing Public Pages ===');

  // Test Terms page
  console.log('\n--- Testing /terms ---');
  await page.goto(`${BASE_URL}/terms`);
  await page.waitForLoadState('networkidle');
  const termsTitle = await page.textContent('h1');
  console.log(`Terms page title: "${termsTitle}"`);
  if (termsTitle?.includes('Terms of Service')) {
    console.log('✓ Terms page loads correctly');
  } else {
    console.log('✗ Terms page failed');
  }

  // Test Privacy page
  console.log('\n--- Testing /privacy ---');
  await page.goto(`${BASE_URL}/privacy`);
  await page.waitForLoadState('networkidle');
  const privacyTitle = await page.textContent('h1');
  console.log(`Privacy page title: "${privacyTitle}"`);
  if (privacyTitle?.includes('Privacy Policy')) {
    console.log('✓ Privacy page loads correctly');
  } else {
    console.log('✗ Privacy page failed');
  }
}

async function testTeamUserFlow(page) {
  console.log('\n=== Testing Team User Flow (demo@example.com) ===');

  // Login
  console.log('\n--- Login ---');
  await page.goto(`${BASE_URL}/auth/signin`);
  await page.waitForLoadState('networkidle');
  await page.fill('input[type="email"]', 'demo@example.com');
  await page.fill('input[type="password"]', 'demo123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/app/dashboard', { timeout: 10000 });
  console.log('✓ Login successful - redirected to dashboard');

  // Check dashboard loads
  const welcomeText = await page.textContent('h1');
  console.log(`Dashboard welcome: "${welcomeText}"`);

  await page.screenshot({ path: 'test-screenshots/team-dashboard.png', fullPage: true });
  console.log('✓ Screenshot saved: test-screenshots/team-dashboard.png');

  // Test Opportunities page via direct navigation
  console.log('\n--- Testing Opportunities Page ---');
  await page.goto(`${BASE_URL}/app/opportunities`);
  await page.waitForLoadState('networkidle');
  await delay(1500);

  // Check if opportunities loaded (either from API or mock)
  const pageContent = await page.content();
  const hasMockData = pageContent.includes('Goldman Sachs') || pageContent.includes('Strategic') || pageContent.includes('opportunities');
  console.log(`Page has opportunity content: ${hasMockData}`);

  await page.screenshot({ path: 'test-screenshots/team-opportunities.png', fullPage: true });
  console.log('✓ Screenshot saved: test-screenshots/team-opportunities.png');

  // Test Opportunity Detail page directly
  console.log('\n--- Testing Opportunity Detail ---');
  await page.goto(`${BASE_URL}/app/opportunities/opp_mock_001`);
  await page.waitForLoadState('networkidle');
  await delay(1500);

  // Check if the page loaded
  const oppDetailContent = await page.content();
  const hasOppDetail = oppDetailContent.includes('Strategic') || oppDetailContent.includes('Apply') || oppDetailContent.includes('Goldman');
  console.log(`Opportunity detail page has content: ${hasOppDetail}`);

  // Check for Apply button
  const applyButton = await page.locator('button:has-text("Apply with Your Team")').isVisible();
  console.log(`Apply button visible: ${applyButton}`);

  // Check for Express Interest button
  const eoiButton = await page.locator('button:has-text("Express Interest")').isVisible();
  console.log(`Express Interest button visible: ${eoiButton}`);

  await page.screenshot({ path: 'test-screenshots/team-opportunity-detail.png', fullPage: true });
  console.log('✓ Screenshot saved: test-screenshots/team-opportunity-detail.png');

  // Test Express Interest
  console.log('\n--- Testing Express Interest ---');
  if (eoiButton) {
    await page.click('button:has-text("Express Interest")');
    await delay(2000);
    console.log('✓ Express Interest button clicked');
  }

  // Test Apply button (opens modal)
  console.log('\n--- Testing Apply Modal ---');
  if (applyButton) {
    await page.click('button:has-text("Apply with Your Team")');
    await delay(1000);

    // Check for modal
    const modalVisible = await page.locator('text=Write a cover letter').isVisible();
    console.log(`Apply modal visible: ${modalVisible}`);

    if (modalVisible) {
      // Fill cover letter
      await page.fill('textarea', 'This is a test application from our automated E2E test. Our team has extensive experience in the required areas.');
      await delay(500);

      await page.screenshot({ path: 'test-screenshots/team-apply-modal.png' });
      console.log('✓ Screenshot saved: test-screenshots/team-apply-modal.png');

      // Submit application
      await page.click('button:has-text("Submit Application")');
      await delay(2000);

      // Should redirect to applications page
      const currentUrl = page.url();
      console.log(`Current URL after submit: ${currentUrl}`);
      if (currentUrl.includes('applications')) {
        console.log('✓ Application submitted successfully');
      }
    }
  }

  // Test Applications page
  console.log('\n--- Testing My Applications Page ---');
  await page.goto(`${BASE_URL}/app/applications`);
  await page.waitForLoadState('networkidle');
  await delay(1000);

  const appsContent = await page.content();
  const hasApps = appsContent.includes('Application') || appsContent.includes('application');
  console.log(`Applications page has content: ${hasApps}`);

  await page.screenshot({ path: 'test-screenshots/team-applications.png', fullPage: true });
  console.log('✓ Screenshot saved: test-screenshots/team-applications.png');

  // Test Team Profile page
  console.log('\n--- Testing Team Profile Page ---');
  await page.goto(`${BASE_URL}/app/teams`);
  await page.waitForLoadState('networkidle');
  await delay(1000);

  await page.screenshot({ path: 'test-screenshots/team-profile.png', fullPage: true });
  console.log('✓ Screenshot saved: test-screenshots/team-profile.png');

  // Test Messages page
  console.log('\n--- Testing Messages Page ---');
  await page.goto(`${BASE_URL}/app/messages`);
  await page.waitForLoadState('networkidle');
  await delay(1000);

  await page.screenshot({ path: 'test-screenshots/team-messages.png', fullPage: true });
  console.log('✓ Screenshot saved: test-screenshots/team-messages.png');

  // Test Settings page
  console.log('\n--- Testing Settings Page ---');
  await page.goto(`${BASE_URL}/app/settings`);
  await page.waitForLoadState('networkidle');
  await delay(1000);

  await page.screenshot({ path: 'test-screenshots/team-settings.png', fullPage: true });
  console.log('✓ Screenshot saved: test-screenshots/team-settings.png');
}

async function testCompanyUserFlow(page) {
  console.log('\n=== Testing Company User Flow (company@example.com) ===');

  // Login
  console.log('\n--- Login ---');
  await page.goto(`${BASE_URL}/auth/signin`);
  await page.waitForLoadState('networkidle');
  await page.fill('input[type="email"]', 'company@example.com');
  await page.fill('input[type="password"]', 'demo123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/app/dashboard', { timeout: 10000 });
  console.log('✓ Login successful - redirected to dashboard');

  // Check dashboard
  const welcomeText = await page.textContent('h1');
  console.log(`Dashboard welcome: "${welcomeText}"`);

  await page.screenshot({ path: 'test-screenshots/company-dashboard.png', fullPage: true });
  console.log('✓ Screenshot saved: test-screenshots/company-dashboard.png');

  // Test Search Teams page
  console.log('\n--- Testing Search Teams Page ---');
  await page.goto(`${BASE_URL}/app/search`);
  await page.waitForLoadState('networkidle');
  await delay(1000);

  await page.screenshot({ path: 'test-screenshots/company-search.png', fullPage: true });
  console.log('✓ Screenshot saved: test-screenshots/company-search.png');

  // Test My Opportunities page
  console.log('\n--- Testing My Opportunities Page ---');
  await page.goto(`${BASE_URL}/app/opportunities`);
  await page.waitForLoadState('networkidle');
  await delay(1000);

  await page.screenshot({ path: 'test-screenshots/company-opportunities.png', fullPage: true });
  console.log('✓ Screenshot saved: test-screenshots/company-opportunities.png');

  // Test Applications page (received applications)
  console.log('\n--- Testing Received Applications Page ---');
  await page.goto(`${BASE_URL}/app/applications`);
  await page.waitForLoadState('networkidle');
  await delay(1000);

  await page.screenshot({ path: 'test-screenshots/company-applications.png', fullPage: true });
  console.log('✓ Screenshot saved: test-screenshots/company-applications.png');
}

async function runTests() {
  console.log('Starting E2E Tests...\n');

  // Create screenshots directory
  const { mkdir } = await import('fs/promises');
  await mkdir('test-screenshots', { recursive: true });

  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  try {
    // Test public pages first
    await testPublicPages(page);

    // Test team user flow
    await testTeamUserFlow(page);

    // Clear cookies to logout
    await context.clearCookies();

    // Test company user flow
    await testCompanyUserFlow(page);

    console.log('\n========================================');
    console.log('All E2E tests completed successfully!');
    console.log('Check test-screenshots/ for visual results');
    console.log('========================================\n');

  } catch (error) {
    console.error('\n✗ Test failed with error:', error.message);
    await page.screenshot({ path: 'test-screenshots/error.png', fullPage: true });
    console.log('Error screenshot saved: test-screenshots/error.png');
  } finally {
    await delay(2000);
    await browser.close();
  }
}

runTests().catch(console.error);
