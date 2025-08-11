const { chromium } = require('playwright');

(async () => {
  const host = process.env.HOST || 'http://localhost:3000';
  const s1 = process.env.S1 || '/blog/how-to-stop-attracting-narcissists-9-proven-strategies';
  const s2 = process.env.S2 || '/blog/introvert-networking-tips-without-small-talk-guide';
  const pages = ['/', '/blog', '/books', '/about', s1, s2];
  
  console.log(`Starting visual checks for ${host}`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ 
    deviceScaleFactor: 1,
    viewport: { width: 1200, height: 800 }
  });
  
  for (const p of pages) {
    try {
      console.log(`Checking page: ${p}`);
      const page = await context.newPage();
      
      // Set a longer timeout for page loads
      await page.goto(host + p, { 
        waitUntil: 'networkidle', 
        timeout: 10000 
      });
      
      const fileName = `reports/screens${p.replace(/\W/g, '_')}.png`;
      await page.screenshot({ 
        path: fileName, 
        fullPage: true 
      });
      
      // Check if ToC exists and has proper height
      const toc = await page.$('.toc, .table-of-contents');
      if (toc) {
        const height = await toc.evaluate(el => el.offsetHeight);
        if (height < 40) {
          console.error(`ToC too small on ${p}: ${height}px`);
          process.exit(2);
        } else {
          console.log(`✓ ToC height OK on ${p}: ${height}px`);
        }
      }
      
      await page.close();
      console.log(`✓ Screenshot saved: ${fileName}`);
      
    } catch (err) {
      console.error(`Error checking page ${p}:`, err.message);
      // Don't exit on individual page errors, continue with others
    }
  }
  
  await browser.close();
  console.log('Visual checks completed!');
})();