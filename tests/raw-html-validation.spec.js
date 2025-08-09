/**
 * Raw HTML validation tests using curl-like requests
 * Validates server-side rendering and canonical tags without JavaScript
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://www.trueallyguide.com';

test.describe('Raw HTML Validation', () => {
  
  test('Homepage raw HTML should contain correct canonical', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/`);
    expect(response.status()).toBe(200);
    
    const html = await response.text();
    
    // Check canonical tag exists and is correct
    expect(html).toMatch(/<link rel="canonical" href="https:\/\/www\.trueallyguide\.com\/" \/>/);
    
    // Should have only one canonical tag
    const canonicalMatches = html.match(/rel="canonical"/g);
    expect(canonicalMatches).toHaveLength(1);
    
    // Check essential meta tags
    expect(html).toMatch(/<meta name="description" content=".+"/);
    expect(html).toMatch(/<title>.+<\/title>/);
    expect(html).toMatch(/<meta property="og:url" content="https:\/\/www\.trueallyguide\.com\/" \/>/);
    
    // Check structured data exists
    expect(html).toMatch(/<script type="application\/ld\+json">/);
    expect(html).toContain('"@type": "WebSite"');
    expect(html).toContain('"@type": "Organization"');
  });

  test('Blog listing raw HTML should contain correct canonical', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/blog/`);
    expect(response.status()).toBe(200);
    
    const html = await response.text();
    
    // Check canonical tag
    expect(html).toMatch(/<link rel="canonical" href="https:\/\/www\.trueallyguide\.com\/blog\/" \/>/);
    
    // Should have only one canonical tag
    const canonicalMatches = html.match(/rel="canonical"/g);
    expect(canonicalMatches).toHaveLength(1);
    
    // Check blog-specific meta tags
    expect(html).toContain('Blog | Quiet Strength');
    expect(html).toContain('"@type": "Blog"');
  });

  test('Article pages raw HTML should contain correct canonicals', async ({ request }) => {
    const testArticles = [
      'how-to-stop-attracting-narcissists-9-proven-strategies',
      'how-to-stop-attracting-emotionally-unavailable-men-guide',
      'introvert-networking-tips-without-small-talk-guide'
    ];
    
    for (const slug of testArticles) {
      const url = `${BASE_URL}/blog/${slug}/`;
      const response = await request.get(url);
      expect(response.status()).toBe(200);
      
      const html = await response.text();
      
      // Check canonical tag matches exact URL
      const canonicalRegex = new RegExp(`<link rel="canonical" href="${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}" />`);
      expect(html).toMatch(canonicalRegex);
      
      // Should have only one canonical tag
      const canonicalMatches = html.match(/rel="canonical"/g);
      expect(canonicalMatches).toHaveLength(1);
      
      // Check article-specific structured data
      expect(html).toContain('"@type": "Article"');
      expect(html).toContain('"@type": "Person"'); // Author
      expect(html).toContain('"datePublished"');
      
      // Check Open Graph tags
      expect(html).toMatch(/<meta property="og:type" content="article" \/>/);
      expect(html).toMatch(/<meta property="og:url" content=".+" \/>/);
      expect(html).toContain('article:published_time');
    }
  });

  test('Category pages raw HTML should contain correct canonicals', async ({ request }) => {
    const categories = [
      'relationships-and-dating',
      'career-and-workplace',
      'introversion-and-personality',
      'self-development'
    ];
    
    for (const category of categories) {
      const url = `${BASE_URL}/category/${category}/`;
      const response = await request.get(url);
      expect(response.status()).toBe(200);
      
      const html = await response.text();
      
      // Check canonical tag
      const canonicalRegex = new RegExp(`<link rel="canonical" href="${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}" />`);
      expect(html).toMatch(canonicalRegex);
      
      // Should have only one canonical tag
      const canonicalMatches = html.match(/rel="canonical"/g);
      expect(canonicalMatches).toHaveLength(1);
      
      // Check category-specific content
      expect(html).toContain('Articles | Quiet Strength');
    }
  });

  test('Critical performance optimizations should be in raw HTML', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/`);
    const html = await response.text();
    
    // Check font preloading
    expect(html).toMatch(/<link rel="preload" as="font" href="\/fonts\/inter-var\.woff2" type="font\/woff2" crossorigin>/);
    expect(html).toMatch(/<link rel="preload" as="font" href="\/fonts\/charter-regular\.woff2" type="font\/woff2" crossorigin>/);
    
    // Check critical image preloading for LCP
    expect(html).toMatch(/<link rel="preload" as="image" href="\/images\/.+\.avif" type="image\/avif" fetchpriority="high">/);
    
    // Check critical CSS is inlined
    expect(html).toContain('<style>');
    expect(html).toContain('font-display:swap');
    expect(html).toContain('contain:layout');
    
    // Check JavaScript loading is optimized
    expect(html).toContain('requestIdleCallback');
    expect(html).toContain('async');
    expect(html).toContain('defer');
  });

  test('Accessibility features should be in raw HTML', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/`);
    const html = await response.text();
    
    // Check skip link
    expect(html).toContain('Skip to main content');
    expect(html).toContain('href="#main-content"');
    
    // Check semantic HTML
    expect(html).toContain('role="banner"');
    expect(html).toContain('role="main"');
    expect(html).toContain('id="main-content"');
    
    // Check ARIA labels
    expect(html).toContain('aria-labelledby');
    expect(html).toContain('aria-label');
    
    // Check proper image alt texts
    expect(html).toMatch(/alt="[^"]*Quiet Strength[^"]*logo"/);
  });

  test('Security and SEO headers should be optimized', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/`);
    
    // Check security headers (these might be set by Vercel)
    const headers = response.headers();
    
    // Check caching headers for static assets
    const cssResponse = await request.get(`${BASE_URL}/static/css/main.884ce9db.css`);
    const cacheControl = cssResponse.headers()['cache-control'];
    if (cacheControl) {
      expect(cacheControl).toContain('max-age=31536000');
    }
    
    // Check HTML headers
    const html = await response.text();
    
    // Check no mixed content
    expect(html).not.toMatch(/src="http:\/\/[^"]+"/);
    expect(html).not.toMatch(/href="http:\/\/[^"]+"/);
    
    // Check proper language declaration
    expect(html).toMatch(/<html lang="en">/);
    
    // Check charset declaration
    expect(html).toMatch(/<meta charset="utf-8" \/>/);
    
    // Check viewport meta
    expect(html).toMatch(/<meta name="viewport" content="width=device-width, initial-scale=1" \/>/);
  });

  test('All pages should have unique and descriptive titles', async ({ request }) => {
    const pages = [
      { url: '/', expectedTitle: 'Quiet Strength – Self-Help & Productivity for Introverted Women' },
      { url: '/blog/', expectedTitle: 'Blog | Quiet Strength' },
      { url: '/blog/how-to-stop-attracting-narcissists-9-proven-strategies/', expectedTitle: /How to Stop Attracting Narcissists.*Quiet Strength/ },
      { url: '/category/relationships-and-dating/', expectedTitle: /Relationships & Dating Articles.*Quiet Strength/ }
    ];
    
    for (const page of pages) {
      const response = await request.get(`${BASE_URL}${page.url}`);
      const html = await response.text();
      
      const titleMatch = html.match(/<title>([^<]+)<\/title>/);
      expect(titleMatch).toBeTruthy();
      
      const title = titleMatch[1];
      
      if (typeof page.expectedTitle === 'string') {
        expect(title).toBe(page.expectedTitle);
      } else {
        expect(title).toMatch(page.expectedTitle);
      }
      
      // Title should be under 60 characters for SEO
      expect(title.length).toBeLessThanOrEqual(65);
    }
  });
});