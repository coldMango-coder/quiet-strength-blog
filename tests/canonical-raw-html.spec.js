/**
 * Raw HTML Canonical Tests (No JavaScript Execution)
 * 
 * These tests fetch server HTML directly using Node.js fetch to verify
 * that canonical tags are correct in the raw HTML response before any
 * JavaScript/React execution occurs.
 * 
 * This prevents regressions where canonicals are only correct after
 * client-side JavaScript runs (Helmet).
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://trueallyguide.com';

// Helper function to fetch raw HTML without JavaScript execution
async function fetchRawHTML(url) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; CanonicalTest/1.0)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText} for ${url}`);
  }
  
  return await response.text();
}

// Helper function to extract canonical URL from raw HTML
function extractCanonicalFromHTML(html) {
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
  return canonicalMatch ? canonicalMatch[1] : null;
}

// Helper function to count canonical tags in HTML
function countCanonicalTags(html) {
  const matches = html.match(/<link[^>]*rel=["']canonical["'][^>]*>/gi);
  return matches ? matches.length : 0;
}

test.describe('Raw HTML Canonical URLs (Server-Side)', () => {
  
  test('Homepage has correct canonical in server HTML', async () => {
    const html = await fetchRawHTML(`${BASE_URL}/`);
    const canonical = extractCanonicalFromHTML(html);
    const count = countCanonicalTags(html);
    
    expect(count).toBe(1); // Exactly one canonical tag
    expect(canonical).toBe(`${BASE_URL}/`); // Homepage canonical
    expect(html).toContain('Server-side canonical URL'); // Confirm server-side generation
  });

  test('First display item has self-canonical in server HTML', async () => {
    const url = `${BASE_URL}/blog/how-to-stop-attracting-narcissists-9-proven-strategies/`;
    const html = await fetchRawHTML(url);
    const canonical = extractCanonicalFromHTML(html);
    const count = countCanonicalTags(html);
    
    expect(count).toBe(1); // Exactly one canonical tag
    expect(canonical).toBe(url); // Self-referencing canonical
    expect(canonical).not.toBe(`${BASE_URL}/`); // NOT homepage canonical
    expect(html).toContain('Server-side canonical URL'); // Confirm server-side generation
  });

  test('Second display item has self-canonical in server HTML', async () => {
    const url = `${BASE_URL}/blog/how-to-stop-attracting-emotionally-unavailable-men-guide/`;
    const html = await fetchRawHTML(url);
    const canonical = extractCanonicalFromHTML(html);
    const count = countCanonicalTags(html);
    
    expect(count).toBe(1); // Exactly one canonical tag
    expect(canonical).toBe(url); // Self-referencing canonical
    expect(canonical).not.toBe(`${BASE_URL}/`); // NOT homepage canonical
    expect(html).toContain('Server-side canonical URL'); // Confirm server-side generation
  });

  test('Blog listing page has correct canonical', async () => {
    const url = `${BASE_URL}/blog/`;
    const html = await fetchRawHTML(url);
    const canonical = extractCanonicalFromHTML(html);
    const count = countCanonicalTags(html);
    
    expect(count).toBe(1); // Exactly one canonical tag
    expect(canonical).toBe(url); // Self-referencing canonical
    expect(canonical).not.toBe(`${BASE_URL}/`); // NOT homepage canonical
  });

  test('Additional blog post has self-canonical', async () => {
    const url = `${BASE_URL}/blog/introvert-networking-tips-without-small-talk-guide/`;
    const html = await fetchRawHTML(url);
    const canonical = extractCanonicalFromHTML(html);
    const count = countCanonicalTags(html);
    
    expect(count).toBe(1); // Exactly one canonical tag
    expect(canonical).toBe(url); // Self-referencing canonical
    expect(canonical).not.toBe(`${BASE_URL}/`); // NOT homepage canonical
  });

  test('All canonicals are absolute URLs with correct domain', async () => {
    const testUrls = [
      `${BASE_URL}/`,
      `${BASE_URL}/blog/`,
      `${BASE_URL}/blog/how-to-stop-attracting-narcissists-9-proven-strategies/`,
      `${BASE_URL}/blog/how-to-stop-attracting-emotionally-unavailable-men-guide/`
    ];

    for (const url of testUrls) {
      const html = await fetchRawHTML(url);
      const canonical = extractCanonicalFromHTML(html);
      
      expect(canonical).toBeTruthy();
      expect(canonical).toMatch(/^https?:\/\//); // Absolute URL
      expect(canonical).toContain('trueallyguide.com'); // Correct domain
      expect(canonical).not.toContain('?'); // No query parameters
      expect(canonical).not.toContain('#'); // No hash fragments
    }
  });

  test('Server HTML contains comprehensive meta tags', async () => {
    const url = `${BASE_URL}/blog/how-to-stop-attracting-narcissists-9-proven-strategies/`;
    const html = await fetchRawHTML(url);
    
    // Verify essential meta tags are in server HTML
    expect(html).toContain('<meta name="description"');
    expect(html).toContain('<meta property="og:title"');
    expect(html).toContain('<meta property="og:url"');
    expect(html).toContain('<meta property="og:type"');
    expect(html).toContain('<meta name="twitter:card"');
    expect(html).toContain('application/ld+json'); // Schema.org structured data
    
    // Verify no JavaScript is required for meta tags
    expect(html).not.toContain('<!-- Helmet rendered'); // Should be server-side, not Helmet
  });

  test('Canonical URLs match live URL patterns exactly', async () => {
    // Test that canonicals follow the exact same URL pattern as the live URLs
    const testCases = [
      {
        url: `${BASE_URL}/`,
        expectedCanonical: `${BASE_URL}/`
      },
      {
        url: `${BASE_URL}/blog/`,
        expectedCanonical: `${BASE_URL}/blog/`
      },
      {
        url: `${BASE_URL}/blog/how-to-stop-attracting-narcissists-9-proven-strategies/`,
        expectedCanonical: `${BASE_URL}/blog/how-to-stop-attracting-narcissists-9-proven-strategies/`
      }
    ];

    for (const { url, expectedCanonical } of testCases) {
      const html = await fetchRawHTML(url);
      const canonical = extractCanonicalFromHTML(html);
      
      expect(canonical).toBe(expectedCanonical);
    }
  });

  test('No homepage canonical leakage on non-homepage pages', async () => {
    const nonHomepageUrls = [
      `${BASE_URL}/blog/`,
      `${BASE_URL}/blog/how-to-stop-attracting-narcissists-9-proven-strategies/`,
      `${BASE_URL}/blog/how-to-stop-attracting-emotionally-unavailable-men-guide/`,
      `${BASE_URL}/blog/introvert-networking-tips-without-small-talk-guide/`
    ];

    for (const url of nonHomepageUrls) {
      const html = await fetchRawHTML(url);
      const canonical = extractCanonicalFromHTML(html);
      
      expect(canonical).not.toBe(`${BASE_URL}/`); // Must NOT be homepage canonical
      expect(canonical).toBe(url); // Must be self-referencing
    }
  });
});
