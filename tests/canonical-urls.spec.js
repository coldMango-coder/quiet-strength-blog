const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { parseStringPromise } = require('xml2js');

// Read and parse sitemap.xml
async function getSitemapUrls() {
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    throw new Error('sitemap.xml not found. Please generate it first.');
  }
  
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  const result = await parseStringPromise(sitemapContent);
  
  return result.urlset.url.map(url => url.loc[0]);
}

test.describe('Canonical URL Tests', () => {
  let sitemapUrls;
  
  test.beforeAll(async () => {
    sitemapUrls = await getSitemapUrls();
    console.log(`Found ${sitemapUrls.length} URLs in sitemap.xml`);
  });

  test('sitemap URLs should have correct canonical tags', async ({ page }) => {
    const errors = [];
    
    for (const url of sitemapUrls) {
      try {
        // Visit the URL
        const localUrl = url.replace('https://trueallyguide.com', 'http://localhost:3010');
        await page.goto(localUrl, { waitUntil: 'networkidle', timeout: 30000 });
        
        // Wait for React to render and SEO component to inject canonical tag
        await page.waitForTimeout(1000);
        
        // Get all canonical tags
        const canonicalTags = await page.locator('link[rel="canonical"]').all();
        
        // Should have exactly one canonical tag
        if (canonicalTags.length === 0) {
          errors.push(`${url}: No canonical tag found`);
          continue;
        }
        
        if (canonicalTags.length > 1) {
          errors.push(`${url}: Multiple canonical tags found (${canonicalTags.length})`);
          continue;
        }
        
        // Get the href attribute
        const canonicalHref = await canonicalTags[0].getAttribute('href');
        
        if (!canonicalHref) {
          errors.push(`${url}: Canonical tag missing href attribute`);
          continue;
        }
        
        // Clean current URL (remove query params and hash)
        const currentUrl = new URL(url);
        const expectedCanonical = `${currentUrl.origin}${currentUrl.pathname}`;
        
        // Remove trailing slash except for root
        const normalizedExpected = expectedCanonical === 'https://trueallyguide.com/' 
          ? expectedCanonical 
          : expectedCanonical.replace(/\/$/, '');
        
        // Compare canonical href with expected URL
        if (canonicalHref !== normalizedExpected) {
          errors.push(`${url}: Canonical mismatch. Expected: ${normalizedExpected}, Got: ${canonicalHref}`);
        }
        
        console.log(`✓ ${url} → ${canonicalHref}`);
        
      } catch (error) {
        errors.push(`${url}: Error loading page - ${error.message}`);
      }
    }
    
    // Report all errors
    if (errors.length > 0) {
      console.error('Canonical URL Errors:');
      errors.forEach(error => console.error(`  ${error}`));
      throw new Error(`${errors.length} canonical URL errors found`);
    }
    
    console.log(`✅ All ${sitemapUrls.length} URLs have correct canonical tags`);
  });

  test('homepage should have exact canonical URL', async ({ page }) => {
    await page.goto('http://localhost:3010/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    
    const canonicalTag = page.locator('link[rel="canonical"]');
    await expect(canonicalTag).toHaveCount(1);
    
    const href = await canonicalTag.getAttribute('href');
    expect(href).toBe('https://trueallyguide.com/');
  });

  test('blog post URLs should not have trailing slash in canonical', async ({ page }) => {
    const blogUrls = sitemapUrls.filter(url => url.includes('/blog/') && !url.endsWith('/blog'));
    
    if (blogUrls.length === 0) {
      console.log('No blog post URLs found in sitemap');
      return;
    }
    
    for (const url of blogUrls.slice(0, 3)) { // Test first 3 blog posts
      const localUrl = url.replace('https://trueallyguide.com', 'http://localhost:3010');
      await page.goto(localUrl, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1000);
      
      const canonicalTag = page.locator('link[rel="canonical"]');
      const href = await canonicalTag.getAttribute('href');
      
      expect(href).not.toMatch(/\/$/); // Should not end with slash
      expect(href).toMatch(/^https:\/\/trueallyguide\.com\/blog\//); // Should start correctly
    }
  });

  test('category URLs should not have trailing slash in canonical', async ({ page }) => {
    const categoryUrls = sitemapUrls.filter(url => url.includes('/category/'));
    
    if (categoryUrls.length === 0) {
      console.log('No category URLs found in sitemap');
      return;
    }
    
    for (const url of categoryUrls.slice(0, 2)) { // Test first 2 categories
      const localUrl = url.replace('https://trueallyguide.com', 'http://localhost:3010');
      await page.goto(localUrl, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1000);
      
      const canonicalTag = page.locator('link[rel="canonical"]');
      const href = await canonicalTag.getAttribute('href');
      
      expect(href).not.toMatch(/\/$/); // Should not end with slash
      expect(href).toMatch(/^https:\/\/trueallyguide\.com\/category\//); // Should start correctly
    }
  });
});