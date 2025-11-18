# Mission: Modernize the EXISTING Table of Contents (ToC) in-place — React/Tailwind + WordPress-safe
> **HARD REQUIREMENT:** EXISTING **Core Web Vitals** (LCP, CLS, INP) **MUST NOT GET WORSE**. They can only stay the same or improve.
> - No new render-blocking assets. Tiny CSS is allowed; JS is `defer` and hydrated on `requestIdleCallback`.
> - No CLS: reserve height before DOM swaps; avoid reflow-heavy logic.
> - JS bundle budget for this task: **≤ 6 KB gzipped**; CSS **≤ 3 KB gzipped**.

---

## 0) Repo Audit (DO FIRST)
1. Print project type by checking for:
   - **React/Next**: `package.json`, `src/`, `components/`, `pages/` or `app/`.
   - **WordPress**: `wp-content/` structure (themes & plugins).
2. Search for the current ToC implementation and the **“Hide ToC / Show ToC”** toggle text. Output file paths + line numbers.
   - Grep terms: `Table of Contents`, `ToC`, `toc`, `Hide ToC`, `Show ToC`, `.toc`, `.toc-container`, `.ez-toc`, `.lwptoc`, `.aioseo-table-of-contents`, `TableOfContents`.
3. Paste the **current ToC container HTML** (DOM snapshot from a real article page) BEFORE changes.
4. Decide the primary track:
   - If you find `src/components/TableOfContents.*` or similar → **React track**.
   - If you find only WordPress assets (`wp-content/...`) → **WordPress track**.
   - If both exist, modify **the one actually rendering on article pages** (confirm by DOM snapshot).

---

## 1) Design Spec (apply regardless of track)
- Modern card (no pure white). Tinted background, rounded-2xl, subtle ring, soft shadow.
- Clear hierarchy:
  - H2 items are **semibold**.
  - H3 items indented with border-left, normal weight.
  - H4 further indented, slightly muted text.
- Numbering: `1.`, `1.1`, `1.1.1`.
- Scrollspy highlight with a left accent bar. Keyboard & a11y friendly.
- Mobile: collapsible `<details>` titled **“Table of Contents”**.
- Desktop: sticky with `top` offset (default 96px), max height and internal scroll.
- SEO: all anchors are **server/SSR-rendered**; JS only enhances (no reliance on JS to see links).
- Dark mode aware via prefers-color-scheme.
- **DO NOT** remove existing heading IDs; if missing, generate deterministic slugs and apply them to headings.

