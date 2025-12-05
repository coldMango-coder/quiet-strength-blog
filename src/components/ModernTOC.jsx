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

export default function ModernTOC({ rootSelector = '.post-body' }) {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const updateTOC = () => {
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

      // Setup IntersectionObserver for active state
      const obs = new IntersectionObserver(
        (entries) => {
          const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (vis) setActiveId(vis.target.id);
        },
        { rootMargin: '0px 0px -70% 0px', threshold: [0, 0.15, 1] }
      );
      headers.forEach((h) => obs.observe(h));
      return () => obs.disconnect();
    };

    // Initial update
    const cleanupObserver = updateTOC();

    // Watch for DOM changes to handle late-loading content
    const rootNode = document.querySelector(rootSelector) || document.body;
    const mutationObserver = new MutationObserver(() => {
      updateTOC();
    });

    mutationObserver.observe(rootNode, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      if (cleanupObserver) cleanupObserver();
    };
  }, [rootSelector]);

  if (items.length === 0) return null;

  return (

    <nav className="mb-8 block mx-auto w-full max-w-[400px] bg-gray-50 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div
        className="flex items-center justify-between px-5 py-4 bg-gray-100 border-b border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
          Table of Contents
        </h2>
        <span className="text-sm font-medium text-gray-600 hover:text-brand-primary">
          [{isOpen ? 'hide' : 'show'}]
        </span>
      </div>

      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 bg-gray-50">
          <ul className="list-none m-0 p-0 space-y-3">
            {groupByHierarchy(items).map((h2, i) => {
              const isActive = activeId === h2.id;
              return (
                <li key={h2.id || i}>
                  <a
                    href={`#${encodeURIComponent(h2.id)}`}
                    className={`block text-base leading-snug transition-colors duration-200 ${isActive ? 'text-brand-primary font-bold' : 'text-gray-800 hover:text-brand-primary hover:underline'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(h2.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {h2.text}
                  </a>
                  {h2.children?.length > 0 && (
                    <ul className="ml-4 mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
                      {h2.children.map((h3, j) => {
                        const isSubActive = activeId === h3.id;
                        return (
                          <li key={(h3.id || j) + '-sub'}>
                            <a
                              href={`#${encodeURIComponent(h3.id)}`}
                              className={`block text-[15px] leading-snug transition-colors duration-200 ${isSubActive ? 'text-brand-primary font-medium' : 'text-gray-600 hover:text-brand-primary hover:underline'}`}
                              onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(h3.id)?.scrollIntoView({ behavior: 'smooth' });
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
      </div>
    </nav>
  );
}
