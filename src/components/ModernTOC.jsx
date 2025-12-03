import React, { useEffect, useState } from "react";

const slugify = (s) =>
  (s || "section")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

export default function ModernTOC({ rootSelector = ".post-body" }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const resolveRoot = () => document.querySelector(rootSelector) || document;

    const collect = () => {
      const root = resolveRoot();
      const hs = Array.from(root.querySelectorAll("h2"));
      const list = hs.map((h, i) => {
        if (!h.id) {
          const base = slugify(h.textContent || "");
          let id = base, n = 2;
          while (document.getElementById(id)) id = `${base}-${n++}`;
          h.id = id;
        }
        return { id: h.id, text: (h.textContent || "").trim(), number: String(i + 1) };
      });
      setItems(list);
    };

    // Initial collection (in case headings are already rendered)
    collect();

    // Observe the root for added headings (covers lazy-loaded article bodies)
    const root = resolveRoot();
    let mo;
    try {
      mo = new MutationObserver((mutations) => {
        for (const m of mutations) {
          for (const node of m.addedNodes) {
            if (node.nodeType !== 1) continue;
            if (node.matches?.("h2") || node.querySelector?.("h2")) {
              collect();
              return;
            }
          }
        }
      });
      mo.observe(root, { childList: true, subtree: true });
    } catch {
      // If MutationObserver fails for any reason, we still keep the initial snapshot.
    }

    return () => {
      try {
        mo && mo.disconnect();
      } catch {}
    };
  }, [rootSelector]);

  if (!items.length) return null;

  return (
    <details className="toc-shell block">
      <summary className="toc-title cursor-pointer select-none">Table of Contents</summary>
      <ol className="toc-list mt-2 space-y-1 text-[0.95rem] leading-6">
        {items.map((h2) => (
          <li key={h2.id}>
            <a className="toc-link" href={`#${h2.id}`} data-active="false">
              {h2.number} {h2.text}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}
