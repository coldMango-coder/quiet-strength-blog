import React, { useEffect, useState } from "react";

const slugify = (s) =>
  (s || "section")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

export default function ModernTOC() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const hs = Array.from(document.querySelectorAll("h2"));
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
  }, []);

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
