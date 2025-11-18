const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.setViewportSize({ width: 1280, height: 900 });
  page.setDefaultTimeout(20000);
  await page.goto('http://localhost:4173/blog/how-to-say-no-without-guilt', { waitUntil: 'networkidle' });
  await page.waitForSelector('.qs-toc .modern-toc', { state: 'attached', timeout: 15000 });
  const outer = await page.$eval('.qs-toc', el => el.outerHTML);
  const heightBefore = await page.evaluate(() => {
    const m = document.querySelector('[data-toc-mount], #toc-anchor');
    return m ? Math.round(m.getBoundingClientRect().height) : null;
  });
  const heightAfter = await page.$eval('.qs-toc', el => Math.round(el.getBoundingClientRect().height));
  console.log('---QS_TOC_AFTER_START---');
  console.log(outer);
  console.log('---QS_TOC_AFTER_END---');
  console.log('---QS_TOC_HEIGHTS---');
  console.log(JSON.stringify({ mountHeight: heightBefore, tocHeight: heightAfter }));
  await browser.close();
})();
