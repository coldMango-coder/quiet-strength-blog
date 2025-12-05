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

    const legacySelectors = ['.author-bio', '.about-author', '.post-author', '.author-box'];
    legacySelectors.forEach(selector => {
      const els = postBodyRef.current.querySelectorAll(selector);
      els.forEach(el => el.remove());
    });

    const headings = Array.from(postBodyRef.current.querySelectorAll('h3, h4, h5'));
    const lastAboutHeading = headings.reverse().find(h =>
      h.innerText.includes('About Marica') || h.innerText.includes('About the Author')
    );

    if (lastAboutHeading) {
      let current = lastAboutHeading.nextElementSibling;
      lastAboutHeading.remove();
      while (current) {
        const next = current.nextElementSibling;
        if (['H2', 'H3', 'H4', 'H5'].includes(current.tagName)) break;
        current.remove();
        current = next;
      }
    }
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

      <article className="single pb-20 md:pb-32 bg-white">
        <div className="container-wide">
          {/* Main Content Column - Strictly enforced 750px max width */}
          <div className="max-w-[750px] mx-auto pt-10 md:pt-16">
            {/* Consolidated Header Block */}
            <header className="text-center mb-8 md:mb-10">
              <div className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-brand-primary uppercase tracking-widest mb-4">
                <span className="bg-brand-secondary/10 px-3 py-1 rounded-full">{post.category || 'Blog Article'}</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-emphasis mb-6 leading-tight tracking-tight">
                {post.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-gray-600 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-brand-dark">Marica Sinko</span>
                </div>
                <span className="hidden md:inline w-1 h-1 rounded-full bg-gray-300"></span>
                <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
                <span className="hidden md:inline w-1 h-1 rounded-full bg-gray-300"></span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {post.readTime}
                </span>
              </div>
            </header>

            {/* Hero Image - Tightly coupled with header */}
            <figure className="mb-4 rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5" ref={heroRef} id="post-hero">
              <OptimizedImage
                src={post.image}
                alt={post.title}
                className="w-full h-auto object-cover max-h-[600px]"
                width={1200}
                height={675}
                priority={true}
                sizes="(max-width: 768px) 100vw, 750px"
              />
              {post.imageCaption && (
                <figcaption className="mt-2 text-center text-gray-400 text-[9px] italic">
                  {post.imageCaption}
                </figcaption>
              )}
            </figure>

            {/* Modern Table of Contents - Prominent & Tightly Spaced */}
            <ModernTOC rootSelector=".post-body" />

            {/* Article Body - Optimized Typography */}
            <div className="prose prose-lg prose-slate max-w-none post-body prose-headings:font-bold prose-headings:tracking-tight prose-a:text-brand-primary prose-img:rounded-xl prose-img:shadow-md" ref={postBodyRef}>
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

            {/* Author Bio */}
            <div className="mt-16 pt-10 border-t border-gray-100">
              <AuthorBio />
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPostPage;
