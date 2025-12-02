import { test, expect } from '@playwright/test';

test.describe('Team Invite Flow', () => {
  test('can access team member management and invite UI', async ({ page }) => {
    // Login as demo user
    await page.goto('/auth/signin');
    await page.waitForLoadState('networkidle');

    await page.locator('input[type="email"]').fill('demo@example.com');
    await page.locator('input[type="password"]').fill('password');
    await page.locator('button[type="submit"]:has-text("Sign in")').click();

    // Wait for dashboard
    await page.waitForURL('**/app/dashboard', { timeout: 15000 });
    console.log('Logged in, now on dashboard');

    // Navigate to teams page
    await page.goto('/app/teams');
    await page.waitForLoadState('networkidle');
    console.log('On teams page:', page.url());

    // Take screenshot
    await page.screenshot({ path: 'test-results/teams-page.png' });

    // Look for team cards or create team button
    const teamsContent = await page.locator('main').innerText();
    console.log('Teams page content preview:', teamsContent.substring(0, 500));

    // Try to find a team link to click
    const teamLink = page.locator('a[href*="/app/teams/"]').first();
    if (await teamLink.isVisible({ timeout: 5000 })) {
      const href = await teamLink.getAttribute('href');
      console.log('Found team link:', href);
      await teamLink.click();
      await page.waitForLoadState('networkidle');

      // Look for members/manage link
      const membersLink = page.locator('a[href*="/members"], button:has-text("Manage"), button:has-text("Invite")');
      if (await membersLink.first().isVisible({ timeout: 5000 })) {
        console.log('Found members/manage link');
        await membersLink.first().click();
        await page.waitForLoadState('networkidle');
      }
    }

    // Take final screenshot
    await page.screenshot({ path: 'test-results/team-detail.png' });
    console.log('Final URL:', page.url());
  });

  test('test API directly - get teams', async ({ request }) => {
    // First login to get session
    const loginResponse = await request.post('/api/auth/callback/credentials', {
      form: {
        email: 'demo@example.com',
        password: 'password',
      },
    });
    console.log('Login response status:', loginResponse.status());

    // Try to get teams
    const teamsResponse = await request.get('/api/teams');
    console.log('Teams API response:', teamsResponse.status());
    if (teamsResponse.ok()) {
      const teams = await teamsResponse.json();
      console.log('Teams:', JSON.stringify(teams, null, 2).substring(0, 500));
    }
  });
});
