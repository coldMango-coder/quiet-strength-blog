const { test, expect } = require('@playwright/test');

test.describe('Performance Budget Tests', () => {
  // Performance budget thresholds
  const budgets = {
    fcp: 1800, // First Contentful Paint (ms)
    lcp: 2500, // Largest Contentful Paint (ms)
    tbt: 50,   // Total Blocking Time (ms)
    cls: 0,    // Cumulative Layout Shift
    si: 2500,  // Speed Index (ms)
    transferSize: 1500 * 1024 // Transfer size (bytes) - 1.5MB
  };

  test('Homepage performance metrics meet budget', async ({ page }) => {
    // Start performance monitoring
    const metricsPromise = new Promise(resolve => {
      const metrics = {};
      
      page.on('response', response => {
        // Track transfer sizes
        if (!metrics.transferSize) metrics.transferSize = 0;
        const contentLength = response.headers()['content-length'];
        if (contentLength) {
          metrics.transferSize += parseInt(contentLength);
        }
      });
      
      page.on('domcontentloaded', () => {
        metrics.domContentLoaded = Date.now();
      });
      
      resolve(metrics);
    });

    // Navigate to homepage
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait for Web Vitals
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {};
        let resolved = false;
        
        // Function to resolve when we have all metrics
        const checkComplete = () => {
          if (vitals.fcp && vitals.lcp && vitals.cls !== undefined && !resolved) {
            resolved = true;
            resolve(vitals);
          }
        };
        
        // Observe performance entries
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              vitals.fcp = entry.startTime;
            } else if (entry.entryType === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime;
            }
            checkComplete();
          }
        });
        
        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
        
        // CLS measurement
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          vitals.cls = clsValue;
          checkComplete();
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        
        // Fallback timeout
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            resolve(vitals);
          }
        }, 10000);
      });
    });

    const metrics = await metricsPromise;
    const loadTime = Date.now() - startTime;
    
    // Test performance budgets
    console.log('Performance Metrics:', {
      fcp: webVitals.fcp,
      lcp: webVitals.lcp,
      cls: webVitals.cls,
      loadTime,
      transferSize: metrics.transferSize
    });

    // Assert performance budgets
    expect(webVitals.fcp).toBeLessThanOrEqual(budgets.fcp);
    expect(webVitals.lcp).toBeLessThanOrEqual(budgets.lcp);
    expect(webVitals.cls).toBeLessThanOrEqual(budgets.cls);
    expect(loadTime).toBeLessThanOrEqual(budgets.si);
    
    // Check resource hints are present
    const preloadLinks = await page.locator('link[rel="preload"]').count();
    expect(preloadLinks).toBeGreaterThan(0);
    
    const preconnectLinks = await page.locator('link[rel="preconnect"]').count();
    expect(preconnectLinks).toBeGreaterThan(0);
  });

  test('JavaScript bundle size is optimized', async ({ page }) => {
    const responses = [];
    
    page.on('response', response => {
      if (response.url().includes('.js') && response.url().includes('/static/')) {
        responses.push({
          url: response.url(),
          size: parseInt(response.headers()['content-length'] || '0')
        });
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Check main JS bundle size
    const mainBundle = responses.find(r => r.url.includes('main.'));
    expect(mainBundle).toBeTruthy();
    
    // Main bundle should be under 500KB
    expect(mainBundle.size).toBeLessThan(500 * 1024);
    
    console.log('JavaScript bundles:', responses);
  });

  test('CSS is optimized and critical CSS is inlined', async ({ page }) => {
    await page.goto('/');
    
    // Check that critical CSS is inlined
    const inlineStyles = await page.locator('style').count();
    expect(inlineStyles).toBeGreaterThan(0);
    
    // Check for non-critical CSS loading
    const preloadCSS = await page.locator('link[rel="preload"][as="style"]').count();
    expect(preloadCSS).toBeGreaterThan(0);
    
    // Measure First Contentful Paint with and without CSS
    const fcp = await page.evaluate(() => {
      return new Promise(resolve => {
        const observer = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              resolve(entry.startTime);
            }
          }
        });
        observer.observe({ entryTypes: ['paint'] });
      });
    });
    
    expect(fcp).toBeLessThanOrEqual(budgets.fcp);
  });

  test('Images are optimized and lazy loaded', async ({ page }) => {
    await page.goto('/');
    
    // Check for WebP/AVIF images
    const pictureElements = await page.locator('picture').count();
    expect(pictureElements).toBeGreaterThan(0);
    
    // Check lazy loading
    const lazyImages = await page.locator('img[loading="lazy"]').count();
    expect(lazyImages).toBeGreaterThan(0);
    
    // Check for proper image dimensions to prevent CLS
    const images = await page.locator('img').all();
    for (const img of images) {
      const width = await img.getAttribute('width');
      const height = await img.getAttribute('height');
      const style = await img.getAttribute('style');
      
      // Should have either width/height attributes or aspect-ratio CSS
      expect(width || height || (style && style.includes('aspect-ratio'))).toBeTruthy();
    }
  });

  test('Fonts are optimized with preload and swap', async ({ page }) => {
    await page.goto('/');
    
    // Check font preloads
    const fontPreloads = await page.locator('link[rel="preload"][as="font"]').count();
    expect(fontPreloads).toBeGreaterThan(0);
    
    // Check font-display: swap is used
    const fontCSS = await page.locator('link[href*="fonts.googleapis.com"]').getAttribute('href');
    expect(fontCSS).toContain('display=swap');
  });

  test('Security headers are present', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response.headers();
    
    // Check for security headers
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['x-xss-protection']).toBe('1; mode=block');
    expect(headers['strict-transport-security']).toContain('max-age=31536000');
    expect(headers['content-security-policy']).toBeTruthy();
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  });

  test('DOM size is optimized', async ({ page }) => {
    await page.goto('/');
    
    // Count DOM nodes
    const nodeCount = await page.evaluate(() => {
      return document.querySelectorAll('*').length;
    });
    
    // Should be under 1500 nodes
    expect(nodeCount).toBeLessThan(1500);
    
    // Check DOM depth
    const maxDepth = await page.evaluate(() => {
      let maxDepth = 0;
      
      function getDepth(node, depth = 0) {
        maxDepth = Math.max(maxDepth, depth);
        for (const child of node.children) {
          getDepth(child, depth + 1);
        }
      }
      
      getDepth(document.body);
      return maxDepth;
    });
    
    // Should be under 32 levels deep
    expect(maxDepth).toBeLessThan(32);
    
    console.log('DOM Stats:', { nodeCount, maxDepth });
  });

  test('Lighthouse performance score target', async ({ page }) => {
    // This would require lighthouse integration
    // For now, we'll check key indicators that contribute to Lighthouse score
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Check for render-blocking resources
    const renderBlockingCSS = await page.locator('link[rel="stylesheet"]:not([media]):not([onload])').count();
    expect(renderBlockingCSS).toBe(0); // Should be 0 due to async loading
    
    // Check for properly sized images
    const images = await page.locator('img').all();
    for (const img of images) {
      const sizes = await img.getAttribute('sizes');
      const srcset = await img.getAttribute('srcset');
      
      // Images should have responsive attributes
      if (img) {
        expect(sizes || srcset).toBeTruthy();
      }
    }
    
    // Check for efficient cache headers (simulated)
    const response = await page.goto('/static/js/main.js', { waitUntil: 'domcontentloaded' });
    if (response && response.ok()) {
      const cacheControl = response.headers()['cache-control'];
      expect(cacheControl).toContain('max-age=31536000');
    }
  });
});