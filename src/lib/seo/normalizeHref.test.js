import { normalizeHref } from './normalizeHref';

describe('normalizeHref', () => {
  test('handles null and undefined inputs', () => {
    expect(normalizeHref(null)).toBeNull();
    expect(normalizeHref(undefined)).toBeUndefined();
    expect(normalizeHref('')).toBe('');
  });

  test('preserves external links', () => {
    expect(normalizeHref('https://google.com')).toBe('https://google.com');
    expect(normalizeHref('https://example.com/path')).toBe('https://example.com/path');
    expect(normalizeHref('http://external.com')).toBe('http://external.com');
  });

  test('preserves special link types', () => {
    expect(normalizeHref('mailto:test@example.com')).toBe('mailto:test@example.com');
    expect(normalizeHref('tel:+1234567890')).toBe('tel:+1234567890');
    expect(normalizeHref('#section')).toBe('#section');
    expect(normalizeHref('javascript:void(0)')).toBe('javascript:void(0)');
  });

  test('converts http to https for our domain', () => {
    expect(normalizeHref('http://trueallyguide.com/blog')).toBe('https://trueallyguide.com/blog');
    expect(normalizeHref('http://www.trueallyguide.com/blog')).toBe('https://trueallyguide.com/blog');
  });

  test('removes www from our domain', () => {
    expect(normalizeHref('https://www.trueallyguide.com/blog')).toBe('https://trueallyguide.com/blog');
    expect(normalizeHref('https://www.trueallyguide.com/')).toBe('https://trueallyguide.com/');
  });

  test('removes trailing slash except for root - absolute URLs', () => {
    expect(normalizeHref('https://trueallyguide.com/')).toBe('https://trueallyguide.com/');
    expect(normalizeHref('https://trueallyguide.com/blog/')).toBe('https://trueallyguide.com/blog');
    expect(normalizeHref('https://trueallyguide.com/category/self-help/')).toBe('https://trueallyguide.com/category/self-help');
  });

  test('removes trailing slash except for root - relative URLs', () => {
    expect(normalizeHref('/')).toBe('/');
    expect(normalizeHref('/blog/')).toBe('/blog');
    expect(normalizeHref('/category/self-help/')).toBe('/category/self-help');
  });

  test('converts to lowercase', () => {
    expect(normalizeHref('/Blog')).toBe('/blog');
    expect(normalizeHref('/CATEGORY/Self-Help')).toBe('/category/self-help');
    expect(normalizeHref('https://trueallyguide.com/Blog/Article')).toBe('https://trueallyguide.com/blog/article');
  });

  test('preserves encoded characters like %26', () => {
    expect(normalizeHref('/category/relationships%26dating')).toBe('/category/relationships%26dating');
    expect(normalizeHref('https://trueallyguide.com/category/career%26workplace')).toBe('https://trueallyguide.com/category/career%26workplace');
  });

  test('preserves query parameters and hash', () => {
    expect(normalizeHref('/blog?page=2')).toBe('/blog?page=2');
    expect(normalizeHref('/blog#comments')).toBe('/blog#comments');
    expect(normalizeHref('/blog?utm_source=twitter#section')).toBe('/blog?utm_source=twitter#section');
    expect(normalizeHref('https://trueallyguide.com/blog?page=2')).toBe('https://trueallyguide.com/blog?page=2');
  });

  test('handles complex scenarios', () => {
    expect(normalizeHref('HTTP://WWW.trueallyguide.com/Blog/Article/?utm_source=twitter#comments'))
      .toBe('https://trueallyguide.com/blog/article?utm_source=twitter#comments');
    
    expect(normalizeHref('/Category/Relationships%26Dating/?ref=homepage'))
      .toBe('/category/relationships%26dating?ref=homepage');
  });

  test('handles blog post URLs', () => {
    expect(normalizeHref('/blog/how-to-love-yourself/')).toBe('/blog/how-to-love-yourself');
    expect(normalizeHref('/Blog/Introvert-Tips/')).toBe('/blog/introvert-tips');
  });

  test('handles category URLs', () => {
    expect(normalizeHref('/category/relationships/')).toBe('/category/relationships');
    expect(normalizeHref('/Category/Career%26Workplace/')).toBe('/category/career%26workplace');
  });

  test('handles root path variations', () => {
    expect(normalizeHref('/')).toBe('/');
    expect(normalizeHref('https://trueallyguide.com/')).toBe('https://trueallyguide.com/');
    expect(normalizeHref('https://www.trueallyguide.com/')).toBe('https://trueallyguide.com/');
  });
});
