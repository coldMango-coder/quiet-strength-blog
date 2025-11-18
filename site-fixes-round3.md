# Site Fixes — Round 3 (TOC consistency, author diacritic at build time, non-overlapping cards)
**MUST NOT degrade Core Web Vitals (LCP, CLS, INP).**  
No render-blocking CSS/JS. No new fonts. Keep changes scoped.

---

## A) TOC: eliminate style jump & mobile overlap (and kill legacy CSS conflicts)

### 1) Purge conflicting legacy rules
Search the repo for any CSS that targets these and **neutralize** them (show path+diff):
- `.toc`, `.toc-container`, `.ez-toc*`, `.lwptoc*`, `.aioseo-table-of-contents`, `#toc_container`, `.qs-toc`
- any `max-height`, `overflow:auto`, `position:sticky` or `position:fixed` on those selectors

**Append to your global CSS** (e.g., `src/index.css` or `globals.css`) **after** existing styles:

```css
/* --- TOC conflict guard (ensures our shell always wins) --- */
.qs-toc .toc, .qs-toc .toc-container, .qs-toc #toc_container,
.qs-toc .ez-toc-container, .qs-toc .lwptoc, .qs-toc .aioseo-table-of-contents {
  all: unset;             /* wipe legacy plugin styling */
  display: initial;
}

/* Common safe base used by both expanded & collapsed states */
.toc-shell {
  overflow: visible !important;     /* no inner scrollbars */
  position: relative;               /* never overlay text */
  background: var(--toc-bg);
  color: var(--toc-text);
  border-radius: 1rem;
  border: 1px solid rgba(0,0,0,.05);
  padding: .75rem 1rem;
  margin-bottom: 1rem;
  font: inherit;                     /* prevent font swap/jump */
}

/* Expanded/collapsed titles share identical typography */
.toc-title { font-size: .875rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }

/* Links: wrap safely; no clipping */
.toc-list { margin: 0; padding: 0; list-style: decimal; }
.toc-link { display:block; padding:.25rem .5rem; text-decoration:none; color: var(--toc-link); overflow-wrap: anywhere; }
.toc-link:hover { text-decoration: underline; }
.toc-shell a[data-active="true"]{ font-weight:600; border-left:2px solid var(--toc-accent); padding-left:.25rem; color:var(--toc-accent); }

/* Sticky only >= lg; below lg it's normal flow so it cannot overlap */
@media (max-width:1023.98px){
  .toc-shell { position: static !important; top: auto !important; }
}
2) Lock the component to the shell classes (no style jump)
Open src/components/ModernTOC.(tsx|jsx) and ensure both states render with the same toc-shell class.
Expanded = <nav className="toc-shell lg:sticky …">
Collapsed = <div className="toc-shell …">

Also remove any details wrapper for desktop; keep it only for mobile (md:hidden).
Ensure no overflow-auto or max-h remain anywhere in the TOC markup.

3) Mobile overlap guard
In the file that places the TOC (often src/components/TableOfContents.js), make sure the wrapper is simple:

jsx
Copy code
<aside className="qs-toc">
  <ModernTOC stickyOffset={96} collapsibleMobile />
</aside>
No sticky or fixed styling on this wrapper.

B) Author name “Marica Šinko”: fix at build time (not just post-paint)
1) Repo-wide text fix (content sources)
Create scripts/fix-author-encoding.mjs:

js
Copy code
// Run with: node scripts/fix-author-encoding.mjs
import fs from "fs";
import path from "path";

const roots = ["content", "src", "public", "data"]; // adjust to your content folders
const patterns = [
  /Marica\s*A\u030A\s*inko/gi,    // A + ring combining
  /Marica\s*Å\s*inko/gi,          // Å + space/nbsp optional
  /Marica\s*Å&nbsp;inko/gi,
  /Marica\s*Sinko\b/gi,           // plain S -> Š if that's how it was stored
  /Marica\s*S\u030cinko/gi        // S + caron combining
];

function fix(s) {
  let out = s.normalize("NFC");
  for (const p of patterns) out = out.replace(p, "Marica Šinko");
  // also normalize stray last-name only
  out = out.replace(/\bŠinko\b/gi, "Šinko");
  return out;
}

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(mdx?|ya?ml|json|js|jsx|ts|tsx|html)$/i.test(e.name)) {
      const raw = fs.readFileSync(p, "utf8");
      const fixed = fix(raw);
      if (fixed !== raw) {
        fs.writeFileSync(p, fixed, "utf8");
        console.log("Fixed:", p);
      }
    }
  }
}
for (const r of roots) if (fs.existsSync(r)) walk(r);
console.log("Done fixing author strings.");
Add an npm script to run it before build:

json
Copy code
// package.json
{
  "scripts": {
    "prebuild": "node scripts/fix-author-encoding.mjs",
    "build": "YOUR_EXISTING_BUILD_COMMAND"
  }
}
2) Render-time safety net (kept very light)
src/lib/content/normalizeAuthor.js:

js
Copy code
export const normalizeAuthor = (name) => {
  if (!name) return name;
  return name.normalize("NFC")
    .replace(/A\u030A\s*inko/gi, "Šinko")
    .replace(/Å\s*inko/gi, "Šinko")
    .replace(/\bSinko\b/gi, "Šinko")
    .replace(/Marica\s+Šinko/i, "Marica Šinko");
};
Use it in your byline component:

jsx
Copy code
import { normalizeAuthor } from "@/lib/content/normalizeAuthor";
const safeName = normalizeAuthor(authorName || "Marica Šinko");
Ensure <meta charSet="utf-8" /> exists in your HTML / _document.tsx.

Prove: output a DOM snippet showing the byline text is exactly “By Marica Šinko” on multiple posts.

C) Home “themes” grid: never overlap, all rows aligned
Open the component that renders “Our Core Self-Help Themes for Introverted Women” (print path + current JSX).
Replace the wrapper and card classes:

jsx
Copy code
<div className="themes-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
  {items.map((it) => (
    <article key={it.slug} className="theme-card h-full flex flex-col rounded-2xl ring-1 ring-black/5 bg-white/80 p-6 shadow-sm transition-transform duration-150 hover:-translate-y-0.5">
      {/* icon + content + link */}
    </article>
  ))}
</div>
Remove any negative margins, position:absolute, or transforms on the parent container.
Append hard CSS fallback if Tailwind is unavailable:

css
Copy code
.themes-grid{ display:grid; grid-template-columns:repeat(1,minmax(0,1fr)); gap:1.5rem; width:100%; }
@media (min-width:640px){ .themes-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (min-width:1024px){ .themes-grid{ grid-template-columns:repeat(3,minmax(0,1fr)); } }
.theme-card{ display:flex; flex-direction:column; height:100%; position:static; margin:0; }
Prove: output computed styles for .themes-grid (display:grid, non-zero gap) and positions of .theme-card (static).

D) Verification (must print)
TOC: outerHTML for expanded and collapsed states — both begin with class="toc-shell …".
Confirm via computed styles: overflowY: visible, sticky disabled on mobile width.

Author: list of modified files by the script + DOM snippet of byline on at least 2 posts showing “By Marica Šinko”.

Themes grid: DOM before/after + computed CSS (grid + gap; cards static).

Lighthouse (desktop) on one article and home page — performance and CLS unchanged or better.

