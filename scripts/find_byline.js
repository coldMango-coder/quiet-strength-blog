const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:4173/blog/intentional-dating-2025-guide', { waitUntil: 'networkidle' });
  await page.waitForSelector('article');
  const html = await page.$eval('article', (root) => {
    const nodes = Array.from(root.querySelectorAll('*'));
    const n = nodes.find(n => /\bBy\s+Marica\s+Šinko\b/.test(n.textContent || ''));
    return n ? n.outerHTML : null;
  });
  console.log(html || 'NOT_FOUND');
  await browser.close();
})();
