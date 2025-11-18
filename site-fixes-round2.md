# Site Fixes Round 2 — ToC polish (no overlaps, consistent styles), author diacritic, and card grid cleanup
**Zero regression to Core Web Vitals (LCP, CLS, INP).**  
- No render-blocking assets, no new fonts.  
- Keep changes tiny and scoped.  
- Desktop sticky TOC is ok; on mobile the TOC must not overlay content.  
- Prove via DOM snapshots & a quick Lighthouse run (desktop) after changes.

---

## A) Table of Contents (3 fixes)
### Problems observed
1) **Hide ToC** collapses content but also changes typography/appearance (“style jump”).  
2) **Mobile**: TOC overlaps article text (content slides under it).  
3) Some **wrapping/overflow** causes lines to clip or run into following text.

### Files to modify
- `src/components/ModernTOC.(tsx|jsx)`  
- global CSS (where you placed the TOC tokens) — usually `src/index.css` or `globals.css`.

### Required behavior
- **H2-only** list (as now) with **persistent bar** when collapsed.  
- **No style jump**: both expanded and collapsed states share the same base shell styles.  
- **Desktop sticky only** (`>=1024px`). On mobile: no sticky, no overflow; the TOC should be a normal block with margin.  
- **Never overlay** article content; no inner scrollbars.  
- Safe wrapping for long lines.

