import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ModernTOC from './ModernTOC';

export default function TableOfContents({
  anchorSelector = '#toc-anchor',
}) {
  const createdMountRef = useRef(null);
  const [mountEl, setMountEl] = useState(null);
  const [ready, setReady] = useState(false);

  // Render nothing until the anchor is confirmed ready
  useEffect(() => {
    const anchor = document.querySelector(anchorSelector);
    if (!anchor) return;

    const check = () => {
      const heroAfter = anchor.previousElementSibling?.matches('figure.post-hero');
      const isReady = !!heroAfter && anchor.getAttribute('data-toc-ready') === '1';
      if (isReady) setReady(true);
      return isReady;
    };
    if (check()) return;

    const mo = new MutationObserver(check);
    mo.observe(document.body, { childList: true, subtree: true, attributes: true });
    return () => mo.disconnect();
  }, [anchorSelector]);

  // When ready, mount inside the anchor only
  useEffect(() => {
    if (!ready) return;
    const anchor = document.querySelector(anchorSelector);
    if (!anchor) return;
    // reserve height to avoid CLS and ensure normal flow
    anchor.style.minHeight = '120px';
    anchor.style.display = 'block';
    anchor.style.clear = 'both';
    anchor.style.position = 'relative';
    // Hard safety: never let TOC sit inside any figure
    if (anchor.closest('figure')) {
      const fig = anchor.closest('figure');
      fig.insertAdjacentElement('afterend', anchor);
    }
    setMountEl(anchor);
  }, [ready, anchorSelector]);

  useEffect(() => {
    if (!mountEl) return;
    mountEl.innerHTML = '';
    const holder = document.createElement('div');
    mountEl.appendChild(holder);
    const root = createRoot(holder);
    const content = (
      <aside className="qs-toc lg:sticky lg:top-24">
        <ModernTOC />
      </aside>
    );
    root.render(content);
    return () => {
      try { root.unmount(); } catch {}
    };
  }, [mountEl]);

  if (!ready) return null;
  return null;
}
