const {chromium} = require('playwright');

(async () => {
  const host = process.env.DOM || 'https://trueallyguide.com';
  const slugs = JSON.parse(process.env.SLUGS || '["/blog/how-to-stop-attracting-narcissists-9-proven-strategies", "/blog/introvert-networking-tips-without-small-talk-guide"]');
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  for (const slug of slugs) {
    const page = await context.newPage();
    await page.goto(host + slug + '?t=' + Date.now(), {waitUntil: 'networkidle'});
    
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    console.log(`Page ${slug}: background=${bg}`);
    
    if (bg !== 'rgb(255, 236, 216)') {
      console.log('FAIL: Wrong background');
      process.exit(2);
    }
    
    const toc = await page.$('.toc, .table-of-contents');
    if (toc) {
      const tocBox = await toc.boundingBox();
      const para = await page.$('article p');
      const paraBox = para ? await para.boundingBox() : null;
      
      console.log(`Page ${slug}: ToC bottom=${tocBox?.bottom}, Para top=${paraBox?.top}`);
      
      if (tocBox && paraBox && tocBox.bottom > paraBox.top - 8) {
        console.log('FAIL: ToC overlap');
        process.exit(2);
      }
    }
    
    await page.close();
  }
  
  await browser.close();
  console.log('SUCCESS: All visual checks passed');
})();