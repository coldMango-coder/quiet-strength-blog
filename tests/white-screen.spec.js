const { test, expect } = require('@playwright/test');

test('app does not blank out after load', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const initial = await page.content();
  await page.waitForTimeout(12000);
  const after = await page.content();
  expect(after.length).toBeGreaterThan(0);
  expect(after).not.toEqual('<html><head></head><body></body></html>');
  // Additionally, ensure there is a root container with children
  const rootChildren = await page.locator('#root *').count();
  expect(rootChildren).toBeGreaterThan(0);
});

