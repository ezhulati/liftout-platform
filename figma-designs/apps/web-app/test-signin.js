const puppeteer = require('puppeteer');

async function testSignIn() {
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true,
    defaultViewport: null
  });
  
  const page = await browser.newPage();
  
  // Listen to console logs
  page.on('console', msg => {
    console.log('BROWSER CONSOLE:', msg.type(), msg.text());
  });
  
  // Listen to page errors
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });
  
  // Listen to network requests
  page.on('response', response => {
    console.log('NETWORK:', response.status(), response.url());
  });
  
  try {
    console.log('Navigating to signin page...');
    await page.goto('http://localhost:3002/auth/signin', { waitUntil: 'networkidle0' });
    
    console.log('Waiting for page to load...');
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    
    console.log('Filling in demo credentials...');
    await page.type('input[type="email"]', 'demo@liftout.com');
    await page.type('input[type="password"]', 'demo123');
    
    console.log('Clicking sign in button...');
    await page.click('button[type="submit"]');
    
    console.log('Waiting for response...');
    
    // Wait for either success (redirect to dashboard) or error
    try {
      // Wait for navigation to dashboard OR error message
      await Promise.race([
        page.waitForNavigation({ timeout: 15000 }),
        page.waitForSelector('.toast', { timeout: 15000 })
      ]);
      
      const currentUrl = page.url();
      console.log('Current URL after sign-in attempt:', currentUrl);
      
      if (currentUrl.includes('/app/dashboard')) {
        console.log('SUCCESS: Redirected to dashboard');
      } else if (currentUrl.includes('/auth/signin')) {
        console.log('ISSUE: Still on signin page');
        
        // Check for error messages
        const errorToast = await page.$('.toast');
        if (errorToast) {
          const errorText = await page.evaluate(el => el.textContent, errorToast);
          console.log('Error message:', errorText);
        }
        
        // Check form state
        const emailValue = await page.$eval('input[type="email"]', el => el.value);
        const isLoading = await page.$('.animate-spin');
        console.log('Form state - Email:', emailValue, 'Loading:', !!isLoading);
      }
      
    } catch (waitError) {
      console.log('TIMEOUT: No navigation or toast appeared within 15 seconds');
      console.log('Current URL:', page.url());
    }
    
    // Keep browser open for inspection
    console.log('Keeping browser open for 30 seconds for inspection...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await browser.close();
  }
}

testSignIn().catch(console.error);