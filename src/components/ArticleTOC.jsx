import React, { useEffect, useMemo, useState } from 'react';

// Premium Table of Contents component
// Props:
// - items: Array<{ id: string; text: string; level?: 1|2|3 }>
// - title?: string (default "Table of Contents")
// - accent?: 'orange'|'blue' (default 'orange')
export default function ArticleTOC({ items = [], title = 'Table of Contents', accent = 'orange', activeId = null }) {
  const [open, setOpen] = useState(false); // collapsed by default on mobile

  // Normalize items to ensure level is 2 or 3 (default to 2)
  const flatItems = useMemo(() => {
    return items.map((it) => ({ id: it.id, text: it.text, level: it.level ?? 2 }));
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
  const accentBase = accent === 'blue' ? 'text-blue-600 hover:text-blue-700 border-blue-600' : 'text-orange-600 hover:text-orange-700 border-orange-600';

  return (
    <aside aria-label={title} className="w-full">
      {/* Mobile toggle */}
      <div className="md:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="toc-panel"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 bg-white text-slate-800 text-base font-semibold shadow-sm hover:bg-slate-50 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <svg className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
          </svg>
          <span>{title}</span>
        </button>
        <div id="toc-panel" className={`overflow-hidden transition-[max-height] duration-300 ease-in-out`} style={{ maxHeight: open ? '1200px' : '0px' }}>
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 shadow-sm">
            <TOCList items={flatItems} current={current} accentBase={accentBase} />
          </div>
        </div>
      </div>

      {/* Desktop sticky card */}
      <div className="hidden md:block md:sticky" style={{ top: '96px', maxHeight: '70vh' }}>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 shadow-sm overflow-y-auto">
          <h2 className="text-slate-800 font-semibold mb-3 text-sm">{title}</h2>
          <TOCList items={flatItems} current={current} accentBase={accentBase} />
        </div>
      </div>
    </aside>
  );
}

function TOCList({ items, current, accentBase }) {
  return (
    <nav aria-label="Table of contents" data-toc>
      <ol className="pl-5 list-decimal space-y-1">
        {items.map((it) => (
          <li key={it.id} className={it.level === 3 ? 'ml-4' : ''}>
            <a
              href={`#${it.id}`}
              className={`${current === it.id ? accentBase.split(' ')[0] : 'text-slate-700'} hover:underline`}
              aria-current={current === it.id ? 'true' : undefined}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

