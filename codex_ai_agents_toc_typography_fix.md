🎯 Objective

Refactor all blog posts and templates in the Quiet Strength Blog project to:

Reposition and redesign the Table of Contents (TOC) for professional UX.

Remove duplicate or manually coded TOCs.

Use the new optimized auto-generated TOC component after the header/hero image.

Maintain and verify Core Web Vitals performance parity (no degradation on mobile or desktop).

🚨 Core Web Vitals Requirement (MUST FOLLOW)

Codex MUST NOT make any change that worsens Core Web Vitals on mobile or desktop.
All edits must be performance-neutral or better.

✅ Hard Budgets

LCP: ≤ 2.5s (mobile) / ≤ 2.0s (desktop)

CLS: ≤ 0.05 target, ≤ 0.10 max

INP: ≤ 200ms

Bundle delta: ≤ +25 KB (gzip) total

No render-blocking scripts or external stylesheets

✅ Rules

No new libraries or dependencies

Keep fonts as is; ensure font-display: swap

Preserve lazy-loading on all images

Use static CSS, not runtime JS, for styling

Use requestIdleCallback for observers

Preserve prerender output for SEO

Accessibility and ARIA semantics must stay valid

✅ Verification Commands

After applying changes, Codex must verify:

npm run build && npm run prerender
npx lighthouse http://localhost:5173 --preset=mobile --quiet
npx lighthouse http://localhost:5173 --preset=desktop --quiet


If any metric regresses, roll back and adjust.

🧱 Tasks Overview

Codex must perform the following in order:

Add TOC anchor placement after each article header/hero section.

Update the TableOfContents component with a smaller, more professional layout.

Remove all old/manual TOC blocks across all pages.

Ensure mobile collapsible design and readability.

Prevent layout shifts (CLS-safe) using reserved height.

Maintain SEO and prerender structure.

🔧 Detailed Implementation Steps
1. Add TOC Anchor After Header/Hero

