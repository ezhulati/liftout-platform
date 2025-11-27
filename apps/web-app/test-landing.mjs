import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

console.log('Testing homepage...');
await page.goto('http://localhost:3001/');
await page.waitForLoadState('networkidle');
await page.screenshot({ path: 'homepage-screenshot.png', fullPage: true });

// Check for key elements
const tagline = await page.locator('text=The Strategic Team Acquisition Platform').isVisible();
const headline = await page.locator('text=Where proven teams meet growth opportunities').isVisible();
const forCompanies = await page.locator('text=For Companies').first().isVisible();
const forTeams = await page.locator('text=For Teams').first().isVisible();
const companyPain = await page.locator("text=Tired of hiring individuals that don't gel?").isVisible();
const teamPain = await page.locator('text=Ready for a new challenge together?').isVisible();

console.log('✓ Tagline visible:', tagline);
console.log('✓ Headline visible:', headline);
console.log('✓ For Companies section:', forCompanies);
console.log('✓ For Teams section:', forTeams);
console.log('✓ Company pain point:', companyPain);
console.log('✓ Team pain point:', teamPain);

console.log('\nTesting /for-companies...');
await page.goto('http://localhost:3001/for-companies');
await page.waitForLoadState('networkidle');
await page.screenshot({ path: 'for-companies-screenshot.png', fullPage: true });

console.log('\nTesting /for-teams...');
await page.goto('http://localhost:3001/for-teams');
await page.waitForLoadState('networkidle');
await page.screenshot({ path: 'for-teams-screenshot.png', fullPage: true });

console.log('\n✅ All screenshots saved!');
console.log('Screenshots: homepage-screenshot.png, for-companies-screenshot.png, for-teams-screenshot.png');

// Wait a bit so you can see the page
await page.waitForTimeout(3000);

await browser.close();
