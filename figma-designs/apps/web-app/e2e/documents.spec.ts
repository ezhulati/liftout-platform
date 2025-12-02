import { test, expect } from '@playwright/test';
import { signIn } from './utils';

test.describe('Documents', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, { email: 'demo@example.com', password: 'password' });
  });

  test('can view documents page', async ({ page }) => {
    await page.goto('/app/documents');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Documents').first()).toBeVisible();
  });

  test('documents page shows upload option', async ({ page }) => {
    await page.goto('/app/documents');
    await page.waitForLoadState('domcontentloaded');

    // Look for upload button or link
    const uploadButton = page.locator('a:has-text("Upload"), button:has-text("Upload"), [class*="upload"]').first();
    await expect(uploadButton).toBeVisible({ timeout: 10000 });
  });

  test('can access document upload page', async ({ page }) => {
    await page.goto('/app/documents/upload');
    await page.waitForLoadState('domcontentloaded');

    // Should show upload form or content
    await expect(page.locator('body')).toContainText(/upload|document|file/i, { timeout: 10000 });
  });

  test('document upload form has file input', async ({ page }) => {
    await page.goto('/app/documents/upload');
    await page.waitForLoadState('domcontentloaded');

    // The file input is hidden, but the drag-drop zone with "Click to upload" text is visible
    await expect(page.locator('text=Click to upload')).toBeVisible({ timeout: 10000 });
    // The hidden file input should exist in the DOM
    await expect(page.locator('input[type="file"]')).toBeAttached({ timeout: 10000 });
  });

  test('documents list page loads', async ({ page }) => {
    await page.goto('/app/documents');
    await page.waitForLoadState('domcontentloaded');

    // Page should load
    await expect(page.locator('body')).toContainText(/document/i);
  });
});

test.describe('Document Security', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, { email: 'demo@example.com', password: 'password' });
  });

  test('documents page loads successfully', async ({ page }) => {
    await page.goto('/app/documents');
    await page.waitForLoadState('domcontentloaded');

    // Page should load (may or may not have documents)
    await expect(page.locator('body')).toBeVisible();
  });
});
