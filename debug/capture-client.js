const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push({ type: msg.type(), text: msg.text() }));

  const requests = [];
  page.on('request', req => requests.push({ url: req.url(), method: req.method(), resourceType: req.resourceType() }));
  const responses = [];
  page.on('response', res => responses.push({ url: res.url(), status: res.status() }));

  const url = 'http://localhost:5300/';
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 10000 });
  } catch (e) {
    consoleLogs.push({ type: 'error', text: 'goto failed for ' + url + ': ' + e.message });
  }

  await page.waitForTimeout(12000);

  const html = await page.content();
  fs.writeFileSync('debug/console.log', consoleLogs.map(l => `[${l.type}] ${l.text}`).join('\n'));
  fs.writeFileSync('debug/network.json', JSON.stringify({ url, requests, responses }, null, 2));
  fs.writeFileSync('debug/after.html', html);

  await browser.close();
})();
