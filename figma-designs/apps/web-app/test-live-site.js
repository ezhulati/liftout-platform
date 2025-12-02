const puppeteer = require('puppeteer');

async function testLiveSite() {
  console.log('🚀 Testing live site: https://liftout.com');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Enable request/response logging
  page.on('request', request => {
    console.log('→ REQUEST:', request.method(), request.url());
  });
  
  page.on('response', response => {
    console.log('← RESPONSE:', response.status(), response.url());
  });
  
  // Enable console logging
  page.on('console', msg => {
    console.log('🖥️  CONSOLE:', msg.type(), msg.text());
  });
  
  // Enable error logging
  page.on('pageerror', error => {
    console.error('❌ PAGE ERROR:', error.message);
  });
  
  try {
    console.log('📍 Step 1: Navigate to live site...');
    await page.goto('https://liftout.com', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    console.log('📍 Current URL:', page.url());
    console.log('📍 Page title:', await page.title());
    
    // Check if we're on an error page
    const errorElement = await page.$('.text-red-500, [class*="error"]');
    if (errorElement) {
      const errorText = await page.evaluate(el => el.textContent, errorElement);
      console.log('❌ Error found on page:', errorText);
    }
    
    // Check for redirect loops by monitoring URL changes
    let redirectCount = 0;
    const maxRedirects = 10;
    let lastUrl = page.url();
    
    while (redirectCount < maxRedirects) {
      await page.waitForTimeout(1000);
      const currentUrl = page.url();
      
      if (currentUrl !== lastUrl) {
        redirectCount++;
        console.log(`🔄 Redirect ${redirectCount}: ${lastUrl} → ${currentUrl}`);
        lastUrl = currentUrl;
        
        if (currentUrl.includes('/auth/error')) {
          console.log('❌ Landed on auth error page');
          const urlParams = new URL(currentUrl).searchParams;
          console.log('❌ Error params:', Object.fromEntries(urlParams));
          break;
        }
      } else {
        console.log('✅ Page seems stable at:', currentUrl);
        break;
      }
    }
    
    if (redirectCount >= maxRedirects) {
      console.log('❌ Detected infinite redirect loop!');
    }
    
    // Try to access the signin page directly
    console.log('📍 Step 2: Test signin page directly...');
    await page.goto('https://liftout.com/auth/signin', { 
      waitUntil: 'networkidle2',
      timeout: 15000 
    });
    
    console.log('📍 Signin page URL:', page.url());
    
    // Check for authentication API endpoint
    console.log('📍 Step 3: Test auth API endpoint...');
    const authResponse = await page.goto('https://liftout.com/api/auth/providers', {
      waitUntil: 'networkidle2',
      timeout: 15000
    });
    
    console.log('📍 Auth API status:', authResponse.status());
    if (authResponse.ok()) {
      const authData = await authResponse.json();
      console.log('📍 Auth providers:', Object.keys(authData));
    }
    
    console.log('✅ Test completed');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
  
  // Keep browser open for manual inspection
  console.log('🔍 Browser left open for manual inspection. Close when done.');
  // await browser.close();
}

testLiveSite().catch(console.error);