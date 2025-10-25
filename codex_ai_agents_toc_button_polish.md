codex_ai_agents_toc_button_polish.md
🎯 Goal

Polish the Table of Contents UX/UI across all articles:

Replace the current “Show/Close TOC” behavior with a single, elegant toggle button whose label always reads “Table of Contents.”

Keep the button left-aligned, same size, same position (no jump when toggled).

Shrink TOC text to a professional, WordPress-grade size (compact on mobile).

Remove unconventional symbols that sometimes appear at the very start of articles.

MUST NOT degrade Core Web Vitals (mobile or desktop).

🚨 Core Web Vitals: Non-negotiable

Do not worsen CWV. All changes must be performance-neutral or better.

LCP ≤ 2.5s (mobile) / 2.0s (desktop)

CLS ≤ 0.05 target (≤ 0.10 max)

INP ≤ 200ms

Bundle delta ≤ +25 KB gzip

No render-blocking scripts/styles; no new libraries or fonts

Use requestIdleCallback for observers; keep loading="lazy" for images

Preserve prerendered SEO output

Verification (must run locally):

npm run build && npm run prerender
npx lighthouse http://localhost:5173 --preset=mobile --quiet
npx lighthouse http://localhost:5173 --preset=desktop --quiet


If any metric regresses: adjust or rollback the offending change.

1) Create a polished TOC toggle (NEW component)

File: src/components/TocToggle.js (NEW)

A button with fixed label “Table of Contents” and a chevron icon that rotates on open/close.

Button is inline-flex, left-aligned, fixed width, so it never shifts.

Panel is hidden/shown without moving the button.

Typography in the panel is compact.

import React, { useState, useEffect } from 'react';

