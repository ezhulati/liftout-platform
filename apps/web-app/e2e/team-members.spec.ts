import { test, expect } from '@playwright/test';
import { signIn } from './utils';

test.describe('Team Member Profiles', () => {
  test('member profile page shows full profile with skills', async ({ page }) => {
    // Sign in
    await signIn(page, { email: 'company@example.com', password: 'password' });

    // Go directly to Alex's profile
    await page.goto('/app/members/demo-user-alex');
    await page.waitForLoadState('domcontentloaded');

    // Verify profile loaded
    await expect(page.locator('h1:has-text("Alex Chen")')).toBeVisible({ timeout: 15000 });

    // Check for skills section
    await expect(page.locator('h2:has-text("Skills & Expertise")')).toBeVisible({ timeout: 5000 });

    // Check for a specific skill badge
    const skillBadge = page.locator('span:has-text("Machine Learning")').first();
    await expect(skillBadge).toBeVisible({ timeout: 5000 });

    // Check for achievements section
    await expect(page.locator('h2:has-text("Key Achievements")')).toBeVisible({ timeout: 5000 });

    // Check team affiliation link
    await expect(page.locator('text=TechFlow Data Science Team')).toBeVisible({ timeout: 5000 });

    // Verify back button exists
    await expect(page.locator('text=Back to team')).toBeVisible({ timeout: 5000 });
  });

  test('all demo team members have profile pages', async ({ page }) => {
    // Sign in
    await signIn(page, { email: 'company@example.com', password: 'password' });

    // Test each team member's profile
    const members = [
      { id: 'demo-user-alex', name: 'Alex Chen' },
      { id: 'demo-user-sarah', name: 'Sarah Martinez' },
      { id: 'demo-user-marcus', name: 'Marcus Johnson' },
      { id: 'demo-user-priya', name: 'Priya Patel' },
    ];

    for (const member of members) {
      await page.goto(`/app/members/${member.id}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator(`h1:has-text("${member.name}")`)).toBeVisible({ timeout: 10000 });
    }
  });
});
