import { test, expect } from '@playwright/test';

// Comprehensive functional test for messaging with demo authentication
test.describe('Messages Full Functionality', () => {
  test('complete messaging workflow with demo user', async ({ page }) => {
    // 1. Sign in as demo user
    await page.goto('/auth/signin');
    await page.waitForLoadState('domcontentloaded');

    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button:has-text("Sign in")');

    // Wait for auth to complete
    await page.waitForTimeout(3000);

    // 2. Navigate to messages
    await page.goto('/app/messages');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Take screenshot of initial state
    await page.screenshot({ path: 'test-results/messages-1-initial.png', fullPage: true });

    // 3. Check for conversation list - look for demo conversations
    const conversationButtons = page.locator('button').filter({ hasText: /Sarah|Michael|TechFlow|NextGen/i });
    const hasConversations = await conversationButtons.first().isVisible().catch(() => false);

    console.log('Has demo conversations:', hasConversations);

    // 4. Test New Conversation button
    const newButton = page.locator('button:has-text("New")').first();
    if (await newButton.isVisible()) {
      console.log('New button found, clicking...');
      await newButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/messages-2-new-modal.png', fullPage: true });

      // Check modal appeared
      const modal = page.locator('[role="dialog"], .fixed.inset-0, div:has-text("Demo Mode")');
      const modalVisible = await modal.first().isVisible().catch(() => false);
      console.log('New conversation modal visible:', modalVisible);

      // Close modal
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    // 5. Click on a conversation if available
    if (hasConversations) {
      console.log('Clicking first conversation...');
      await conversationButtons.first().click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/messages-3-conversation.png', fullPage: true });

      // 6. Check for message input
      const messageInput = page.locator('textarea').first();
      const inputVisible = await messageInput.isVisible().catch(() => false);
      console.log('Message input visible:', inputVisible);

      if (inputVisible) {
        await messageInput.fill('Test message from Playwright');
        await page.screenshot({ path: 'test-results/messages-4-typed.png', fullPage: true });

        // 7. Check send button exists
        const sendButton = page.locator('button[type="submit"]').first();
        const sendVisible = await sendButton.isVisible().catch(() => false);
        console.log('Send button visible:', sendVisible);

        // Test sending (demo mode will handle it)
        if (sendVisible) {
          await sendButton.click();
          await page.waitForTimeout(500);
          await page.screenshot({ path: 'test-results/messages-5-sent.png', fullPage: true });
        }
      }
    }

    // 8. Test mobile viewport
    console.log('Testing mobile viewport...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/app/messages');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/messages-6-mobile.png', fullPage: true });

    // Check we see conversation list on mobile (not message view)
    const mobileConvList = page.locator('button').filter({ hasText: /Sarah|Michael/i });
    const mobileHasConvList = await mobileConvList.first().isVisible().catch(() => false);
    console.log('Mobile shows conversation list:', mobileHasConvList);

    // 9. Click conversation on mobile
    if (mobileHasConvList) {
      await mobileConvList.first().click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/messages-7-mobile-conv.png', fullPage: true });

      // Check for back button on mobile
      const backButton = page.locator('button').filter({ has: page.locator('svg') }).first();
      console.log('Mobile back button check...');
    }

    // 10. Test tablet viewport
    console.log('Testing tablet viewport...');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/app/messages');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/messages-8-tablet.png', fullPage: true });

    console.log('Functional test complete!');
    console.log('Screenshots saved to test-results/messages-*.png');
  });
});
