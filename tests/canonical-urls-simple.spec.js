const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Simple canonical test with fixed URLs
test.describe('Canonical URL Tests - Simple', () => {
  test('canonical URLs test with chromium only', async ({ page }) => {
    // Build the app and start server automatically
    console.log('Starting server...');
    
    // Test key URLs directly
    const testUrls = [
      { path: '/', expected: 'https://trueallyguide.com/' },
      { path: '/blog', expected: 'https://trueallyguide.com/blog' },
      { path: '/category/self-development', expected: 'https://trueallyguide.com/category/self-development' }
    ];
    
    for (const { path, expected } of testUrls) {
      console.log(`Testing ${path}`);
      
      try {
        await page.goto(`http://localhost:3010${path}`, { 
          waitUntil: 'domcontentloaded', 
          timeout: 10000 
        });
        
        // Wait for React to render
        await page.waitForTimeout(2000);
        
        // Get canonical tag
        const canonicalTags = await page.locator('link[rel="canonical"]').all();
        expect(canonicalTags).toHaveLength(1);
        
        const canonicalHref = await canonicalTags[0].getAttribute('href');
        expect(canonicalHref).toBe(expected);
        
        console.log(`✓ ${path} → ${canonicalHref}`);
      } catch (error) {
        console.error(`✗ ${path} failed: ${error.message}`);
        throw error;
      }
    }
  });
});