In every blog post layout file (e.g. /src/components/BlogPost[Title].js, /src/pages/blog/*.js):

Find the section after the blog header/meta and hero image, but before the first <section> of content.

Insert this:

<div id="toc-anchor" className="mb-10" />
<TableOfContents rootSelector="article" anchorSelector="#toc-anchor" />


Ensure that:

The TOC comes after the hero image and meta block.

The TOC is not above the H1.

Imports are added at the top of the file:

import TableOfContents from '../components/TableOfContents';

2. Replace the Current TOC Component with the Optimized Version

Replace the entire src/components/TableOfContents.js file with this version:

import React, { useEffect, useState } from 'react';

const slugify = (str) =>
  str.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');

export default function TableOfContents({
  rootSelector = 'article',
  anchorSelector = null,
  maxDepth = 3,
}) {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return;

    const headings = [...root.querySelectorAll('h2, h3')].filter((h) => {
      if (h.closest('[data-toc]')) return false;
      const text = (h.textContent || '').trim().toLowerCase();
      if (text === 'table of contents') return false;
      return true;
    });

    const nodes = headings.map((h) => {
      if (!h.id) h.id = slugify(h.textContent || '');
      return { id: h.id, text: h.textContent, level: h.tagName === 'H2' ? 2 : 3 };
    });

    const result = [];
    let current = null;
    nodes.forEach((n) => {
      if (n.level === 2) {
        current = { ...n, children: [] };
        result.push(current);
      } else if (n.level === 3 && current) {
        current.children.push(n);
      }
    });

    setItems(result);
  }, [rootSelector]);

  useEffect(() => {
    const start = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (visible) setActiveId(visible.target.id);
        },
        { rootMargin: '0px 0px -70% 0px', threshold: [0, 0.2, 1] }
      );
      document.querySelectorAll('article h2, article h3').forEach((el) =>
        observer.observe(el)
      );
      return () => observer.disconnect();
    };
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback && window.cancelIdleCallback(id);
    }
    return start();
  }, []);

  const toc = (
    <nav
      aria-label="Table of contents"
      className="shadow-sm rounded-lg border border-slate-200 bg-white text-sm leading-6"
      data-toc
    >
      {/* Desktop */}
      <div className="hidden md:block p-5">
        <h2 className="text-base font-bold mb-2 text-slate-900">
          Table of Contents
        </h2>
        <ol className="pl-5 list-decimal space-y-1">
          {items.map((h2) => (
            <li key={h2.id}>
              <a
                href={`#${h2.id}`}
                className={`hover:underline ${
                  activeId === h2.id ? 'text-brand-emphasis' : 'text-slate-700'
                }`}
              >
                {h2.text}
              </a>
              {h2.children?.length ? (
                <ol className="pl-5 list-decimal mt-1 space-y-1">
                  {h2.children.map((h3) => (
                    <li key={h3.id}>
                      <a
                        href={`#${h3.id}`}
                        className={`hover:underline ${
                          activeId === h3.id ? 'text-brand-emphasis' : 'text-slate-700'
                        }`}
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
      </div>

      {/* Mobile (collapsible) */}
      <details className="md:hidden p-4">
        <summary className="text-sm font-semibold cursor-pointer select-none">
          Table of Contents
        </summary>
        <ol className="pl-5 list-decimal mt-2 space-y-1 text-sm">
          {items.map((h2) => (
            <li key={h2.id}>
              <a href={`#${h2.id}`} className="hover:underline">
                {h2.text}
              </a>
              {h2.children?.length ? (
                <ol className="pl-5 list-decimal mt-1 space-y-1">
                  {h2.children.map((h3) => (
                    <li key={h3.id}>
                      <a href={`#${h3.id}`} className="hover:underline">
                        {h3.text}
                      </a>
                    </li>
                  ))}
                </ol>
              ) : null}
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );

  useEffect(() => {
    if (!anchorSelector) return;
    const mount = document.querySelector(anchorSelector);
    if (mount) mount.style.minHeight = '120px'; // Prevent CLS
  }, [anchorSelector]);

  return toc;
}

3. Remove All Manual or Duplicate TOC Blocks

Codex must search the entire /src directory for any block of code resembling:

<h2>Table of Contents</h2>
<ul>...</ul>


or

<section className="toc-list">...</section>


and delete them.

Replace each removed block with:

<div id="toc-anchor" className="mb-10" />
<TableOfContents rootSelector="article" anchorSelector="#toc-anchor" />


This ensures a single consistent TOC per article.

4. Typography Adjustments (TOC Only)

Use text-base on desktop, text-sm on mobile.

Line height: leading-6

Spacing between items: space-y-1

Margins: mb-2 for TOC heading, pl-5 for lists.

On mobile, TOC collapses under <details> / <summary> for compact layout.

5. Core Web Vitals Guardrails (Recheck)

TOC insertion uses minHeight to prevent layout shifts.

IntersectionObserver runs via requestIdleCallback.

No new fonts or dependencies added.

No CLS increase or LCP delay allowed.

Verify via Lighthouse after build.

✅ Final Verification Steps

After Codex applies all updates:

npm run build && npm run prerender
npm run dev


Then visually confirm:

TOC appears after hero, not at top.

No duplicate old TOC.

Font size smaller, spacing compact.

Collapsible on mobile.

No CLS jumps while loading.

Lighthouse CWV scores remain at or above pre-change values.

Commit Message Template
refactor(ui/toc): reposition and optimize Table of Contents placement and styling

- Move TOC below hero/meta sections
- Remove duplicate/manual TOC blocks
- Compact typography for professional design
- Add collapsible mobile TOC
- Maintain Core Web Vitals parity (CLS-safe, LCP unchanged)


🚨 Core Web Vitals — Do Not Regress

Must not worsen CWV on mobile or desktop.

Budgets

LCP ≤ 2.5s (mobile) / 2.0s (desktop)

CLS ≤ 0.05 target (≤ 0.10 max)

INP ≤ 200ms

Bundle delta ≤ +25 KB gzip

No new render-blocking scripts/styles; no new libraries or fonts

Guardrails

Keep current fonts (system stack); font-display: swap remains.

Images keep explicit dimensions + loading="lazy".

Prevent layout shifts: reserve TOC space.

New observers via requestIdleCallback.

Prerendered HTML remains SEO-correct.

Verification (must run)

npm run build && npm run prerender
npx lighthouse http://localhost:5173 --preset=mobile --quiet
npx lighthouse http://localhost:5173 --preset=desktop --quiet


If any metric regresses, adjust or rollback.

✅ Exact WordPress-Style Typography Spec

These are explicit targets Codex must implement globally for article content.

Global scales (mobile → desktop)

Base body size: 16.5px → 18px

Body line-height: 1.75

Headings line-height: 1.25

Reading measure (max width): 70–72ch (use 72ch)

Paragraph spacing: 0.9em (between paragraphs)

Letter-spacing body: 0.005em

Article side padding on mobile (≤640px): 0.75rem per side

Headings (exact visual targets)
Element	Mobile (≤640px)	Desktop (≥1024px)
H1	32px	44px
H2	24px	32px
H3	20px	24px
Spacing rhythm

H1/H2/H3 top margin: 1.6em, bottom margin: 0.6em

Lists: block margin 1.25rem, item line-height inherits (≈1.75)

Blockquote: margin 2rem 0, padding 1rem 1.25rem, left border 4px

Figure: margin 1.5rem 0; figcaption font-size small (~15–16px), muted color

Tables: full width, row padding 0.6rem 0.4rem, thin bottom border

Inline code: ~0.95em with soft background and 4px radius

Links: underline on hover, underline offset 3px, thickness 1.25px

1) Create global stylesheet (NEW): src/styles/typography.css

Implements the exact sizes with fluid clamp() endpoints matched to the table above.

:root{
  /* Exact WP-like scale (mobile → desktop) */
  --fs-base: clamp(1.031rem, 0.98rem + 0.5vw, 1.125rem);  /* 16.5 → 18 */
  --fs-para: clamp(1.06rem, 1.0rem + 0.7vw, 1.20rem);     /* body+ paragraphs */

  --fs-h1: clamp(2.0rem, 1.5rem + 2.5vw, 2.75rem);        /* 32 → 44 */
  --fs-h2: clamp(1.5rem, 1.2rem + 1.6vw, 2.0rem);         /* 24 → 32 */
  --fs-h3: clamp(1.25rem, 1.05rem + 1.0vw, 1.5rem);       /* 20 → 24 */

  --lh-body: 1.75;
  --lh-heading: 1.25;

  --measure: 72ch;
  --space-1: 0.5rem;
  --space-2: 0.9rem;    /* para spacing */
  --space-3: 1.25rem;
  --space-4: 2rem;

  --text: #0f172a;      /* slate-900 fallback */
  --muted: #475569;     /* slate-600 */
  --link: #0ea5e9;      /* brand-ish blue */
  --border: #e2e8f0;
  --bg-quote: #f8fafc;
}

html { font-size: 16px; }
body {
  font-size: var(--fs-base);
  line-height: var(--lh-body);
  color: var(--text);
  letter-spacing: 0.005em;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.article-container {
  max-width: var(--measure);
}

.article-container h1,
.article-container h2,
.article-container h3 {
  line-height: var(--lh-heading);
  font-weight: 800;
  color: var(--text);
  margin: 1.6em 0 0.6em;
}

.article-container h1 { font-size: var(--fs-h1); margin-top: 0; }
.article-container h2 { font-size: var(--fs-h2); }
.article-container h3 { font-size: var(--fs-h3); }

.article-container p,
.article-container li { font-size: var(--fs-para); }

.article-container p { margin: var(--space-2) 0; }

.article-container ul,
.article-container ol {
  margin: var(--space-3) 0 var(--space-3) 1.2rem;
  padding-left: 0.4rem;
}

.article-container a {
  color: var(--link);
  text-underline-offset: 3px;
  text-decoration-thickness: 1.25px;
}
.article-container a:hover { text-decoration: underline; }

.article-container blockquote {
  margin: var(--space-4) 0;
  padding: 1rem 1.25rem;
  border-left: 4px solid var(--border);
  background: var(--bg-quote);
}

.article-container figure { margin: 1.5rem 0; }
.article-container figcaption {
  color: var(--muted);
  font-size: clamp(0.94rem, 0.9rem + 0.2vw, 1.0rem); /* ~15–16 */
  margin-top: 0.5rem;
  text-align: center;
}

.article-container code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.95em;
  background: #f8fafc;
  padding: 0.15em 0.35em;
  border-radius: 4px;
}

.article-container table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.25rem 0;
  font-size: var(--fs-base);
}
.article-container th, .article-container td {
  border-bottom: 1px solid var(--border);
  padding: 0.6rem 0.4rem;
  text-align: left;
}
.article-container thead th { font-weight: 700; }

.article-container img { display:block; height:auto; max-width:100%; }

/* Mobile padding so text doesn't look oversized */
@media (max-width: 640px){
  .article-container { padding-left: 0.75rem; padding-right: 0.75rem; }
  .article-container blockquote { margin-left: 0; margin-right: 0; }
}


Import once in src/App.js (or global entry):

import './styles/typography.css';

2) Normalize heading classes inside articles

Search in /src for headings within the main article content that hard-code big Tailwind sizes (e.g., text-4xl md:text-6xl, text-3xl, etc.). Replace with semantic classes only, letting the CSS above control exact sizes:

h1: className="font-bold mb-6"

h2: className="font-bold mb-4"

h3: className="font-semibold mb-3"

Ensure the main wrapper uses:

<article className="article-container mx-auto">

3) TOC placement (after hero), compact, and mobile-collapsible

Insert right after the header/meta + hero (not at the top):

<div id="toc-anchor" className="mb-10" />
<TableOfContents rootSelector="article" anchorSelector="#toc-anchor" />


Add import where needed:

import TableOfContents from '../components/TableOfContents';


Replace src/components/TableOfContents.js with this compact, CLS-safe component:

import React, { useEffect, useState } from 'react';

const slugify = (str) =>
  str.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');

export default function TableOfContents({
  rootSelector = 'article',
  anchorSelector = null,
}) {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return;

    // Ignore headings inside the TOC and literal 'Table of Contents'
    const headings = [...root.querySelectorAll('h2, h3')].filter((h) => {
      if (h.closest('[data-toc]')) return false;
      const t = (h.textContent || '').trim().toLowerCase();
      return t !== 'table of contents';
    });

    const nodes = headings.map((h) => {
      if (!h.id) h.id = slugify(h.textContent || '');
      return { id: h.id, text: h.textContent, level: h.tagName === 'H2' ? 2 : 3 };
    });

    const out = [];
    let current = null;
    nodes.forEach((n) => {
      if (n.level === 2) { current = { ...n, children: [] }; out.push(current); }
      else if (n.level === 3 && current) { current.children.push(n); }
    });

    setItems(out);
  }, [rootSelector]);

  // Idle scroll-spy to protect LCP
  useEffect(() => {
    const start = () => {
      const observer = new IntersectionObserver((entries) => {
        const vis = entries.filter(e => e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
        if (vis) setActiveId(vis.target.id);
      }, { rootMargin: '0px 0px -70% 0px', threshold: [0, 0.2, 1] });
      document.querySelectorAll('article h2, article h3').forEach(el => observer.observe(el));
      return () => observer.disconnect();
    };
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback && window.cancelIdleCallback(id);
    }
    return start();
  }, []);

  useEffect(() => {
    if (!anchorSelector) return;
    const mount = document.querySelector(anchorSelector);
    if (mount) mount.style.minHeight = '120px'; // reserve space to avoid CLS
  }, [anchorSelector]);

  return (
    <nav aria-label="Table of contents"
         className="shadow-sm rounded-lg border border-slate-200 bg-white text-sm leading-6"
         data-toc>
      {/* Desktop */}
      <div className="hidden md:block p-5">
        <h2 className="text-base font-bold mb-2 text-slate-900">Table of Contents</h2>
        <ol className="pl-5 list-decimal space-y-1">
          {items.map(h2 => (
            <li key={h2.id}>
              <a href={`#${h2.id}`}
                 className={`hover:underline ${activeId===h2.id?'text-brand-emphasis':'text-slate-700'}`}>
                {h2.text}
              </a>
              {h2.children?.length ? (
                <ol className="pl-5 list-decimal mt-1 space-y-1">
                  {h2.children.map(h3 => (
                    <li key={h3.id}>
                      <a href={`#${h3.id}`}
                         className={`hover:underline ${activeId===h3.id?'text-brand-emphasis':'text-slate-700'}`}>
                        {h3.text}
                      </a>
                    </li>
                  ))}
                </ol>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
      {/* Mobile collapsible */}
      <details className="md:hidden p-4">
        <summary className="text-sm font-semibold cursor-pointer select-none">Table of Contents</summary>
        <ol className="pl-5 list-decimal mt-2 space-y-1 text-sm">
          {items.map(h2 => (
            <li key={h2.id}>
              <a href={`#${h2.id}`} className="hover:underline">{h2.text}</a>
              {h2.children?.length ? (
                <ol className="pl-5 list-decimal mt-1 space-y-1">
                  {h2.children.map(h3 => (
                    <li key={h3.id}><a href={`#${h3.id}`} className="hover:underline">{h3.text}</a></li>
                  ))}
                </ol>
              ) : null}
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}

4) Remove all manual/duplicate TOCs (project-wide)

Search /src for any section that matches:

<h2>Table of Contents</h2> + <ul>/<ol>

elements with className="toc-list" or id="toc"

Delete those blocks and replace with:

<div id="toc-anchor" className="mb-10" />
<TableOfContents rootSelector="article" anchorSelector="#toc-anchor" />


Ensure a single TOC per article.

5) Rebuild & Validate (must pass)
npm run build && npm run prerender
npm run dev


Visual & functional checks on a long article:

Text sizes match the exact targets above (32/44 H1, 24/32 H2, 20/24 H3).

Line-height, spacing, and measure feel like a premium WordPress theme.

TOC sits below hero, compact on desktop, collapsible on mobile.

No duplicates. No layout jank.

Lighthouse mobile/desktop show no CWV regressions.

Commit message template
style(typography): exact WordPress-grade sizes + rhythm; compact TOC after hero; remove manual TOCs
- Global fluid type: 16.5→18 base, H1 32→44, H2 24→32, H3 20→24, LH 1.75/1.25
- Max measure 72ch; paragraph/list/blockquote/table/code polish
- TOC compact & mobile-collapsible, placed after hero; CLS-safe
- No CWV regressions (idle observers, no new deps)