### Patch (replace component with this final version if it differs)
```tsx
// ModernTOC – final polish: consistent shell, mobile-safe, no overlays
import React, { useEffect, useMemo, useState } from "react";

type H2 = { id: string; text: string; number: string };

const slugify = (s: string) =>
  (s || "section").toLowerCase().normalize("NFKD")
    .replace(/[^\w\s-]/g,"").trim().replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,"") || "section";

export default function ModernTOC({
  stickyOffset = 96,
  collapsibleMobile = true
}:{ stickyOffset?: number; collapsibleMobile?: boolean }) {
  const [items, setItems] = useState<H2[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const hs = Array.from(document.querySelectorAll("h2")) as HTMLElement[];
    setItems(hs.map((h, i) => {
      if (!h.id) {
        const base = slugify(h.textContent || ""); let id = base, n = 2;
        while (document.getElementById(id)) id = `${base}-${n++}`;
        h.id = id;
      }
      return { id: h.id, text: (h.textContent || "").trim(), number: String(i + 1) };
    }));
  }, []);

  // Shared “shell” class so styles don't jump when collapsed
  const shell =
    "toc-shell not-prose rounded-2xl ring-1 ring-black/5 bg-[var(--toc-bg)] text-[var(--toc-text)] " +
    "px-4 md:px-5 py-3 md:py-4 mb-4";

  const Nav = useMemo(() => {
    if (!items.length || collapsed) return null;
    return (
      <nav
        className={`${shell} lg:sticky`}  /* sticky only on desktop */
        style={{ top: `var(--toc-offset, ${stickyOffset}px)` } as React.CSSProperties}
        aria-label="Table of contents"
      >
        <div className="toc-head flex items-center justify-between mb-2">
          <h2 className="toc-title text-sm font-semibold tracking-wide uppercase">Table of Contents</h2>
          <button
            type="button"
            className="toc-btn text-xs font-medium px-2 py-1 rounded border border-black/10 hover:bg-black/5"
            onClick={() => setCollapsed(true)}
          >
            Hide ToC
          </button>
        </div>
        <ol className="toc-list space-y-1 text-[0.95rem] leading-6">
          {items.map(h2 => (
            <li key={h2.id}>
              <a
                className="toc-link block px-2 py-1 rounded hover:underline font-medium text-[var(--toc-link)]"
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
  }, [items, collapsed, stickyOffset]);

  // Collapsed bar shares the same shell base (no style jump). Not sticky on mobile.
  const CollapsedBar = (
    <div className={`${shell} flex items-center justify-between`} role="region" aria-label="Table of contents (collapsed)">
      <span className="toc-title text-sm font-semibold tracking-wide uppercase opacity-80">Table of Contents</span>
      <button
        type="button"
        className="toc-btn text-xs font-medium px-2 py-1 rounded border border-black/10 hover:bg-black/5"
        onClick={() => setCollapsed(false)}
        aria-expanded={!collapsed}
      >
        Show ToC
      </button>
    </div>
  );

  if (!items.length) return null;

  // Mobile wrapper: no sticky below lg, so it won't overlay content.
  return collapsibleMobile ? (
    <>
      <div className="md:hidden">{collapsed ? CollapsedBar : Nav}</div>
      <div className="hidden md:block">{collapsed ? CollapsedBar : Nav}</div>
    </>
  ) : (collapsed ? CollapsedBar : Nav);
}
CSS adjustments (append once to your global stylesheet)
css
Copy code
/* TOC tokens (already present) kept as-is; add protective rules below */

/* Ensure the shell always uses the same base look */
.toc-shell { overflow: visible; position: relative; }   /* never overlay content */
.toc-head { line-height: 1; }
.toc-title { font-family: inherit; }
.toc-list { margin: 0; padding: 0; list-style: decimal; }
.toc-link { word-break: normal; overflow-wrap: anywhere; } /* prevent clipping on long words */

/* Sticky only on desktop (the component already adds lg:sticky): enforce non-sticky below lg */
@media (max-width: 1023.98px){
  .toc-shell { position: static !important; }
}

/* Margin below TOC so content never crashes into it */
.toc-shell { margin-bottom: 1rem; }

/* Active state (already in place, repeated here for clarity) */
.modern-toc a[data-active="true"],
.toc-shell a[data-active="true"]{
  font-weight: 600;
  border-left: 2px solid var(--toc-accent);
  padding-left: .25rem;
  color: var(--toc-accent);
}
Verification to print: the outerHTML of the expanded and collapsed TOC container must both start with <div class="toc-shell …"> (expanded is a <nav> with toc-shell, collapsed is a <div> with toc-shell). No inner scrollbars; no overlap on mobile.

B) Author name diacritic — force “Marica Šinko” everywhere
What to do (in order)
Find and replace mis-encoded variants in the repo (show paths + diffs):

Search case-insensitively for:
Å inko, Å inko, \u00c5 inko, \u0041\u030a inko, S\u030cinko, Šinko, Sinko

If author metadata comes from code (e.g., src/data/authors.* or frontmatter), set exact string to Marica Šinko in UTF-8.

Rendering guard (add in the author renderer component used on posts): normalize common broken patterns to the correct spelling at render time without touching DB:

ts
Copy code
export function normalizeAuthor(name: string){
  if(!name) return name;
  const n = name.normalize("NFC")
    .replace(/A\u030a\s*inko/gi, "Šinko")   // A + ring combining -> Šinko
    .replace(/Å\s*inko/gi, "Šinko")
    .replace(/\bSinko\b/gi, "Šinko");       // plain 'Sinko' to Šinko if needed
  return n.replace(/Marica\s+Šinko/i, "Marica Šinko");
}
Then in the author byline component:

tsx
Copy code
const safeName = normalizeAuthor(props.name || author?.name || "Marica Šinko");
Ensure UTF-8 meta is present (Next/React _document or HTML template):

html
Copy code
<meta charSet="utf-8" />
Print before/after byline HTML showing By Marica Šinko.

C) Category cards overlap — enforce sane grid & card styles
Steps
Locate the component that renders “Our Core Self-Help Themes for Introverted Women”. Print file path + current JSX around the grid and card items.

Replace the wrapper with a real grid and non-overlapping cards:

jsx
Copy code
<div className="themes-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <article key={item.slug} className="theme-card h-full flex flex-col rounded-2xl ring-1 ring-black/5 bg-white/80 p-6 shadow-sm transition-transform duration-150 hover:-translate-y-0.5">
      {/* icon, title, text, link */}
    </article>
  ))}
</div>
Remove any position:absolute/relative used for layout, negative margins, or container transforms that move cards vertically.

If the CSS is not Tailwind, add the following fallback (append to global CSS):

css
Copy code
.themes-grid{ display:grid; grid-template-columns:repeat(1,minmax(0,1fr)); gap:1.5rem; }
@media (min-width:640px){ .themes-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (min-width:1024px){ .themes-grid{ grid-template-columns:repeat(3,minmax(0,1fr)); } }
.theme-card{ display:flex; flex-direction:column; height:100%; position:static; margin:0; }
.theme-card *{ max-width:100%; }
Prove with a DOM snapshot: wrapper has display: grid and a non-zero gap, cards have position: static and no overlap.

Output (must include)
Paths + diffs for the edited files.

Two .qs-toc snapshots: expanded and collapsed, both using the toc-shell class and no inner scrollbar.

A snippet of the byline HTML showing “By Marica Šinko”.

The themes grid outerHTML before/after and computed CSS (display grid; gap set).

Lighthouse (desktop) quick run on any article and the home page: Core Web Vitals metrics unchanged or improved, especially CLS.

yaml
Copy code

---

