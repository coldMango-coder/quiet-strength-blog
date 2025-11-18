const { chromium } = require('@playwright/test');
(async () => {
  const base = 'http://localhost:4173';
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(base + '/blog/how-to-say-no-without-guilt', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.qs-toc', { state: 'attached', timeout: 15000 });
  const tocExpanded = await page.$eval('.qs-toc', el => el.outerHTML);
  console.log('---BEFORE_TOC_EXPANDED_START---');
  console.log(tocExpanded);
  console.log('---BEFORE_TOC_EXPANDED_END---');
  // Home page themes grid
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#themes', { timeout: 15000 });
  const themesGridBefore = await page.$eval('#themes', el => el.outerHTML);
  console.log('---BEFORE_THEMES_SECTION_START---');
  console.log(themesGridBefore);
  console.log('---BEFORE_THEMES_SECTION_END---');
  await browser.close();
})();
