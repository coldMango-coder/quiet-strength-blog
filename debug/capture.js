const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const server = require('child_process').spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['serve', '-s', 'build', '-l', '5000'], { stdio: 'inherit' });
  await new Promise(r => setTimeout(r, 1500));

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const consoleLogs = [];
  page.on('console', msg => {
    const entry = { type: msg.type(), text: msg.text() };
    consoleLogs.push(entry);
    // also echo for visibility
    // console.log('[console]', entry.type, entry.text);
  });

  const requests = [];
  page.on('request', req => {
    requests.push({ url: req.url(), method: req.method(), resourceType: req.resourceType() });
  });
  const responses = [];
  page.on('response', res => {
    responses.push({ url: res.url(), status: res.status() });
  });

  try {
    await page.goto('http://localhost:5000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(12000);
  } catch (e) {
    consoleLogs.push({ type: 'error', text: 'navigation error: ' + e.message });
  }

  const html = await page.content();
  fs.writeFileSync('debug/console.log', consoleLogs.map(l => `[${l.type}] ${l.text}`).join('\n'));
  fs.writeFileSync('debug/network.json', JSON.stringify({ requests, responses }, null, 2));
  fs.writeFileSync('debug/after.html', html);

  await browser.close();
  server.kill('SIGTERM');
})();
