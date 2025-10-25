import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import TocToggle from './TocToggle';
import ArticleTOC from './ArticleTOC';

const slugify = (str) =>
  str.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');

export default function TableOfContents({
  rootSelector = 'article',
  anchorSelector = null,
  maxDepth = 3,
}) {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [mountEl, setMountEl] = useState(null);
  const createdMountRef = useRef(null);

  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return;

    // Remove any manually coded TOC blocks to avoid duplicates
    try {
      const manualTocBlocks = root.querySelectorAll('h3, h2');
      manualTocBlocks.forEach((h) => {
        const t = (h.textContent || '').trim().toLowerCase();
        if (t === 'table of contents') {
          const parentSection = h.closest('section') || h.parentElement;
          if (parentSection) parentSection.remove();
        }
      });
      root.querySelectorAll('.toc-list').forEach((el) => el.closest('section')?.remove?.());
    } catch {}

    // Ignore headings inside the TOC and literal 'Table of Contents'
    const selector = maxDepth >= 3 ? 'h2, h3' : 'h2';
    const headings = [...root.querySelectorAll(selector)].filter((h) => {
      if (h.closest('[data-toc]')) return false;
      const t = (h.textContent || '').trim().toLowerCase();
      return t !== 'table of contents';
    });

    const nodes = headings.map((h) => {
      if (!h.id) h.id = slugify(h.textContent || '');
      return { id: h.id, text: h.textContent, level: h.tagName === 'H2' ? 2 : 3 };
    });

    const out = [];
    let current = null;
    nodes.forEach((n) => {
      if (n.level === 2) {
        current = { ...n, children: [] };
        out.push(current);
      } else if (n.level === 3 && current) {
        current.children.push(n);
      }
    });

    setItems(out);
  }, [rootSelector, maxDepth]);

  // Idle scroll-spy to protect LCP
  useEffect(() => {
    const start = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          const vis = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (vis) setActiveId(vis.target.id);
        },
        { rootMargin: '0px 0px -70% 0px', threshold: [0, 0.2, 1] }
      );
      document.querySelectorAll('article h2, article h3').forEach((el) =>
        observer.observe(el)
      );
      return () => observer.disconnect();
    };
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback && window.cancelIdleCallback(id);
    }
    return start();
  }, []);

  // Find or create a mount point inside the article after header/hero
  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return;

    // If explicit anchor provided, use it
    let anchor = anchorSelector ? document.querySelector(anchorSelector) : null;

    if (!anchor) {
      // Try to place after <header> inside article or after first figure/img
      const articleHeader = root.querySelector('header');
      const container = document.createElement('div');
      container.setAttribute('data-toc-mount', '');
      container.style.minHeight = '120px';
      container.className = 'mb-10';
      if (articleHeader && articleHeader.parentElement === root) {
        // Insert after header
        articleHeader.insertAdjacentElement('afterend', container);
      } else {
        const heroImg = root.querySelector('figure, img');
        if (heroImg) {
          heroImg.insertAdjacentElement('afterend', container);
        } else {
          // Fallback: prepend to article
          root.insertBefore(container, root.firstChild);
        }
      }
      createdMountRef.current = container;
      setMountEl(container);
    } else {
      // Use provided anchor
      anchor.style.minHeight = '120px';
      setMountEl(anchor);
    }

    return () => {
      // Do not remove created mount to avoid flicker on navigation; keep for SPA transitions
    };
  }, [rootSelector, anchorSelector]);

  // Ensure anchor reserves space to avoid CLS
  useEffect(() => {
    if (!anchorSelector) return;
    const mount = document.querySelector(anchorSelector);
    if (mount) mount.style.minHeight = '120px';
  }, [anchorSelector]);

  // Flatten items to the ArticleTOC format
  const flatItems = React.useMemo(() => {
    const out = [];
    items.forEach((h2) => {
      out.push({ id: h2.id, text: h2.text, level: 2 });
      (h2.children || []).forEach((h3) => out.push({ id: h3.id, text: h3.text, level: 3 }));
    });
    return out;
  }, [items]);

  // Wrap in a sticky container on desktop to reserve space and avoid CLS
  const content = (
    <div className="md:sticky" style={{ top: '96px', maxHeight: '70vh' }}>
      {/* Mobile collapsible via ArticleTOC; keep our toggle wrapper to preserve mount space if needed */}
      <ArticleTOC items={flatItems} title="Table of Contents" accent="orange" activeId={activeId} />
    </div>
  );

  if (mountEl) {
    return ReactDOM.createPortal(content, mountEl);
  }
  // Default render at current position (dev safety)
  return content;
}
