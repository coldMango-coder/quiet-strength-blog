// Hard ToC isolation: render outside .prose and isolate styles to prevent bleed/overlap.
import React, { useEffect, useMemo, useState } from 'react';

// Premium Table of Contents component
// Props:
// - items: Array<{ id: string; text: string; level?: 1|2|3 }>
// - title?: string (default "Table of Contents")
// - accent?: 'orange'|'blue' (default 'orange')
// Isolated ToC; avoids .prose and global list/anchor overrides.
export default function ArticleTOC({ items = [], title = 'Table of Contents', accent = 'orange', activeId = null }) {
  const [open, setOpen] = useState(false); // collapsed by default on mobile

  // Normalize items and ensure level defaults to 1 (H1)
  const flatItems = useMemo(() => {
    return items.map((it) => ({ id: it.id, text: it.text, level: it.level ?? 1 }));
  }, [items]);

  // Lightweight intersection observer (optional redundancy if parent does not provide activeId)
  const [localActive, setLocalActive] = useState(null);
  useEffect(() => {
    if (activeId || typeof window === 'undefined') return;
    const start = () => {
      const obs = new IntersectionObserver(
        (entries) => {
          const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (vis) setLocalActive(vis.target.id);
        },
        { rootMargin: '0px 0px -70% 0px', threshold: [0, 0.15, 1] }
      );
      document.querySelectorAll('article h2, article h3').forEach((el) => obs.observe(el));
      return () => obs.disconnect();
    };
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 1200 });
      return () => window.cancelIdleCallback && window.cancelIdleCallback(id);
    }
    return start();
  }, [activeId]);

  const current = activeId || localActive;
  const accentBase = accent === 'blue'
    ? 'text-blue-700 border-blue-600'
    : 'text-orange-700 border-orange-600';

  return (
    <aside
      aria-label={title}
      className="qs-toc not-prose relative isolate z-20 clear-both overflow-hidden w-full rounded-xl bg-white shadow-sm ring-1 ring-neutral-200 sm:sticky sm:top-24 sm:max-h-[70vh] sm:overflow-y-auto"
    >
      {/* Mobile toggle */}
      <div className="md:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="toc-panel"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 m-4 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-semibold shadow-sm hover:bg-slate-50 focus:outline-none focus-visible:ring"
        >
          {open ? 'Hide' : 'Show'}
          <svg className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
          </svg>
          <span className="sr-only">{title}</span>
        </button>
        <div id="toc-panel" className={`${open ? 'block' : 'hidden'}`}>
          <TOCList items={flatItems} current={current} accentBase={accentBase} />
        </div>
      </div>

      {/* Desktop sticky card */}
      <div className="hidden sm:block">
        <div className="p-4 text-sm leading-6">
          <h2 className="text-slate-800 font-semibold mb-3 text-base">{title}</h2>
          <TOCList items={flatItems} current={current} accentBase={accentBase} />
        </div>
      </div>
    </aside>
  );
}

function TOCList({ items, current, accentBase }) {
  return (
    <nav aria-label="Table of contents" data-toc>
      <ol className="list-decimal pl-6 pr-4 pb-4 space-y-2">
        {items.map((it) => {
          const level = it.level ?? 1;
          const pad = level === 1 ? 'pl-3 border-l-2' : level === 2 ? 'pl-5 border-l' : 'pl-7 border-l';
          const isActive = current === it.id;
          const linkColor = isActive ? `${accentBase} font-semibold` : accentBase;
          return (
            <li key={it.id}>
              <a
                href={`#${encodeURIComponent(it.id)}`}
                aria-current={isActive ? 'true' : undefined}
                className={[
                  'block whitespace-normal break-words break-normal hyphens-none leading-snug hover:underline focus:outline-none focus-visible:ring',
                  pad,
                  linkColor,
                ].join(' ')}
              >
                {it.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