export default function TocToggle({ children, defaultOpen=false }) {
  const [open, setOpen] = useState(defaultOpen);

  // Avoid layout shift: reserve space below the button
  useEffect(() => {
    // no-op: actual space reserved by min-height on the container where used
  }, []);

  return (
    <div className="w-full" data-toc-toggle>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 px-3 py-1.5
                   rounded-full border border-slate-300 bg-white
                   text-slate-800 text-sm font-semibold
                   shadow-sm hover:bg-slate-50 focus:outline-none focus:ring
                   focus:ring-slate-300 transition"
        style={{ minWidth: 196 }} // fixed visual width so it never “jumps”
      >
        <svg
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/>
        </svg>
        <span>Table of Contents</span>
      </button>

      {/* Panel (keeps place; collapses without moving button) */}
      <div
        data-toc-panel
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out`}
        style={{ maxHeight: open ? '1200px' : '0px' }}
      >
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4
                        text-[13px] md:text-[14px] leading-6">
          {children}
        </div>
      </div>
    </div>
  );
}


The label always stays “Table of Contents”; only the chevron rotates.
minWidth:196 keeps the button width stable so it won’t shift left/right.

2) Update the TOC component to use the new toggle & compact text

Modify src/components/TableOfContents.js:

Keep your existing heading collection logic (H2/H3).

Remove the <details>/<summary> markup.

Wrap the list in TocToggle to get the new button and panel.

Make the list typography compact: text-[13px] md:text-[14px] leading-6 space-y-1.

Replacement body (keep your slugify/observer code):

// … keep your imports/slugify/observer logic above …
import TocToggle from './TocToggle';

export default function TableOfContents({ rootSelector = 'article', anchorSelector = null }) {
  // … keep state/effects that build `items` and set `activeId` …

  useEffect(() => {
    if (!anchorSelector) return;
    const mount = document.querySelector(anchorSelector);
    if (mount) mount.style.minHeight = '120px'; // reserve space to avoid CLS
  }, [anchorSelector]);

  const List = () => (
    <nav aria-label="Table of contents" data-toc>
      <ol className="pl-5 list-decimal space-y-1">
        {items.map((h2) => (
          <li key={h2.id}>
            <a
              href={`#${h2.id}`}
              className={`hover:underline ${activeId===h2.id ? 'text-brand-emphasis' : 'text-slate-700'}`}
            >
              {h2.text}
            </a>
            {h2.children?.length ? (
              <ol className="pl-5 list-decimal mt-1 space-y-1">
                {h2.children.map((h3) => (
                  <li key={h3.id}>
                    <a
                      href={`#${h3.id}`}
                      className={`hover:underline ${activeId===h3.id ? 'text-brand-emphasis' : 'text-slate-700'}`}
                    >
                      {h3.text}
                    </a>
                  </li>
                ))}
              </ol>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );

  return (
    <TocToggle defaultOpen={false}>
      <List />
    </TocToggle>
  );
}

3) Place the button + TOC panel consistently in every article

Every article layout (e.g., src/components/BlogPost[Title].js, src/pages/blog/*) must:

Keep header + byline + hero image first.

Insert this anchor block directly under the hero/meta, before the first content section:

<div id="toc-anchor" className="mb-8" />
<TableOfContents rootSelector="article" anchorSelector="#toc-anchor" />


This ensures identical placement on all posts.

4) Compact the TOC text even more (global CSS helper)

Add to src/styles/typography.css (or create if missing and already imported):

/* TOC compact text sizes */
[data-toc] { font-size: 13px; line-height: 1.55; }
@media (min-width: 768px){ [data-toc] { font-size: 14px; } }

/* Keep numbers aligned and tidy */
[data-toc] ol { padding-left: 1.25rem; }
[data-toc] li { padding-left: 0.1rem; }


Keep this file small; don’t add new global fonts. CWV-safe.

5) Remove weird symbols at the beginning of articles (sanitizer)

Add a lightweight sanitizer that runs once on mount and strips odd leading characters like • — – » ▷ ▶ ◦ · ※ ⇒ → + BOM.

File: src/lib/sanitizeArticleStart.js (NEW)

// Removes stray bullets/dashes/BOM at the very start of article text nodes.
export default function sanitizeArticleStart(rootSel = 'article'){
  const root = document.querySelector(rootSel);
  if(!root) return;

  const STRIP_RE = /^[\uFEFF\s]*(?:[•—–\-»▷▶◦·※⇒→]+[\s]*)*/; // BOM + bullets/arrows
  // scan first few text-bearing nodes (p, h2, h3) and clean the first match
  const first = root.querySelector('p, h2, h3, h1');
  if(first && first.firstChild && first.firstChild.nodeType === Node.TEXT_NODE){
    first.firstChild.nodeValue = first.firstChild.nodeValue.replace(STRIP_RE, '');
  }
}


Use it in the article layout file(s) once, near where you render the article:

import { useEffect } from 'react';
import sanitizeArticleStart from '../lib/sanitizeArticleStart';

// inside the article component
useEffect(() => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => sanitizeArticleStart('article'), { timeout: 1200 });
  } else {
    setTimeout(() => sanitizeArticleStart('article'), 0);
  }
}, []);


Idle scheduling keeps it CWV-safe (runs after first paint).

6) Remove any old TOC toggles/details UI across the codebase

Search and remove:

<details className="md:hidden ..."> / <summary>Show/Close Table of Contents blocks

Any button whose label changes to “Close TOC”

Elements with className="toc-list" or id="toc" from previous manual TOCs

Replace with the new:

<div id="toc-anchor" className="mb-8" />
<TableOfContents rootSelector="article" anchorSelector="#toc-anchor" />

7) Rebuild & verify (must pass)
npm run build && npm run prerender
npm run dev


Confirm on several posts (long + short):

The button always says “Table of Contents”, left-aligned, same spot, visually appealing.

On click: the chevron rotates; the button does not move; the TOC panel opens/closes below it.

TOC text is smaller/clean, especially on mobile.

No duplicate/legacy TOC.

No strange symbols at the very start of articles.

Lighthouse mobile/desktop no CWV regression.

Commit message template
feat(toc/ui): elegant static-label TOC toggle; compact panel; sanitize article start; no CWV regressions

- New TocToggle button (fixed label/placement, chevron icon, no jump)
- TOC panel compact text (13px mobile, 14px desktop), tidy spacing
- Reserve space to avoid CLS; idle observers only
- Remove legacy details/summary and “Close TOC” patterns across posts
- Sanitize odd leading symbols at article start