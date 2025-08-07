import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import NormalizedLink from '../NormalizedLink';
import { getCanonicalUrl } from '../../lib/seo/getCanonicalUrl';

const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

// Snapshot test for blog post content with internal links
describe('NormalizedLink Internal Links Test', () => {
  test('normalizes internal links to match canonical URLs', () => {
    // Simulate a blog post component with various types of links
    const BlogPostContent = () => (
      <article>
        <h1>Sample Blog Post</h1>
        <p>
          Check out our <NormalizedLink to="/Blog/">blog</NormalizedLink> for more articles.
        </p>
        <p>
          You might also like our article on{' '}
          <NormalizedLink to="/category/Self-Development/">self-development</NormalizedLink>.
        </p>
        <p>
          Read about <NormalizedLink to="https://trueallyguide.com/blog/Introvert-Tips/">introvert tips</NormalizedLink>.
        </p>
        <p>
          Visit our <NormalizedLink to="/">homepage</NormalizedLink> or{' '}
          <NormalizedLink href="mailto:contact@trueallyguide.com">contact us</NormalizedLink>.
        </p>
        <p>
          External reference: <NormalizedLink to="https://example.com">Example</NormalizedLink>
        </p>
        <p>
          Jump to <NormalizedLink to="#section">section</NormalizedLink> below.
        </p>
      </article>
    );

    const { container } = renderWithRouter(<BlogPostContent />);
    
    // Get all internal router links (React Router Links)
    const routerLinks = container.querySelectorAll('a[href]:not([href^="http"]):not([href^="mailto:"]):not([href^="#"])');
    
    // Test that internal links are normalized consistently
    const normalizedLinks = Array.from(routerLinks).map(link => {
      const href = link.getAttribute('href');
      const text = link.textContent;
      const expectedCanonical = getCanonicalUrl(href);
      
      return {
        text,
        actualHref: href,
        expectedCanonical,
        isCorrectlyNormalized: href === expectedCanonical.replace('https://trueallyguide.com', '') || href === expectedCanonical
      };
    });

    // All internal links should be correctly normalized
    const incorrectlyNormalized = normalizedLinks.filter(link => !link.isCorrectlyNormalized);
    
    // Create snapshot of link normalization results
    expect(normalizedLinks).toMatchSnapshot('normalized-internal-links');
    
    // Assert that all internal links are correctly normalized
    expect(incorrectlyNormalized).toHaveLength(0);
    
    // Verify specific expected normalizations
    expect(normalizedLinks).toEqual(expect.arrayContaining([
      expect.objectContaining({ 
        text: 'blog', 
        actualHref: '/blog',
        expectedCanonical: 'https://trueallyguide.com/blog',
        isCorrectlyNormalized: true 
      }),
      expect.objectContaining({ 
        text: 'self-development', 
        actualHref: '/category/self-development',
        expectedCanonical: 'https://trueallyguide.com/category/self-development',
        isCorrectlyNormalized: true 
      }),
      expect.objectContaining({ 
        text: 'introvert tips', 
        actualHref: '/blog/introvert-tips',
        expectedCanonical: 'https://trueallyguide.com/blog/introvert-tips',
        isCorrectlyNormalized: true 
      }),
      expect.objectContaining({ 
        text: 'homepage', 
        actualHref: '/',
        expectedCanonical: 'https://trueallyguide.com/',
        isCorrectlyNormalized: true 
      })
    ]));
    
    // Get external and special links (regular anchor tags)
    const externalLinks = container.querySelectorAll('a[href^="http"], a[href^="mailto:"], a[href^="#"]');
    const externalLinkData = Array.from(externalLinks).map(link => ({
      text: link.textContent,
      href: link.getAttribute('href')
    }));
    
    // Verify external and special links are preserved
    expect(externalLinkData).toEqual(expect.arrayContaining([
      { text: 'contact us', href: 'mailto:contact@trueallyguide.com' },
      { text: 'Example', href: 'https://example.com' },
      { text: 'section', href: '#section' }
    ]));
  });

  test('normalizeHref output matches getCanonicalUrl for internal paths', () => {
    // Test various internal paths
    const testPaths = [
      '/',
      '/blog',
      '/blog/',
      '/Blog/',
      '/category/self-development',
      '/Category/Self-Development/',
      'https://trueallyguide.com/blog/',
      'https://www.trueallyguide.com/Blog/',
      'HTTP://WWW.trueallyguide.com/Category/Test/'
    ];

    testPaths.forEach(path => {
      const { normalizeHref } = require('../../lib/seo/normalizeHref');
      const normalizedHref = normalizeHref(path);
      
      // Extract path part from normalized href
      let pathPart = normalizedHref;
      if (normalizedHref.startsWith('https://trueallyguide.com')) {
        pathPart = normalizedHref.replace('https://trueallyguide.com', '') || '/';
      }
      
      const canonicalUrl = getCanonicalUrl(pathPart);
      
      // The canonical URL should match the normalized href when both are converted to the same format
      const expectedCanonical = canonicalUrl.replace('https://trueallyguide.com', '') || '/';
      
      expect(pathPart).toBe(expectedCanonical);
    });
  });
});