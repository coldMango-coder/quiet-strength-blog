import React, { Suspense, useEffect, useRef } from 'react';
import useHeroImageDeduper from '../hooks/useHeroImageDeduper';
import { useParams } from 'react-router-dom';
import { sortedBlogPosts } from '../blogData';
import Seo from '../components/Seo';
import ModernTOC from '../components/ModernTOC';
import NotFoundPage from './NotFoundPage';
import sanitizeArticleStart from '../lib/sanitizeArticleStart';
import OptimizedImage from '../components/OptimizedImage';
import AuthorBio from '../components/AuthorBio';

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = sortedBlogPosts.find((p) => p.slug === slug);
  const bodyHtml = post?.html || '';
  const heroRef = useRef(null);
  const postBodyRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        const id = window.requestIdleCallback(() => sanitizeArticleStart('article'), { timeout: 1200 });
        return () => window.cancelIdleCallback && window.cancelIdleCallback(id);
      } else {
        const t = setTimeout(() => sanitizeArticleStart('article'), 0);
        return () => clearTimeout(t);
      }
    }
  }, []);

  // Remove legacy author bio from content
  useEffect(() => {
    if (!postBodyRef.current) return;

    // Attempt to find and remove legacy author sections
    // Strategy 1: Look for specific classes
    const legacySelectors = ['.author-bio', '.about-author', '.post-author', '.author-box'];
    legacySelectors.forEach(selector => {
      const els = postBodyRef.current.querySelectorAll(selector);
      els.forEach(el => el.remove());
    });

    // Strategy 2: Look for the specific "About Marica Sinko" heading at the end
    // This is a heuristic: if the last few elements contain "About", remove them.
    const headings = Array.from(postBodyRef.current.querySelectorAll('h3, h4, h5'));
    headings.forEach(h => {
      if (h.innerText.includes('About Marica') || h.innerText.includes('About the Author')) {
        // Remove the heading and potentially the following sibling (the bio text/image)
        let next = h.nextElementSibling;
        h.remove();
        // Remove up to 3 siblings if they look like bio content (p, div, figure)
        let count = 0;
        while (next && count < 3) {
          const toRemove = next;
          next = next.nextElementSibling;
          toRemove.remove();
          count++;
        }
      }
    });

    // Strategy 3: Remove any image at the very end if it looks like an author photo (small, centered)
    // This is risky, so we'll be conservative.
  }, [slug, bodyHtml]);

  useHeroImageDeduper(heroRef, postBodyRef, post?.slug || slug);

  if (!post) return <NotFoundPage />;

  return (
    <>
      <Seo
        title={post.title}
        description={post.description}
        type="article"
        article={{
          title: post.title,
          authorName: 'Marica Sinko',
          datePublished: `${post.date}T00:00:00+00:00`,
          image: post.image,
        }}
      />

      <article className="single pb-24">
        {/* Header Section */}
        <header className="bg-brand-secondary/30 pt-12 pb-12 lg:pt-20 lg:pb-16 mb-8">
          <div className="container-wide max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary uppercase tracking-widest mb-6">
              <span>{post.category || 'Blog Article'}</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-emphasis mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-center gap-4 text-gray-600 text-sm md:text-base">
              <span className="font-medium text-brand-dark">Marica Sinko</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span>{post.readTime} read</span>
            </div>
          </div>
        </header>

        <div className="container-wide">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Sidebar / TOC */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-32">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Table of Contents</div>
                <ModernTOC rootSelector=".post-body" />
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-8 lg:col-start-4">
              {/* Hero Image - Moved below header, before content */}
              <figure className="mb-12 rounded-2xl overflow-hidden shadow-lg" ref={heroRef} id="post-hero">
                <OptimizedImage
                  src={post.image}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                  width={1000}
                  height={600}
                  priority={true}
                />
                {post.imageCaption && (
                  <figcaption className="image-caption mt-4 text-center text-gray-500 text-sm italic">
                    {post.imageCaption}
                  </figcaption>
                )}
              </figure>

              {/* Mobile TOC */}
              <div className="lg:hidden mb-12">
                <ModernTOC rootSelector=".post-body" collapsibleMobile={true} />
              </div>

              {/* Article Body */}
              <div className="prose prose-lg prose-slate max-w-3xl mx-auto post-body" ref={postBodyRef}>
                {bodyHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
                ) : (
                  post.component && (
                    <Suspense fallback={<div className="py-12 text-center">Loading...</div>}>
                      <post.component />
                    </Suspense>
                  )
                )}
              </div>

              {/* Author Bio - The ONE and ONLY bio (legacy ones removed by JS above) */}
              <div className="mt-16 pt-12 border-t border-gray-100">
                <AuthorBio />
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPostPage;
