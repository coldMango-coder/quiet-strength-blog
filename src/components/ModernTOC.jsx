import React, { useEffect, useState } from 'react';

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

export default function ModernTOC({ rootSelector = '.post-body', collapsibleMobile = false }) {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isOpen, setIsOpen] = useState(!collapsibleMobile);

  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return;

    const headers = Array.from(root.querySelectorAll('h2, h3'));
    const list = headers.map((h) => {
      if (!h.id) h.id = h.innerText.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      return {
        id: h.id,
        text: h.innerText,
        level: h.tagName === 'H2' ? 1 : 2,
      };
    });
    setItems(list);

    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setActiveId(vis.target.id);
      },
      { rootMargin: '0px 0px -70% 0px', threshold: [0, 0.15, 1] }
    );
    headers.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, [rootSelector]);

  if (items.length === 0) return null;

  return (
    <nav className={`toc-nav text-sm ${collapsibleMobile ? 'lg:block' : ''}`}>
      {collapsibleMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4 font-semibold text-brand-dark"
        >
          <span>Table of Contents</span>
          <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      <div className={`${collapsibleMobile && !isOpen ? 'hidden lg:block' : 'block'}`}>
        <ul className="space-y-3 border-l-2 border-gray-100 pl-4">
          {groupByHierarchy(items).map((h2, i) => {
            const isActive = activeId === h2.id;
            return (
              <li key={h2.id || i}>
                <a
                  href={`#${encodeURIComponent(h2.id)}`}
                  className={`block transition-colors duration-200 ${isActive ? 'text-brand-primary font-bold -ml-[18px] border-l-2 border-brand-primary pl-4' : 'text-gray-500 hover:text-brand-dark'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(h2.id)?.scrollIntoView({ behavior: 'smooth' });
                    if (collapsibleMobile) setIsOpen(false);
                  }}
                >
                  {h2.text}
                </a>
                {h2.children?.length > 0 && (
                  <ul className="mt-2 ml-1 space-y-2 pl-3 border-l border-gray-100">
                    {h2.children.map((h3, j) => {
                      const isSubActive = activeId === h3.id;
                      return (
                        <li key={(h3.id || j) + '-sub'}>
                          <a
                            href={`#${encodeURIComponent(h3.id)}`}
                            className={`block transition-colors duration-200 ${isSubActive ? 'text-brand-primary font-medium' : 'text-gray-400 hover:text-brand-dark'}`}
                            onClick={(e) => {
                              e.preventDefault();
                              document.getElementById(h3.id)?.scrollIntoView({ behavior: 'smooth' });
                              if (collapsibleMobile) setIsOpen(false);
                            }}
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
      </div>
    </nav>
  );
}
