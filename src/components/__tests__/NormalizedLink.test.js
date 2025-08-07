import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import NormalizedLink from '../NormalizedLink';

// Use the actual normalizeHref function for more realistic testing
import { normalizeHref } from '../../lib/seo/normalizeHref';

const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('NormalizedLink', () => {
  test('renders internal links as React Router Links', () => {
    const { container } = renderWithRouter(
      <NormalizedLink to="/blog">Blog Link</NormalizedLink>
    );
    
    const link = container.querySelector('a');
    expect(link).toHaveTextContent('Blog Link');
    expect(link).toHaveAttribute('href', '/blog');
  });

  test('renders external links as anchor tags', () => {
    const { container } = renderWithRouter(
      <NormalizedLink to="https://external.com">External Link</NormalizedLink>
    );
    
    const link = container.querySelector('a');
    expect(link).toHaveTextContent('External Link');
    expect(link).toHaveAttribute('href', 'https://external.com');
  });

  test('renders special links as anchor tags', () => {
    const { container: mailtoContainer } = renderWithRouter(
      <NormalizedLink to="mailto:test@example.com">Email Link</NormalizedLink>
    );
    
    const { container: telContainer } = renderWithRouter(
      <NormalizedLink to="tel:+1234567890">Phone Link</NormalizedLink>
    );
    
    const { container: hashContainer } = renderWithRouter(
      <NormalizedLink to="#section">Hash Link</NormalizedLink>
    );
    
    expect(mailtoContainer.querySelector('a')).toHaveAttribute('href', 'mailto:test@example.com');
    expect(telContainer.querySelector('a')).toHaveAttribute('href', 'tel:+1234567890');
    expect(hashContainer.querySelector('a')).toHaveAttribute('href', '#section');
  });

  test('handles href prop as well as to prop', () => {
    const { container } = renderWithRouter(
      <NormalizedLink href="/about">About Link</NormalizedLink>
    );
    
    const link = container.querySelector('a');
    expect(link).toHaveTextContent('About Link');
    expect(link).toHaveAttribute('href', '/about');
  });

  test('handles missing href/to prop gracefully', () => {
    const { container } = renderWithRouter(
      <NormalizedLink>Empty Link</NormalizedLink>
    );
    
    const link = container.querySelector('a');
    expect(link).toHaveTextContent('Empty Link');
    expect(link).not.toHaveAttribute('href');
  });

  test('passes through additional props', () => {
    const { container } = renderWithRouter(
      <NormalizedLink to="/blog" className="custom-class" aria-label="Blog navigation">
        Blog Link
      </NormalizedLink>
    );
    
    const link = container.querySelector('a');
    expect(link).toHaveClass('custom-class');
    expect(link).toHaveAttribute('aria-label', 'Blog navigation');
  });

  test('normalizes internal trueallyguide.com URLs', () => {
    const { container } = renderWithRouter(
      <NormalizedLink to="https://trueallyguide.com/blog/">Internal URL</NormalizedLink>
    );
    
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/blog');
  });
});

// Snapshot test for blog post content with internal links
describe('NormalizedLink Snapshot Test', () => {
  test('renders blog post content with normalized internal links', () => {
    // Simulate a blog post component with various types of links
    const BlogPostContent = () => (
      <div>
        <h1>Sample Blog Post</h1>
        <p>
          Check out our <NormalizedLink to="/Blog/">blog</NormalizedLink> for more articles.
        </p>
        <p>
          You might also like our article on{' '}
          <NormalizedLink to="/category/Self-Development/">self-development</NormalizedLink>.
        </p>
        <p>
          Read about <NormalizedLink to="https://trueallyguide.com/blog/introvert-tips/">introvert tips</NormalizedLink>.
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
      </div>
    );

    const { container } = renderWithRouter(<BlogPostContent />);
    
    // Get all links and their normalized hrefs
    const links = container.querySelectorAll('a');
    const linkData = Array.from(links).map(link => ({
      text: link.textContent,
      href: link.getAttribute('href'),
      isRouterLink: !link.getAttribute('href').startsWith('http') && 
                    !link.getAttribute('href').startsWith('mailto:') && 
                    !link.getAttribute('href').startsWith('#')
    }));

    // Create snapshot of normalized links
    expect(linkData).toMatchSnapshot('normalized-internal-links');
    
    // Verify that internal links are normalized
    const internalLinks = linkData.filter(link => link.isRouterLink);
    expect(internalLinks).toEqual([
      { text: 'blog', href: '/blog', isRouterLink: true },
      { text: 'self-development', href: '/category/self-development', isRouterLink: true },
      { text: 'introvert tips', href: '/blog/introvert-tips', isRouterLink: true },
      { text: 'homepage', href: '/', isRouterLink: true }
    ]);

    // Verify external and special links are preserved
    const externalLinks = linkData.filter(link => !link.isRouterLink);
    expect(externalLinks).toEqual([
      { text: 'contact us', href: 'mailto:contact@trueallyguide.com', isRouterLink: false },
      { text: 'Example', href: 'https://example.com', isRouterLink: false },
      { text: 'section', href: '#section', isRouterLink: false }
    ]);
  });
});