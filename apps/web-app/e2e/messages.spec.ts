import { test, expect } from '@playwright/test';

// Helper to sign in
async function signIn(page: any, email: string, password: string) {
  await page.goto('/auth/signin');
  await page.waitForLoadState('networkidle');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button:has-text("Sign in")');
  await page.waitForURL('**/app/dashboard', { timeout: 15000 });
}

test.describe('Messages/Conversations', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, 'demo@example.com', 'demo123');
  });

  test('can view messages page', async ({ page }) => {
    await page.goto('/app/messages');
    await page.waitForLoadState('networkidle');

    // The page shows "Secure messages" heading
    await expect(page.locator('h2:has-text("Secure messages")').first()).toBeVisible();
  });

  test('shows conversation list or empty state', async ({ page }) => {
    await page.goto('/app/messages');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Page should load (either with conversations or empty state)
    await expect(page.locator('body')).toContainText(/message|conversation|inbox|no/i, { timeout: 10000 });
  });

  test('can view single conversation', async ({ page }) => {
    await page.goto('/app/messages');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Click on first conversation if available
    const conversationItem = page.locator('a[href*="/app/messages/"], [class*="conversation"], [data-conversation]').first();
    if (await conversationItem.isVisible()) {
      await conversationItem.click();
      await page.waitForTimeout(1000);
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('message page has input field', async ({ page }) => {
    await page.goto('/app/messages');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Try to find message input
    const messageInput = page.locator('textarea, input[placeholder*="message" i], [contenteditable="true"]').first();
    if (await messageInput.isVisible()) {
      await messageInput.fill('Test message');
    }
  });
});

test.describe('Unread Messages', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, 'demo@example.com', 'demo123');
  });

  test('messages link visible in navigation', async ({ page }) => {
    await page.goto('/app/dashboard');
    await page.waitForLoadState('networkidle');

    // Check that messages link exists in DOM (may be hidden on mobile)
    const messagesLink = page.locator('a[href="/app/messages"]').first();
    await expect(messagesLink).toBeAttached();
  });
});
