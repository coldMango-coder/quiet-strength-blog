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

export default function ArticleTOC({ items = [], title = 'Table of Contents', activeId = null }) {
  const [open, setOpen] = useState(false); // Default closed on mobile

  // Normalize items
  const flatItems = useMemo(() => {
    return items.map((it) => ({ id: it.id, text: it.text, level: it.level ?? 1 }));
  }, [items]);

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

  return (
    <nav className="toc-nav text-sm">
      <ul className="space-y-3 border-l-2 border-gray-100 pl-4">
        {groupByHierarchy(flatItems).map((h2, i) => {
          const isActive = current === h2.id;
          return (
            <li key={h2.id || i}>
              <a
                href={`#${encodeURIComponent(h2.id)}`}
                className={`block transition-colors duration-200 ${isActive ? 'text-brand-primary font-bold -ml-[18px] border-l-2 border-brand-primary pl-4' : 'text-gray-500 hover:text-brand-dark'}`}
              >
                {h2.text}
              </a>
              {h2.children?.length > 0 && (
                <ul className="mt-2 ml-1 space-y-2 pl-3 border-l border-gray-100">
                  {h2.children.map((h3, j) => {
                    const isSubActive = current === h3.id;
                    return (
                      <li key={(h3.id || j) + '-sub'}>
                        <a
                          href={`#${encodeURIComponent(h3.id)}`}
                          className={`block transition-colors duration-200 ${isSubActive ? 'text-brand-primary font-medium' : 'text-gray-400 hover:text-brand-dark'}`}
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
      </ul>
    </nav>
  );
}
