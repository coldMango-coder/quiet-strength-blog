const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://localhost:4173/blog/how-to-say-no-without-guilt', { waitUntil: 'networkidle' });
  await page.waitForSelector('.qs-toc .modern-toc, .qs-toc details', { state: 'attached', timeout: 15000 });
  const outer = await page.$eval('.qs-toc', el => el.outerHTML);
  console.log('---QS_TOC_AFTER_COMPACT_START---');
  console.log(outer);
  console.log('---QS_TOC_AFTER_COMPACT_END---');
  await browser.close();
})();