Color tokens (use CSS vars; no blocking fonts):
```css
:root{
  --toc-bg: color-mix(in oklab, Canvas, var(--wp--preset--color--primary, #4f46e5) 6%);
  --toc-accent: var(--wp--preset--color--primary, #4f46e5);
  --toc-text: var(--wp--preset--color--foreground, #0b1020);
}
@media (prefers-color-scheme: dark){
  :root{
    --toc-bg: color-mix(in oklab, Canvas, var(--wp--preset--color--primary, #818cf8) 14%);
    --toc-text: var(--wp--preset--color--foreground, #e5e7eb);
  }
}
2A) React/Next Track (if the site renders ToC from src/)
Files to create/modify
Create src/components/ModernTOC.tsx (React + Tailwind classes in markup).

Replace/Update the current ToC entry point (usually src/components/TableOfContents.*) to use ModernTOC and delete any old “Hide ToC / Show ToC” toggle that blanks content but leaves a white box.

Create src/lib/toc.ts helpers for: slugify, parse H2–H4 from rendered HTML/MDX, build nested tree, add numbering.

Add a tiny enhancer public/assets/toc-enhance.js for scrollspy & smooth scroll (idle-hydrated).

Add minimal CSS public/assets/toc-enhance.css only if Tailwind utilities are not present at runtime.

Component (implement exactly)
tsx
Copy code
// src/components/ModernTOC.tsx
import React from "react";

export type TOCItem = { id: string; text: string; children?: TOCItem[]; number: string };

export default function ModernTOC({
  items,
  stickyOffset = 96,
  className = "",
  collapsibleMobile = true,
}: {
  items: TOCItem[];
  stickyOffset?: number;
  className?: string;
  collapsibleMobile?: boolean;
}) {
  if (!items?.length) return null;

  const Nav = (
    <nav
      className={
        "modern-toc not-prose rounded-2xl shadow-sm ring-1 ring-black/5 p-4 md:p-5 " +
        "bg-[var(--toc-bg)] text-[var(--toc-text)] " +
        "lg:sticky lg:max-h-[calc(100vh-120px)] lg:overflow-auto " + className
      }
      style={{ top: `var(--toc-offset, ${stickyOffset}px)` } as React.CSSProperties}
      aria-label="Table of contents"
    >
      <h2 className="text-sm font-semibold tracking-wide uppercase mb-3">Table of Contents</h2>
      <ol className="space-y-1 text-[0.95rem] leading-6">{renderList(items, 0)}</ol>
    </nav>
  );

  if (!collapsibleMobile) return Nav;

  return (
    <>
      <details className="modern-toc-details md:hidden block rounded-xl overflow-hidden">
        <summary className="cursor-pointer p-3 text-sm font-medium">Table of Contents</summary>
        <div className="p-0">{Nav}</div>
      </details>
      <div className="hidden md:block">{Nav}</div>
    </>
  );
}

function renderList(items: TOCItem[], depth: number) {
  return items.map((it) => (
    <li key={it.id}>
      <a
        className={
          "block px-2 py-1 rounded hover:underline " +
          (depth === 0 ? "font-medium" : depth === 1 ? "text-sm opacity-90" : "text-sm opacity-80")
        }
        href={`#${it.id}`}
        data-active="false"
      >
        {it.number} {it.text}
      </a>
      {it.children?.length ? (
        <ol className="mt-1 ml-4 border-l pl-3 space-y-1">{renderList(it.children, depth + 1)}</ol>
      ) : null}
    </li>
  ));
}
Helpers (generate IDs + nested tree)
ts
Copy code
// src/lib/toc.ts
export type Node = { id: string; text: string; level: number };
export type TOCItem = { id: string; text: string; children: TOCItem[]; number: string };

export const slugify = (s: string) =>
  (s || "section")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

export function headingsToTOC(headings: Array<{ id?: string; text: string; level: number }>): TOCItem[] {
  const seen = new Set<string>();
  // ensure ids
  headings.forEach((h) => {
    if (!h.id) {
      let base = slugify(h.text);
      let id = base, i = 2;
      while (seen.has(id)) id = `${base}-${i++}`;
      h.id = id;
    }
    seen.add(h.id!);
  });

  const min = Math.min(...headings.map(h => h.level));
  const root: TOCItem[] = [];
  const stack: Array<{ level: number; children: TOCItem[] }> = [{ level: min - 1, children: root }];

  headings.forEach((h) => {
    while (stack.length && h.level <= stack[stack.length - 1].level) stack.pop();
    const item: TOCItem = { id: h.id!, text: h.text, children: [], number: "" };
    stack[stack.length - 1].children.push(item);
    stack.push({ level: h.level, children: item.children });
  });

  const nums: number[] = [];
  (function numberize(arr: TOCItem[], depth = 0) {
    let i = 1;
    for (const it of arr) {
      nums[depth] = i++;
      it.number = nums.slice(0, depth + 1).join(".");
      numberize(it.children, depth + 1);
    }
  })(root);
  return root;
}
Enhancement JS + minimal CSS (if Tailwind missing)
public/assets/toc-enhance.js — IntersectionObserver scrollspy & smooth scroll. It only toggles data-active attribute (no layout shifts). Hydrate on idle.

public/assets/toc-enhance.css — only if Tailwind utilities aren’t globally available; include tiny, scoped rules identical to the vars in the Design Spec.

Wire-up
Replace the old ToC component usage (where “Hide ToC / Show ToC” is implemented) with:

tsx
Copy code
import ModernTOC from "@/components/ModernTOC";
import { headingsToTOC } from "@/lib/toc";

