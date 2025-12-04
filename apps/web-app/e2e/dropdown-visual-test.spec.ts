import { test, expect } from '@playwright/test';
import { signIn } from './utils';

test('VISUAL: header dropdown z-index test', async ({ page }) => {
  // Login
  await signIn(page, { email: 'demo@example.com', password: 'password' });

  // Go to dashboard
  await page.goto('/app/dashboard');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Take screenshot before clicking dropdown
  await page.screenshot({ path: 'test-results/01-before-dropdown.png' });

  // Find the profile button area and click it
  // The button contains "Open user menu" as sr-only text
  const header = page.locator('header');
  const profileArea = header.locator('button').last();

  await profileArea.click();
  await page.waitForTimeout(1000);

  // Take screenshot with dropdown open
  await page.screenshot({ path: 'test-results/02-dropdown-open.png' });

  // Debug: Check DOM structure
  const debugInfo = await page.evaluate(() => {
    const portal = document.getElementById('dropdown-portal');
    const menu = document.querySelector('[role="menu"]');
    const browseBtn = Array.from(document.querySelectorAll('a')).find(a => a.textContent?.includes('Browse opportunities'));

    const getStackingInfo = (el: Element | null) => {
      if (!el) return null;
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      let parent = el.parentElement;
      const parentChain: Array<{tag: string, id: string, className: string, zIndex: string, position: string}> = [];
      while (parent && parentChain.length < 10) {
        const parentStyle = window.getComputedStyle(parent);
        parentChain.push({
          tag: parent.tagName,
          id: parent.id,
          className: parent.className.slice(0, 50),
          zIndex: parentStyle.zIndex,
          position: parentStyle.position
        });
        parent = parent.parentElement;
      }
      return {
        zIndex: style.zIndex,
        position: style.position,
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
        parentElement: el.parentElement?.id || el.parentElement?.tagName,
        parentChain
      };
    };

    return {
      portalExists: !!portal,
      portalChildren: portal?.children.length || 0,
      portalStyle: portal ? window.getComputedStyle(portal) : null,
      menuInPortal: portal?.contains(menu),
      menuInfo: getStackingInfo(menu),
      buttonInfo: getStackingInfo(browseBtn || null)
    };
  });

  console.log('Debug Info:');
  console.log('Portal exists:', debugInfo.portalExists);
  console.log('Portal children:', debugInfo.portalChildren);
  console.log('Portal z-index:', debugInfo.portalStyle?.zIndex);
  console.log('Menu in portal:', debugInfo.menuInPortal);
  console.log('Menu info:', JSON.stringify(debugInfo.menuInfo, null, 2));
  console.log('Button info:', JSON.stringify(debugInfo.buttonInfo, null, 2));

  // Use specific selector for dropdown menu item
  const dropdownProfile = page.locator('[role="menuitem"]:has-text("Your profile")');
  const isDropdownVisible = await dropdownProfile.isVisible();
  console.log('Dropdown profile menu item visible:', isDropdownVisible);

  // Check what element is actually at the dropdown's position using elementFromPoint
  const elementAtPoint = await page.evaluate(() => {
    const menu = document.querySelector('[role="menu"]');
    if (!menu) return { error: 'no menu found' };

    const menuRect = menu.getBoundingClientRect();
    const centerX = menuRect.left + menuRect.width / 2;
    const centerY = menuRect.top + 30; // A bit down from top to hit menu items

    const elementAtCenter = document.elementFromPoint(centerX, centerY);

    return {
      menuRect: { top: menuRect.top, left: menuRect.left, width: menuRect.width, height: menuRect.height },
      testPoint: { x: centerX, y: centerY },
      elementAtPoint: elementAtCenter ? {
        tagName: elementAtCenter.tagName,
        className: elementAtCenter.className.slice(0, 100),
        textContent: elementAtCenter.textContent?.slice(0, 50),
        isInsideMenu: menu.contains(elementAtCenter)
      } : null
    };
  });

  console.log('Element at dropdown position:', JSON.stringify(elementAtPoint, null, 2));

  // Try to click the dropdown item
  if (isDropdownVisible) {
    await dropdownProfile.click({ force: false });
    await page.waitForTimeout(1000);
    console.log('Final URL after click:', page.url());
  }

  await page.screenshot({ path: 'test-results/03-after-click.png' });
});
