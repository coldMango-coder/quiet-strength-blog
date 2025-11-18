# Minimal Clean TOC (H2-only) — remove per-section toggles & fix Hide ToC
**Hard rule:** Do **not** degrade Core Web Vitals (LCP, CLS, INP). No render-blocking assets; tiny JS; zero unexpected CLS.

## What to change
Replace the current `ModernTOC` with an H2-only version (no “Show topics”, no “Expand all”). Keep accent colors.  
Fix the **Hide ToC** button so it hides the **entire ToC container** (the nearest `.qs-toc`/`.toc` wrapper) — not just the nav.

## Edit `src/components/ModernTOC.(tsx|jsx)` (REPLACE FILE)

```tsx
import React, { useEffect, useMemo, useState } from "react";

type RawHeading = { id?: string; text: string; level: number };
type TOCItem = { id: string; text: string; level: number; number: string };

const slugify = (s: string) =>
  (s || "section").toLowerCase().normalize("NFKD")
    .replace(/[^\w\s-]/g,"").trim().replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,"") || "section";

export default function ModernTOC({
  stickyOffset = 96,
  collapsibleMobile = true
}:{ stickyOffset?: number; collapsibleMobile?: boolean }) {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [hidden, setHidden] = useState(false);

  // Build H2 list only
  useEffect(() => {
    const hs = Array.from(document.querySelectorAll("h2")) as HTMLElement[];
    if (!hs.length) return;
    const nums: number[] = [];
    const list: TOCItem[] = hs.map((h, i) => {
      if (!h.id) {
        const base = slugify(h.textContent || "");
        let id = base, n = 2;
        while (document.getElementById(id)) id = `${base}-${n++}`;
        h.id = id;
      }
      nums[0] = i + 1;
      return { id: h.id, text: (h.textContent || "").trim(), level: 2, number: String(nums[0]) };
    });
    setItems(list);
  }, []);

  // Hide entire wrapper (fixes "white box" issue)
  function hideEntireTOC() {
    setHidden(true);
    // Also hide closest container in DOM to avoid leftover padding/border from parent wrappers
    try {
      const root = document.querySelector(".modern-toc") as HTMLElement | null;
      const host = root?.closest(".qs-toc, .toc, .toc-container, .sidebar, aside");
      if (host instanceof HTMLElement) host.style.display = "none";
    } catch {}
  }

  const Nav = useMemo(() => {
    if (!items.length || hidden) return null;
    return (
      <nav
        className="modern-toc not-prose rounded-2xl shadow-sm ring-1 ring-black/5 p-4 md:p-5 bg-[var(--toc-bg)] text-[var(--toc-text)] lg:sticky"
        style={{ top: `var(--toc-offset, ${stickyOffset}px)` } as React.CSSProperties}
        aria-label="Table of contents"
      >
        <div className="flex items-center justify-between mb-3 gap-3">
          <h2 className="text-sm font-semibold tracking-wide uppercase">Table of Contents</h2>
          <button
            type="button"
            className="text-xs font-medium px-2 py-1 rounded border border-black/10 hover:bg-black/5"
            onClick={hideEntireTOC}
            aria-label="Hide table of contents"
          >
            Hide ToC
          </button>
        </div>

        <ol className="space-y-1 text-[0.95rem] leading-6">
          {items.map((h2) => (
            <li key={h2.id}>
              <a
                className="block px-2 py-1 rounded hover:underline font-medium text-[var(--toc-link)]"
                href={`#${h2.id}`}
                data-active="false"
              >
                {h2.number} {h2.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    );
  }, [items, hidden, stickyOffset]);

  if (!items.length || hidden) return null;

  return collapsibleMobile ? (
    <>
      <details className="md:hidden modern-toc-details rounded-xl overflow-hidden">
        <summary className="cursor-pointer p-3 text-sm font-medium">Table of Contents</summary>
        <div className="p-0">{Nav}</div>
      </details>
      <div className="hidden md:block">{Nav}</div>
    </>
  ) : ( Nav );
}
CSS (verify tokens exist once; no inner scrollbar anywhere)
css
Copy code
:root{
  --toc-bg: color-mix(in oklab, Canvas, var(--wp--preset--color--primary, #4f46e5) 6%);
  --toc-accent: var(--wp--preset--color--primary, #4f46e5);
  --toc-text: var(--wp--preset--color--foreground, #0b1020);
  --toc-link: color-mix(in oklab, var(--toc-text), var(--toc-accent) 35%);
}
@media (prefers-color-scheme: dark){
  :root{
    --toc-bg: color-mix(in oklab, Canvas, var(--wp--preset--color--primary, #818cf8) 14%);
    --toc-text: var(--wp--preset--color--foreground, #e5e7eb);
    --toc-link: color-mix(in oklab, var(--toc-text), var(--toc-accent) 45%);
  }
}
.modern-toc a[data-active="true"]{
  font-weight:600; border-left:2px solid var(--toc-accent); padding-left:.25rem; color: var(--toc-accent);
}
/* Ensure no inner scrollbars on the nav */
.modern-toc{ overflow: visible; }
Clean up previous controls
Remove any “Show topics (…)” and “Expand all/Collapse all” UI code you previously added.

Ensure no lg:max-h[...] or overflow-auto remains on the TOC nav or wrapper.

Verify (print to console/log)
.qs-toc container disappears entirely when clicking Hide ToC (no empty box).

Visible TOC items are H2s only (numbered), colored accent links, no inner scrollbar.

Lighthouse desktop metrics unchanged (especially CLS).