// get headings (H2–H4) from the article body/MDX HTML
const items = headingsToTOC(headings); // build elsewhere from content HTML
<ModernTOC items={items} stickyOffset={96} collapsibleMobile />
Delete or disable the previous “Hide ToC” button logic that left an empty white container. It must not exist anymore.

Load toc-enhance.js (and css if needed) once from your app shell (e.g., in _app.tsx or a layout file) with defer and requestIdleCallback.

2B) WordPress Track (if WordPress renders the ToC)
Add theme assets:

wp-content/themes/<active>/assets/modern-toc.css

wp-content/themes/<active>/assets/modern-toc.js
(contents follow the Design Spec; same classes as React track).

Enqueue conditionally in functions.php:

php
Copy code
function modern_toc_enqueue() {
  if (is_admin() || !is_singular()) return;
  $dir = get_stylesheet_directory(); $uri = get_stylesheet_directory_uri();
  wp_enqueue_style('modern-toc', $uri . '/assets/modern-toc.css', [], '1.0');
  wp_enqueue_script('modern-toc', $uri . '/assets/modern-toc.js', [], '1.0', true);
  add_filter('script_loader_tag', function($tag,$h){ return $h==='modern-toc' ? str_replace('<script ','<script defer ',$tag) : $tag; },10,2);
}
add_action('wp_enqueue_scripts','modern_toc_enqueue',20);
Enhancer behavior (modern-toc.js):

Locate existing container (.ez-toc-container, .lwptoc, .aioseo-table-of-contents, nav#toc_container, .toc, .toc-container).

Measure current height and set as min-height before altering markup to avoid CLS.

Parse the post’s H2–H4, add missing IDs, build nested numbered list, and replace the inner HTML with the modern <nav> structure. Insert a <details> collapsible copy for mobile directly above it.

Remove/disable any “Hide ToC / Show ToC” button that clears the list but leaves white box.

Add scrollspy using IntersectionObserver (toggle data-active only).

3) Styles (shared)
Apply these core classes (Tailwind style utilities can be real Tailwind or replicated in small CSS):

Container: modern-toc not-prose rounded-2xl shadow-sm ring-1 ring-black/5 p-4 md:p-5 bg-[var(--toc-bg)] text-[var(--toc-text)] lg:sticky lg:max-h-[calc(100vh-120px)] lg:overflow-auto

Title: text-sm font-semibold tracking-wide uppercase mb-3

Link (level 1/2/3): block px-2 py-1 rounded hover:underline, with depth-based styles (font-medium → text-sm opacity-90 → text-sm opacity-80)

Sublist: mt-1 ml-4 border-l pl-3 space-y-1

Active: [data-active="true"] { font-weight:600; border-left:2px solid var(--toc-accent); padding-left:.25rem; }

4) Verification (MANDATORY)
After implementing, prove it works.

Produce DOM snapshot of the ToC container BEFORE and AFTER (outerHTML). Show that:

The list is an <ol> with nested <ol> for H3/H4.

Each link has href="#id" and text like 1.2 Subtitle.

The container no longer contains the old “Hide ToC / Show ToC” toggle.

Take and print a Lighthouse run (desktop) on the article page (only ToC change):

Confirm Performance score unchanged or improved.

Confirm CLS = 0 for the page or unchanged from baseline.

Log bundle sizes of added assets (gzipped).

Include screenshots or text output that scrollspy toggles data-active while scrolling.

5) Acceptance Criteria (must pass)
✅ Modern card UI (no white mismatch), dark/light aware.

✅ Proper hierarchy (H2/H3/H4) with numbering.

✅ Mobile collapsible <details>, desktop sticky with offset 96px.

✅ No leftover “Hide ToC / Show ToC” that empties the box.

✅ SEO-friendly server output (links exist without JS).

✅ Zero CWV regression (CLS unchanged; LCP/INP not worse).

✅ JS ≤ 6 KB gz, CSS ≤ 3 KB gz; loaded with defer/idle.

If anything in the repo makes this ambiguous, show the discovered file paths and DOM snapshot first, then apply the correct track and proceed.

css
Copy code

If Codex still can’t find the right place, have it paste the “BEFORE” DOM snippet it finds so I can tailor the selectors exactly.






