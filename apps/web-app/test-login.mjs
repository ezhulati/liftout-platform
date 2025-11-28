import { chromium } from 'playwright';

async function testLogin(email, password, userType) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(`\n--- Testing ${userType} login: ${email} ---`);

  try {
    // Go to signin page
    await page.goto('http://localhost:3001/auth/signin');
    await page.waitForLoadState('networkidle');
    console.log('✓ Loaded signin page');

    // Fill in credentials
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    console.log('✓ Filled credentials');

    // Click sign in button
    await page.click('button[type="submit"]');
    console.log('✓ Clicked sign in');

    // Wait for navigation to dashboard
    await page.waitForURL('**/app/dashboard', { timeout: 10000 });
    console.log('✓ Redirected to dashboard');

    // Take a screenshot
    const screenshotPath = `/Users/ez/Documents/Apps/Liftout/liftout-platform/apps/web-app/${userType}-dashboard.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`✓ Screenshot saved: ${screenshotPath}`);

    // Check page content
    const pageTitle = await page.textContent('h1');
    console.log(`✓ Dashboard title: ${pageTitle}`);

    // Wait a bit to see the page
    await page.waitForTimeout(2000);

  } catch (error) {
    console.error(`✗ Error: ${error.message}`);
    const screenshotPath = `/Users/ez/Documents/Apps/Liftout/liftout-platform/apps/web-app/${userType}-error.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved: ${screenshotPath}`);
  } finally {
    await browser.close();
  }
}

// Test both logins
async function main() {
  await testLogin('demo@example.com', 'password', 'team-user');
  await testLogin('company@example.com', 'password', 'company-user');
}

main().catch(console.error);
