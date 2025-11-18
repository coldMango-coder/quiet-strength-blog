import { useLayoutEffect } from 'react';

// Normalize a URL-like string to its last pathname segment (lowercased, decoded, no query/hash)
export function normalizeSrc(u) {
  try {
    if (!u) return '';
    // Use URL for robust parsing; fallback handled by catch
    const a = new URL(u, 'https://trueallyguide.com');
    const last = (a.pathname || '').toLowerCase().split('/').filter(Boolean).pop() || '';
    return decodeURIComponent(last);
  } catch {
    return '';
  }
}

// Collect possible URLs from an <img> or <picture> element (including <source srcset>)
export function collectUrlsFromPicture(rootEl) {
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
    ss
      .split(',')
      .map((x) => (x || '').trim().split(' ')[0])
      .forEach((url) => {
        if (url) urls.add(url);
      });
  });
  return urls;
}

/**
 * Deduplicate hero-like images inside an article's prose/body container at runtime.
 * - heroEl: section#intro-media element containing the hero image (img/picture)
 * - rootEl: article body root; if it has a `.prose` inside, that will be used
 * - key: dependency to re-run on (e.g., post slug)
 * - opts: reserved for future options
 */
// Keep the public signature the same; resolve refs inside the effect
export function useHeroImageDeduper(heroEl, rootEl, key) {
  useLayoutEffect(() => {
    // Resolve refs or DOM nodes
    const resolveElement = (value) => {
      if (!value) return null;
      if (typeof value === 'object' && 'current' in value) return value.current;
      return value; // already a DOM node
    };

    // Resolve elements even if refs were passed; remain backward compatible with elements
    let heroNode = resolveElement(heroEl);
    let rootNode = resolveElement(rootEl);

    // Fallbacks if refs aren't ready or weren't passed (queries #intro-media/#post-hero and .post-body/article/document.body)
    if (!heroNode && typeof document !== 'undefined') {
      heroNode = document.getElementById('intro-media') || document.getElementById('post-hero') || null;
    }
    if (!rootNode && typeof document !== 'undefined') {
      rootNode = document.querySelector('.post-body') || document.querySelector('article') || document.body || null;
    }
    if (!heroNode || !rootNode) return;
    const prose = rootNode.querySelector('.prose') || rootNode;
    if (!prose) return;
    const runDedupe = () => {

      try {
        // Helper to detect likely caption blocks
        const looksLikeCaption = (el) => !!el && (
          (el.tagName && el.tagName.toLowerCase() === 'figcaption') ||
          (typeof el.matches === 'function' && (
            el.matches('p.text-sm.text-gray-600.text-center.italic') ||
            el.matches('p.text-sm.text-gray-600.italic.text-center') ||
            el.matches('p.text-sm.text-center.italic') ||
            el.matches('p.text-xs.text-center.italic') ||
            el.matches('p.italic.text-center') ||
            el.matches('em.caption')
          ))
        );

        // 1) STRUCTURAL CLEANUP: .prose div.my-8 with hero-like image + caption
        try {
          const blocks = prose.querySelectorAll('div.my-8');
          for (const block of blocks) {
            if (!block) continue;
            // Never touch anything inside the real hero
            if (heroNode && heroNode.contains(block)) continue;

            const heroLike = block.querySelector('picture, img');
            if (!heroLike) continue;

            const caption = block.querySelector('p');
            if (!caption || !caption.classList) continue;
            const cl = caption.classList;
            const hasAllCoreClasses =
              cl.contains('text-sm') &&
              cl.contains('text-gray-600') &&
              cl.contains('text-center') &&
              cl.contains('italic');
            if (!hasAllCoreClasses) continue;

            // This block is the duplicate hero + caption in the body
            try {
              block.remove?.();
            } catch (e) {}
          }
        } catch (e) {}

        // 2) EXISTING: heroUrls-based candidate cleanup
        const heroUrls = new Set();
        heroNode.querySelectorAll('picture, img').forEach((node) => {
          collectUrlsFromPicture(node).forEach((u) => {
            heroUrls.add(normalizeSrc(u));
          });
        });

        if (heroUrls.size === 0) return;

        const candidates = Array.from(
          prose.querySelectorAll('picture, img')
        );
        for (const node of candidates) {
          if (!node) continue;
          // Never touch nodes inside the hero itself
          if (heroNode && heroNode.contains(node)) continue;

        const urls = collectUrlsFromPicture(node);
        const isMatch = Array.from(urls).some((u) => heroUrls.has(normalizeSrc(u)));
        if (!isMatch) continue;

        // Prefer known wrappers; fall back to the node itself
        const container =
          node.closest('div.relative.overflow-hidden.rounded-lg.shadow-md.my-8.w-full') ||
          node.closest('div.overflow-hidden.rounded-lg.shadow-md.my-8') ||
          node.closest('div.relative.overflow-hidden.rounded-lg.shadow-md.w-full') ||
          node.closest('div.relative.overflow-hidden.rounded-lg.shadow-md') ||
          node.closest('div.my-8') ||
          node.closest('figure.relative.overflow-hidden.rounded-lg.shadow-md.my-8.w-full') ||
          node.closest('figure.overflow-hidden.rounded-lg.shadow-md.my-8') ||
          node.closest('picture.overflow-hidden.rounded-lg.shadow-md.my-8.w-full') ||
          node.closest('picture.rounded-lg.shadow-md.my-8.w-full') ||
          node;
          const caption = container?.nextElementSibling || null;
          const prev = container?.previousElementSibling || null;
          try { container.remove?.(); } catch (e) {}
          if (caption) {
            const tagIsFig = caption.tagName && caption.tagName.toLowerCase() === 'figcaption';
            const matchesLegacy =
              typeof caption.matches === 'function' && (
                caption.matches('p.text-sm.text-gray-600.text-center.italic') ||
                caption.matches('p.text-sm.text-gray-600.italic.text-center') ||
                caption.matches('p.text-sm.text-center.italic') ||
                caption.matches('p.text-xs.text-center.italic') ||
                caption.matches('p.italic.text-center') ||
                caption.matches('em.caption')
              );
            const cl2 = caption.classList;
            const hasCoreCaptionClasses =
              cl2 &&
              cl2.contains('text-sm') &&
              cl2.contains('text-gray-600') &&
              cl2.contains('text-center') &&
              cl2.contains('italic');
            const isCaption = tagIsFig || matchesLegacy || hasCoreCaptionClasses;
            if (isCaption) {
              try {
                caption.remove?.();
              } catch (e) {}
            }
          }
          if (prev) {
            const prevTagIsFig = prev.tagName && prev.tagName.toLowerCase() === 'figcaption';
            const prevMatchesLegacy =
              typeof prev.matches === 'function' && (
                prev.matches('p.text-sm.text-gray-600.text-center.italic') ||
                prev.matches('p.text-sm.text-gray-600.italic.text-center') ||
                prev.matches('p.text-sm.text-center.italic') ||
                prev.matches('p.text-xs.text-center.italic') ||
                prev.matches('p.italic.text-center') ||
                prev.matches('em.caption')
              );
            const clPrev = prev.classList;
            const prevHasCoreCaptionClasses =
              clPrev &&
              clPrev.contains('text-sm') &&
              clPrev.contains('text-gray-600') &&
              clPrev.contains('text-center') &&
              clPrev.contains('italic');
            const prevIsCaption = prevTagIsFig || prevMatchesLegacy || prevHasCoreCaptionClasses;
            if (prevIsCaption) {
              try {
                prev.remove?.();
              } catch (e) {}
            }
          }
        }
      } catch (e) {}
      // Remove paint-guard so legitimate inline images are visible after cleanup
      try { document.getElementById('dup-guard')?.remove(); } catch {}
    };

    // Run once immediately (hard refresh / SSR)
    runDedupe();

    // Also observe .prose so we catch first client-side navigation
    let mo = null;
    if (typeof MutationObserver !== 'undefined') {
      try {
        mo = new MutationObserver(() => {
          try { runDedupe(); } catch (e) {}
        });
        mo.observe(prose, { childList: true, subtree: true });
      } catch (e) {}
    }

    return () => {
      try {
        if (mo) mo.disconnect();
      } catch (e) {}
    };
  }, [heroEl, rootEl, key]);
}

// Support both default and named imports everywhere
export default useHeroImageDeduper;
