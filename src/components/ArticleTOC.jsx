// ArticleTOC.jsx — Mobile/Desktop parity; hard isolation; no inner scroll; dark-orange links.
// Keeps anchors/ids unchanged for SEO; avoids .prose bleed and prevents overlap with media.
import React, { useEffect, useMemo, useState } from 'react';

function groupByHierarchy(items = []) {
  const out = [];
  let cur = null;
  items.forEach((it) => {
    const lvl = it.level ?? 1; // 1 = H2, 2 = H3
    if (lvl <= 1) {
      cur = { ...it, children: [] };
      out.push(cur);
    } else if (lvl === 2) {
      (cur ? cur.children : out).push(it);
    }
  });
  return out;
}

// Premium Table of Contents component
// Props:
// - items: Array<{ id: string; text: string; level?: 1|2|3 }>
// - title?: string (default "Table of Contents")
// - accent?: 'orange'|'blue' (default 'orange')
// Isolated ToC; avoids .prose and global list/anchor overrides.
export default function ArticleTOC({ items = [], title = 'Table of Contents', accent = 'orange', activeId = null, collapsibleMobile = true }) {
  // Default: open on desktop (>=640px), collapsed on mobile
  const [open, setOpen] = useState(() => (typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches));
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches) {
      setOpen(true);
    }
  }, []);

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
  const cTxt = accent === 'blue'
    ? 'text-blue-700 hover:text-blue-800'
    : 'text-orange-700 hover:text-orange-800';
  const cActive = accent === 'blue' ? 'text-blue-800 border-blue-600' : 'text-orange-800 border-orange-600';

  return (
    <aside
      aria-label={title}
      className="qs-toc not-prose relative isolate z-30 clear-both w-full rounded-xl bg-white shadow-sm ring-1 ring-neutral-200 sm:sticky sm:top-24 mb-2"
    >
      {/* Mobile toggle */}
      <div className="flex items-center justify-between p-4">
        <h2 className="text-slate-800 font-semibold text-base">{title}</h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="toc-panel"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-1.5 text-sm font-medium text-orange-700 shadow-sm hover:bg-orange-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          {open ? 'Hide ToC' : 'Show ToC'}
          <svg className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
          </svg>
        </button>
      </div>
      <div id="toc-panel" className={open ? 'block' : 'hidden'}>
        <TOCList items={flatItems} current={current} cTxt={cTxt} cActive={cActive} />
      </div>
    </aside>
  );
}

function TOCList({ items, current, cTxt, cActive }) {
  const grouped = useMemo(() => groupByHierarchy(items), [items]);
  return (
    <nav aria-label="Table of contents" data-toc>
      <ol className="list-decimal pl-6 pr-5 pb-5 space-y-3">
        {grouped.map((h2, i) => {
          const h2Active = current === h2.id;
          return (
            <li key={h2.id || i} className="marker:font-medium">
              <a
                href={`#${encodeURIComponent(h2.id)}`}
                aria-current={h2Active ? 'true' : undefined}
                className={[
                  'block leading-snug whitespace-normal break-words hyphens-none border-l-2 pl-3 hover:underline',
                  cTxt,
                  h2Active ? `font-semibold ${cActive}` : 'border-transparent',
                ].join(' ')}
              >
                {h2.text}
              </a>
              {h2.children?.length > 0 && (
                <ul className="mt-2 ml-2 list-disc pl-5 space-y-2">
                  {h2.children.map((h3, j) => {
                    const h3Active = current === h3.id;
                    return (
                      <li key={(h3.id || j) + '-sub'}>
                        <a
                          href={`#${encodeURIComponent(h3.id)}`}
                          aria-current={h3Active ? 'true' : undefined}
                          className={[
                            'block leading-snug whitespace-normal break-words hyphens-none border-l pl-3 hover:underline',
                            cTxt,
                            h3Active ? `font-semibold ${cActive}` : 'border-transparent',
                          ].join(' ')}
                        >
                          {h3.text}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
