# Fix pack: ToC toggle, author name diacritic, and overlapping category cards
**Do not degrade Core Web Vitals (LCP, CLS, INP).**  
No render-blocking assets, no new fonts, zero layout shift, tiny diffs only.

---

## A) ToC: keep a visible “Show ToC” button when collapsed (no white box)
**Problem:** Clicking “Hide ToC” removes the content AND the button; container stays as an empty block.

**Target:** `src/components/ModernTOC.(tsx|jsx)` (the component that renders `.modern-toc` inside `.qs-toc`).

### What to change
1) Replace hard hiding of the whole wrapper with a **collapsed bar** that remains visible and restores the ToC.
2) Never `display:none` the host container; instead, render a compact header strip with a “Show ToC” button.
3) No CLS: the bar has a stable height (~44px).

### Patch (replace the component body exactly if it differs)
```tsx
// ModernTOC – final minimal H2-only with persistent toggle bar
import React, { useEffect, useMemo, useState } from "react";
type RawHeading = { id?: string; text: string; level: number };
type TOCItem = { id: string; text: string; number: string };

const slugify = (s: string) =>
  (s || "section").toLowerCase().normalize("NFKD")
    .replace(/[^\w\s-]/g,"").trim().replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,"") || "section";

export default function ModernTOC({ stickyOffset = 96, collapsibleMobile = true }:{
  stickyOffset?: number; collapsibleMobile?: boolean;
}) {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const hs = Array.from(document.querySelectorAll("h2")) as HTMLElement[];
    const list: TOCItem[] = hs.map((h, i) => {
      if (!h.id) {
        const base = slugify(h.textContent || ""); let id = base, n = 2;
        while (document.getElementById(id)) id = `${base}-${n++}`; h.id = id;
      }
      return { id: h.id, text: (h.textContent || "").trim(), number: String(i + 1) };
    });
    setItems(list);
  }, []);

  const Nav = useMemo(() => {
    if (!items.length || collapsed) return null;
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
            onClick={() => setCollapsed(true)}
          >
            Hide ToC
          </button>
        </div>
        <ol className="space-y-1 text-[0.95rem] leading-6">
          {items.map(h2 => (
            <li key={h2.id}>
              <a className="block px-2 py-1 rounded hover:underline font-medium text-[var(--toc-link)]"
                 href={`#${h2.id}`} data-active="false">
                {h2.number} {h2.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    );
  }, [items, collapsed, stickyOffset]);

  // Collapsed header strip (always visible; small fixed height; no CLS)
  const CollapsedBar = (
    <div className="modern-toc-collapsed h-11 flex items-center justify-between rounded-2xl ring-1 ring-black/5 px-4 bg-[var(--toc-bg)] text-[var(--toc-text)]">
      <span className="text-sm font-semibold tracking-wide uppercase opacity-80">Table of Contents</span>
      <button
        type="button"
        className="text-xs font-medium px-2 py-1 rounded border border-black/10 hover:bg-black/5"
        onClick={() => setCollapsed(false)}
        aria-expanded={!collapsed}
      >
        Show ToC
      </button>
    </div>
  );

  if (!items.length) return null;

  return collapsibleMobile ? (
    <>
      <details className="md:hidden modern-toc-details rounded-xl overflow-hidden">
        <summary className="cursor-pointer p-3 text-sm font-medium">Table of Contents</summary>
        <div className="p-0">{collapsed ? CollapsedBar : Nav}</div>
      </details>
      <div className="hidden md:block">{collapsed ? CollapsedBar : Nav}</div>
    </>
  ) : (collapsed ? CollapsedBar : Nav);
}
CSS (append once; leave others intact):

css
Copy code
.modern-toc{ overflow:visible; }              /* no inner scrollbar */
.modern-toc-collapsed{ backdrop-filter:saturate(1.1); }
B) Author name diacritic fix: “Marica Šinko” (stop “Å inko”)
Problem: The letter Š is mis-encoded and renders as Å + space.

Steps (lowest risk first)
Find and fix the source string:

Search repo for: Å inko, Å inko, Marica (case-insensitive).

If it comes from a data file (JSON/MD/MDX/JS), edit the value to exactly: Marica Šinko.

Ensure the file is saved as UTF-8 (no BOM).

Guarantee UTF-8 in the document head (React/Next):

If the project has _document.tsx or public/index.html, ensure:

html
Copy code
<meta charSet="utf-8" />
Do not add new fonts or external CSS.

(If WordPress templates exist) verify:

header.php contains: <meta charset="<?php bloginfo( 'charset' ); ?>">

In wp-config.php: define('DB_CHARSET', 'utf8mb4');

Do not change DB schema; only correct charset lines if missing.

Guardrail fallback: if a custom font subset is used, ensure the CSS font stack includes a system fallback with Latin-Extended support:

css
Copy code
body{ font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", Arial, sans-serif; }
(Do not add new font downloads; this just ensures a glyph exists.)

Finally, print the before/after line where the name appears and show a page HTML excerpt proving Marica Šinko.

C) Fix overlapping “Core Self-Help Themes” cards
Problem: Cards visually overlap between rows.

What to do
Locate the component that renders the section whose heading text matches
“Our Core Self-Help Themes for Introverted Women”. Likely file names: ThemesGrid, CategoryCards, HomeSections, etc.

Show file path and current JSX of the grid wrapper and card.

Apply a stable grid with gaps and cards that fill height (no negative margins, no absolute positioning for layout).

Required layout (Tailwind or equivalent CSS)
Grid wrapper (replace the wrapper classes):

jsx
Copy code
<div className="themes-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* cards */}
</div>
Card wrapper (ensure no overlap on hover):

jsx
Copy code
<article className="theme-card h-full flex flex-col rounded-2xl ring-1 ring-black/5 bg-white/80 backdrop-blur-sm p-6 shadow-sm transition-transform duration-150 hover:-translate-y-0.5">
  {/* icon + content */}
</article>
Remove any of the following if present: position:absolute|relative used for layout, top:-*, margin-top:-* on cards, or container transform that pulls cards upward.

Hard CSS assertions (append if not using Tailwind)
css
Copy code
.themes-grid{ display:grid; grid-template-columns:repeat(1,minmax(0,1fr)); gap:1.5rem; }
@media (min-width:640px){ .themes-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (min-width:1024px){ .themes-grid{ grid-template-columns:repeat(3,minmax(0,1fr)); } }
.theme-card{ display:flex; flex-direction:column; height:100%; margin:0; position:static; }
.theme-card:hover{ transform:translateY(-2px); } /* visual only; does not change layout flow */
Verify after build: take a screenshot or dump the computed styles that show

wrapper has display:grid and a non-zero gap,

cards have position: static and height: 100%,

no overlapping and equal spacing between rows.

Output required (to prove success)
File paths modified + diffs for ModernTOC and the grid/card files.

The outerHTML of .qs-toc in both states: expanded (with “Hide ToC”) and collapsed (with compact bar + “Show ToC”).

The exact source line showing Marica Šinko after fix.

A short before/after DOM snippet of the themes section showing themes-grid and theme-card classes.

Quick Lighthouse desktop check on one blog post and the home page to confirm no CWV regression (especially CLS unchanged).

yaml
Copy code

---

## Tiny message to send Codex
Use either version (CLI or plain text).

**CLI:**
```bash
codex run --read site-fixes-toc-author-cards.md --no-cwv-degrade