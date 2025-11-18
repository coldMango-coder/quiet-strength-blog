import React, { Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import useHeroImageDeduper from '../hooks/useHeroImageDeduper';
import { useParams } from 'react-router-dom';
import { sortedBlogPosts } from '../blogData';
import Seo from '../components/Seo';
import ModernTOC from '../components/ModernTOC';
import NotFoundPage from './NotFoundPage';
import sanitizeArticleStart from '../lib/sanitizeArticleStart';

// Helper utils
const isCaption = (el) =>
  !!el && (el.matches?.('figcaption, .wp-caption-text, .caption') || (el.tagName && el.tagName.toLowerCase() === 'figcaption'));

const fileKey = (s) => ((((s || '') + '').split('#')[0] || '').split('?')[0].split('/').pop() || '').toLowerCase();

function removeWrapperCompletely(node) {
  if (!node) return;
  node.querySelector?.('figcaption, .wp-caption-text, .caption')?.remove();
  const next = node.nextElementSibling, prev = node.previousElementSibling;
  if (isCaption(next)) next.remove();
  if (isCaption(prev)) prev.remove();
  node.remove();
}
const BlogPostPage = () => {
  const { slug } = useParams();
  const post = sortedBlogPosts.find((p) => p.slug === slug);
  // MUST be declared before any hook that lists it in deps
  const bodyHtml = post?.html || '';
  const heroImageSrc = post?.image || post?.hero || '';
  const heroRef = useRef(null);
  const postBodyRef = useRef(null);
  const proseRef = useRef(null);

  // Sanitize odd leading characters at article start without blocking paint
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        // @ts-ignore requestIdleCallback type
        const id = window.requestIdleCallback(() => sanitizeArticleStart('article'), { timeout: 1200 });
        return () => window.cancelIdleCallback && window.cancelIdleCallback(id);
      } else {
        const t = setTimeout(() => sanitizeArticleStart('article'), 0);
        return () => clearTimeout(t);
      }
    }
  }, []);

  const fallbackCaption =
    'Confident woman learning how to stop attracting narcissists by walking away from toxic relationships toward healthy boundaries and self-empowerment';

  // Keep your hero exactly as-is (inside #intro-media)
  const Hero = (
    <figure className="lead-figure post-hero" id="post-hero">
      <img
        src={heroImageSrc || ''}
        alt={post?.title || ''}
        width={1200}
        height={630}
        loading="eager"
        decoding="async"
        fetchpriority="high"
        data-hero="1"
        className="w-full h-auto object-cover rounded-lg"
      />
      <figcaption className="image-caption">{post?.imageCaption || fallbackCaption}</figcaption>
    </figure>
  );

  // Keep the intro-media block directly after the header if anything injected nodes
  useLayoutEffect(() => {
    const intro = document.getElementById('intro-media');
    if (!intro) return;

    let mo;

    const place = () => {
      try {
        const article =
          document.querySelector('article.single, article.post, article') ||
          document.querySelector('.single-post, .post');
        const header = article?.querySelector('.post-header, header');
        if (!article || !header) return false;
        if (header.nextElementSibling !== intro) {
          header.insertAdjacentElement('afterend', intro);
        }
        intro.removeAttribute('data-pending');
        if (mo) mo.disconnect();
        return true;
      } catch {
        return false;
      }
    };

    if (place()) return;

    mo = new MutationObserver(place);
    mo.observe(document.body, { childList: true, subtree: true, attributes: true });
    const t = setTimeout(place, 1200);

    return () => {
      try { if (mo) mo.disconnect(); } catch (e) {}
      clearTimeout(t);
    };
  }, []);

  // (Inline deduper removed; using shared hook for all posts)
  /* useLayoutEffect(() => {
    const fileKey = (s) => ((((s || '') + '').split('#')[0] || '').split('?')[0].split('/').pop() || '').toLowerCase();

    const isCaption = (el) =>
      !!el && (el.matches?.('figcaption, .wp-caption-text, .caption') || (el.tagName && el.tagName.toLowerCase() === 'figcaption'));

    const removeWrapperCompletely = (node) => {
      if (!node) return;
      node.querySelector?.('figcaption, .wp-caption-text, .caption')?.remove();
      const next = node.nextElementSibling, prev = node.previousElementSibling;
      if (isCaption(next)) next.remove();
      if (isCaption(prev)) prev.remove();
      node.remove();
    };

    const root = document.querySelector('.post-body');
    const heroFig = document.getElementById('post-hero');
    const intro = document.getElementById('intro-media');
    if (!root || !heroFig) return;

    const heroImg = heroFig.querySelector('img');
    const heroKey = fileKey(
      (heroImg?.getAttribute && heroImg.getAttribute('src')) ||
        heroImg?.currentSrc ||
        heroImg?.src ||
        post?.image ||
        post?.hero ||
        ''
    );
    if (!heroKey) return;

    // 1) Hard-remove any known duplicate hero wrapper shapes in BODY (class order doesn't matter)
    const WRAPPER_SHAPES = [
      '.relative.overflow-hidden.rounded-lg.shadow-md.my-8.w-full',
      '.block.overflow-hidden.rounded-lg.shadow-md.my-8.w-full',
      'figure.relative.overflow-hidden.rounded-lg.shadow-md.my-8.w-full',
      'figure.block.overflow-hidden.rounded-lg.shadow-md.my-8.w-full',
    ];
    root.querySelectorAll(WRAPPER_SHAPES.join(',')).forEach(removeWrapperCompletely);

    // 2) Filename pass â€” remove the FIRST body block whose img filename matches the hero
    const blocks = Array.from(
      root.querySelectorAll(
        'figure, .wp-block-image, .wp-caption, .image, .figure, ' +
          '.relative.overflow-hidden.rounded-lg.shadow-md.my-8.w-full, ' +
          '.block.overflow-hidden.rounded-lg.shadow-md.my-8.w-full, ' +
          'p, div'
      )
    );

    for (const block of blocks) {
      if (!block || heroFig.contains(block)) continue; // never touch the hero
      const img = block.querySelector && block.querySelector('img');
      if (!img) continue;
      const key = fileKey(img.getAttribute('src') || img.currentSrc || img.src);
      if (key === heroKey) {
        removeWrapperCompletely(block); // remove wrapper + captions
        break; // only the first body duplicate
      }
    }

    // remove paint guard after cleanup
    document.getElementById('dup-guard')?.remove();
  }, [slug, post?.image, post?.hero]); */

  // Resolve and cache the actual .prose container if present
  useEffect(() => {
    const body = postBodyRef.current || null;
    proseRef.current = body ? (body.querySelector('.prose') || body) : null;
  }, [slug]);

  // Helpers for deduplication
  const normalizeSrc = (u) => {
    try {
      if (!u) return '';
      const a = document.createElement('a');
      a.href = u;
      const path = (a.pathname || '').toLowerCase();
      const last = path.split('/').filter(Boolean).pop() || '';
      return decodeURIComponent(last);
    } catch {
      return '';
    }
  };

  const collectUrlsFromPicture = (rootEl) => {
    const urls = new Set();
    if (!rootEl) return urls;
    const img = rootEl.tagName === 'IMG' ? rootEl : rootEl.querySelector('img');
    if (img) {
      const s = img.getAttribute && img.getAttribute('src');
      if (s) urls.add(s);
      if (img.currentSrc) urls.add(img.currentSrc);
    }
    rootEl.querySelectorAll('source[srcset]').forEach((s) => {
      const ss = s.getAttribute('srcset') || '';
      ss.split(',').map((x) => (x || '').trim().split(' ')[0]).forEach((url) => {
        if (url) urls.add(url);
      });
    });
    return urls;
  };

  // Build HTML (render as-is); runtime cleanup handled by shared hook

  // Runtime dedupe hook — pass refs so it runs after DOM refs resolve
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

      <article className="single">
        {/* Intro media block (hero + caption + TOC) */}
        <section id="intro-media" className="intro-media" data-pending="1" ref={heroRef}>
          {Hero}
          <aside id="toc" className="qs-toc-container">
            <ModernTOC rootSelector=".post-body" />
          </aside>
        </section>

        {/* Paint-guard (prevents flash): class-token duplicate wrapper + caption (BODY only) */}
        <style id="dup-guard">{`
          /* Paint-guard: hide common duplicate hero blocks inside body until JS cleanup runs */
          .post-body :is(figure,div,picture).overflow-hidden.rounded-lg.shadow-md.my-8.w-full { display: none !important; }
          .post-body :is(figure,div,picture).overflow-hidden.rounded-lg.shadow-md.my-8.w-full + figcaption { display: none !important; }
          .post-body :is(figure,div,picture).overflow-hidden.rounded-lg.shadow-md.my-8.w-full + p.italic.text-center { display: none !important; }
          /* Variant without my-8 spacing but same hero container shape */
          .post-body :is(figure,div,picture).relative.overflow-hidden.rounded-lg.shadow-md.w-full { display: none !important; }
          .post-body :is(figure,div,picture).relative.overflow-hidden.rounded-lg.shadow-md.w-full + figcaption { display: none !important; }
          .post-body :is(figure,div,picture).relative.overflow-hidden.rounded-lg.shadow-md.w-full + p.italic.text-center { display: none !important; }
          /* Some posts render <picture> without overflow-hidden but with the same hero styling */
          .post-body picture.rounded-lg.shadow-md.my-8.w-full { display: none !important; }
          .post-body picture.rounded-lg.shadow-md.my-8.w-full + figcaption { display: none !important; }
          .post-body picture.rounded-lg.shadow-md.my-8.w-full + p.italic.text-center { display: none !important; }
          /* Some posts render a bare <img> with hero classes (no wrapper) */
          .post-body img.rounded-lg.shadow-md.my-8.w-full { display: none !important; }
          .post-body img.rounded-lg.shadow-md.my-8.w-full + figcaption { display: none !important; }
          .post-body img.rounded-lg.shadow-md.my-8.w-full + p.italic.text-center { display: none !important; }
        `}</style>

        {/* Render raw HTML body when provided */}
        {bodyHtml ? (
          <div className="post-body" ref={postBodyRef} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        ) : null}

        {/* Render component body when HTML not provided */}
        {!bodyHtml && post?.component ? (
          <Suspense
            fallback={
              <div className="flex justify-center items-center py-24">
                <div className="text-brand-primary animate-pulse">Loading article...</div>
              </div>
            }
          >
            <div className="post-body" ref={postBodyRef}>
              <post.component />
            </div>
          </Suspense>
        ) : null}
      </article>
    </>
  );
};

export default BlogPostPage;


