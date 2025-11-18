const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  await page.goto('http://localhost:4173/blog/how-to-say-no-without-guilt', { waitUntil: 'networkidle' });
  // Wait for TOC to render
  await page.waitForSelector('.qs-toc', { timeout: 10000 });
  const html = await page.$eval('.qs-toc', el => el.outerHTML);
  console.log('---QS_TOC_BEFORE_START---');
  console.log(html);
  console.log('---QS_TOC_BEFORE_END---');
  await browser.close();
})();
