import { getCanonicalUrl } from './getCanonicalUrl';

describe('getCanonicalUrl', () => {
  const baseUrl = 'https://trueallyguide.com';

  test('returns correct URL for homepage', () => {
    expect(getCanonicalUrl('/')).toBe(`${baseUrl}/`);
    expect(getCanonicalUrl('')).toBe(`${baseUrl}/`);
    expect(getCanonicalUrl(null)).toBe(`${baseUrl}/`);
    expect(getCanonicalUrl(undefined)).toBe(`${baseUrl}/`);
  });

  test('removes trailing slash for non-root paths', () => {
    expect(getCanonicalUrl('/blog/')).toBe(`${baseUrl}/blog`);
    expect(getCanonicalUrl('/about/')).toBe(`${baseUrl}/about`);
    expect(getCanonicalUrl('/category/self-help/')).toBe(`${baseUrl}/category/self-help`);
  });

  test('preserves paths without trailing slash', () => {
    expect(getCanonicalUrl('/blog')).toBe(`${baseUrl}/blog`);
    expect(getCanonicalUrl('/about')).toBe(`${baseUrl}/about`);
    expect(getCanonicalUrl('/category/self-help')).toBe(`${baseUrl}/category/self-help`);
  });

  test('removes query parameters', () => {
    expect(getCanonicalUrl('/blog?page=2')).toBe(`${baseUrl}/blog`);
    expect(getCanonicalUrl('/blog?utm_source=twitter&utm_medium=social')).toBe(`${baseUrl}/blog`);
    expect(getCanonicalUrl('/?ref=homepage')).toBe(`${baseUrl}/`);
  });

  test('removes hash fragments', () => {
    expect(getCanonicalUrl('/blog#comments')).toBe(`${baseUrl}/blog`);
    expect(getCanonicalUrl('/about#contact')).toBe(`${baseUrl}/about`);
    expect(getCanonicalUrl('/#hero')).toBe(`${baseUrl}/`);
  });

  test('removes both query params and hash', () => {
    expect(getCanonicalUrl('/blog?page=2#comments')).toBe(`${baseUrl}/blog`);
    expect(getCanonicalUrl('/?utm_source=twitter#hero')).toBe(`${baseUrl}/`);
  });

  test('converts to lowercase', () => {
    expect(getCanonicalUrl('/Blog')).toBe(`${baseUrl}/blog`);
    expect(getCanonicalUrl('/ABOUT')).toBe(`${baseUrl}/about`);
    expect(getCanonicalUrl('/Category/Self-Help')).toBe(`${baseUrl}/category/self-help`);
  });

  test('handles blog post URLs', () => {
    expect(getCanonicalUrl('/blog/how-to-love-yourself')).toBe(`${baseUrl}/blog/how-to-love-yourself`);
    expect(getCanonicalUrl('/blog/introvert-networking-tips/')).toBe(`${baseUrl}/blog/introvert-networking-tips`);
  });

  test('handles category URLs', () => {
    expect(getCanonicalUrl('/category/relationships')).toBe(`${baseUrl}/category/relationships`);
    expect(getCanonicalUrl('/category/productivity/')).toBe(`${baseUrl}/category/productivity`);
  });

  test('handles book URLs', () => {
    expect(getCanonicalUrl('/book-quiet-confidence')).toBe(`${baseUrl}/book-quiet-confidence`);
    expect(getCanonicalUrl('/book-quiet-confidence/')).toBe(`${baseUrl}/book-quiet-confidence`);
  });

  test('handles complex scenarios', () => {
    expect(getCanonicalUrl('/Blog/How-To-Love-Yourself/?utm_source=twitter&page=1#comments'))
      .toBe(`${baseUrl}/blog/how-to-love-yourself`);
    expect(getCanonicalUrl('/CATEGORY/RELATIONSHIPS/?ref=homepage#top'))
      .toBe(`${baseUrl}/category/relationships`);
  });
});