const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { parseStringPromise } = require('xml2js');

// Read and parse sitemap.xml for test URLs
async function getSitemapUrls() {
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    throw new Error('sitemap.xml not found. Please generate it first.');
  }
  
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  const result = await parseStringPromise(sitemapContent);
  
  return result.urlset.url.map(url => url.loc[0]);
}

test.describe('Prerendered SEO Tests (No JavaScript)', () => {
  let sitemapUrls;
  
  test.beforeAll(async () => {
    sitemapUrls = await getSitemapUrls();
    console.log(`Found ${sitemapUrls.length} URLs in sitemap.xml for prerender testing`);
  });

  test('prerendered pages should have correct canonical tags without JavaScript', async ({ page }) => {
    // Disable JavaScript to test server-side rendered content only
    await page.context().addInitScript(() => {
      // Disable JavaScript completely
      delete window.HTMLScriptElement;
      delete window.Function;
      delete window.eval;
    });
    
    // Alternatively, use this approach to disable JS
    await page.setJavaScriptEnabled(false);
    
    const errors = [];
    
    // Test each URL from sitemap
    for (const url of sitemapUrls) {
      try {
        console.log(`Testing prerendered content for: ${url}`);
        
        // Visit the URL with JavaScript disabled
        await page.goto(url, { 
          waitUntil: 'domcontentloaded', // No need to wait for JS
          timeout: 10000 
        });
        
        // Get the page source (server-rendered HTML only)
        const pageSource = await page.content();
        
        // Extract canonical tag from raw HTML
        const canonicalMatch = pageSource.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
        
        if (!canonicalMatch) {
          errors.push(`${url}: No canonical tag found in server-rendered HTML`);
          continue;
        }
        
        const canonicalHref = canonicalMatch[1];
        
        // Validate canonical URL matches the current page URL
        const currentUrl = new URL(url);
        const expectedCanonical = currentUrl.origin + currentUrl.pathname;
        
        // Normalize expected canonical (remove trailing slash except for root)
        const normalizedExpected = expectedCanonical === 'https://trueallyguide.com/' 
          ? expectedCanonical 
          : expectedCanonical.replace(/\/$/, '');
        
        if (canonicalHref !== normalizedExpected) {
          errors.push(`${url}: Canonical mismatch in prerendered HTML. Expected: ${normalizedExpected}, Got: ${canonicalHref}`);
        } else {
          console.log(`✅ ${url} → canonical: ${canonicalHref}`);
        }
        
        // Verify other essential meta tags exist in prerendered HTML
        if (!pageSource.includes('<meta name="description"')) {
          errors.push(`${url}: Missing description meta tag in prerendered HTML`);
        }
        
        if (!pageSource.includes('<title>')) {
          errors.push(`${url}: Missing title tag in prerendered HTML`);
        }
        
      } catch (error) {
        errors.push(`${url}: Error testing prerendered content - ${error.message}`);
      }
    }
    
    // Report all errors
    if (errors.length > 0) {
      console.error('\n❌ Prerender SEO Errors:');
      errors.forEach(error => console.error(`  ${error}`));
      throw new Error(`${errors.length} prerender SEO errors found`);
    }
    
    console.log(`\n✅ All ${sitemapUrls.length} URLs have correct canonical tags in prerendered HTML`);
  });

  test('homepage should have exact canonical URL in prerendered HTML', async ({ page }) => {
    await page.setJavaScriptEnabled(false);
    
    await page.goto('https://trueallyguide.com/', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    
    const pageSource = await page.content();
    const canonicalMatch = pageSource.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
    
    expect(canonicalMatch).toBeTruthy();
    expect(canonicalMatch[1]).toBe('https://trueallyguide.com/');
    
    console.log('✅ Homepage canonical correct in prerendered HTML');
  });

  test('blog post URLs should not have trailing slash in prerendered canonical', async ({ page }) => {
    await page.setJavaScriptEnabled(false);
    
    const blogUrls = sitemapUrls.filter(url => url.includes('/blog/') && !url.endsWith('/blog'));
    
    if (blogUrls.length === 0) {
      console.log('No blog post URLs found in sitemap');
      return;
    }
    
    for (const url of blogUrls.slice(0, 3)) { // Test first 3 blog posts
      await page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: 10000 
      });
      
      const pageSource = await page.content();
      const canonicalMatch = pageSource.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
      
      expect(canonicalMatch).toBeTruthy();
      const canonicalHref = canonicalMatch[1];
      
      expect(canonicalHref).not.toMatch(/\/$/); // Should not end with slash
      expect(canonicalHref).toMatch(/^https:\/\/trueallyguide\.com\/blog\//); // Should start correctly
      
      console.log(`✅ ${url} → prerendered canonical: ${canonicalHref}`);
    }
  });

  test('category URLs should not have trailing slash in prerendered canonical', async ({ page }) => {
    await page.setJavaScriptEnabled(false);
    
    const categoryUrls = sitemapUrls.filter(url => url.includes('/category/'));
    
    if (categoryUrls.length === 0) {
      console.log('No category URLs found in sitemap');
      return;
    }
    
    for (const url of categoryUrls.slice(0, 2)) { // Test first 2 categories
      await page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: 10000 
      });
      
      const pageSource = await page.content();
      const canonicalMatch = pageSource.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
      
      expect(canonicalMatch).toBeTruthy();
      const canonicalHref = canonicalMatch[1];
      
      expect(canonicalHref).not.toMatch(/\/$/); // Should not end with slash
      expect(canonicalHref).toMatch(/^https:\/\/trueallyguide\.com\/category\//); // Should start correctly
      
      console.log(`✅ ${url} → prerendered canonical: ${canonicalHref}`);
    }
  });

  test('prerendered HTML should contain essential SEO elements without JS', async ({ page }) => {
    await page.setJavaScriptEnabled(false);
    
    const testUrls = [
      'https://trueallyguide.com/',
      'https://trueallyguide.com/blog',
      sitemapUrls.find(url => url.includes('/blog/')) || 'https://trueallyguide.com/blog',
      sitemapUrls.find(url => url.includes('/category/')) || 'https://trueallyguide.com'
    ];
    
    for (const url of testUrls) {
      await page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: 10000 
      });
      
      const pageSource = await page.content();
      
      // Check for essential SEO elements in server-rendered HTML
      expect(pageSource).toMatch(/<title>[^<]+<\/title>/); // Has title
      expect(pageSource).toMatch(/<meta[^>]+name=["']description["'][^>]*content=["'][^"']+["'][^>]*>/); // Has description
      expect(pageSource).toMatch(/<link[^>]+rel=["']canonical["'][^>]*>/); // Has canonical
      expect(pageSource).toMatch(/<meta[^>]+property=["']og:title["'][^>]*>/); // Has OG title
      expect(pageSource).toMatch(/<meta[^>]+property=["']og:description["'][^>]*>/); // Has OG description
      
      console.log(`✅ ${url} has all essential SEO elements in prerendered HTML`);
    }
  });
});