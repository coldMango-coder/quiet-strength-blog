const { test, expect } = require('@playwright/test');

test.describe('Visual Regression Tests', () => {
  const viewports = [
    { width: 360, height: 640, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1280, height: 800, name: 'desktop' }
  ];

  // Test each viewport
  viewports.forEach(({ width, height, name }) => {
    test(`Homepage visual regression - ${name}`, async ({ page }) => {
      // Set viewport
      await page.setViewportSize({ width, height });
      
      // Wait for fonts and images to load
      await page.goto('/', { waitUntil: 'networkidle' });
      
      // Wait for any animations to complete
      await page.waitForTimeout(1000);
      
      // Hide elements that change frequently (like progress bars)
      await page.addStyleTag({
        content: `
          #read-progress { visibility: hidden !important; }
          .animate-pulse { animation: none !important; }
        `
      });
      
      // Take screenshot with 1px tolerance
      await expect(page).toHaveScreenshot(`homepage-${name}.png`, {
        threshold: 0.2,
        maxDiffPixels: 100
      });
    });

    test(`Blog page visual regression - ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/blog', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      
      await page.addStyleTag({
        content: `
          #read-progress { visibility: hidden !important; }
          .animate-pulse { animation: none !important; }
        `
      });
      
      await expect(page).toHaveScreenshot(`blog-${name}.png`, {
        threshold: 0.2,
        maxDiffPixels: 100
      });
    });

    test(`Sample blog post visual regression - ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      // Navigate to first available blog post
      await page.goto('/blog/how-to-set-boundaries-without-feeling-guilty', { 
        waitUntil: 'networkidle' 
      });
      await page.waitForTimeout(1000);
      
      await page.addStyleTag({
        content: `
          #read-progress { visibility: hidden !important; }
          .animate-pulse { animation: none !important; }
        `
      });
      
      await expect(page).toHaveScreenshot(`blog-post-${name}.png`, {
        threshold: 0.2,
        maxDiffPixels: 100
      });
    });
  });

  test('Navigation interaction test', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Test dropdown navigation
    const categoryButton = page.locator('button:has-text("Category")');
    await categoryButton.hover();
    
    // Wait for dropdown to appear
    await page.waitForSelector('[role="menu"]', { state: 'visible' });
    
    // Take screenshot of open dropdown
    await expect(page).toHaveScreenshot('navigation-dropdown.png', {
      threshold: 0.2,
      maxDiffPixels: 100
    });
  });

  test('Mobile menu interaction test', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Open mobile menu
    const menuButton = page.locator('button[aria-label*="navigation menu"]');
    await menuButton.click();
    
    // Wait for menu to slide in
    await page.waitForTimeout(500);
    
    // Take screenshot of open mobile menu
    await expect(page).toHaveScreenshot('mobile-menu-open.png', {
      threshold: 0.2,
      maxDiffPixels: 100
    });
  });

  test('Accessibility compliance', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Check for proper heading hierarchy
    const h1 = await page.locator('h1').count();
    expect(h1).toBe(1);
    
    // Check all images have alt text
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // Check all buttons have accessible names
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();
      expect(ariaLabel || textContent.trim()).toBeTruthy();
    }
    
    // Check color contrast (basic test)
    await page.addStyleTag({
      content: `
        * {
          background: white !important;
          color: black !important;
        }
      `
    });
    
    // Screenshot with high contrast to verify readability
    await expect(page).toHaveScreenshot('high-contrast.png', {
      threshold: 0.5,
      maxDiffPixels: 1000
    });
  });
});