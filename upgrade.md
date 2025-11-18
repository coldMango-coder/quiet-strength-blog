# Task: Replace the existing React Table of Contents with a modern, hierarchical, SEO-friendly version (in place)

## Absolute rule on performance
**Do not lower existing Core Web Vitals (LCP, CLS, INP).**  
Changes must be equal or better. Enforce: no render-blocking assets, `defer`/idle JS only, zero layout shift, keep or reduce JS/CSS size.

---

## What you must do (in order)

### 1) Find the real ToC component and prove it
- Search the repo for the ToC component that renders the container with the class **`.qs-toc`** or the heading “Table of Contents”.
- It’s likely at `src/components/TableOfContents.js/tsx` or a nearby file.
- **Print the full absolute path** to the file you will modify and **show the current file contents**.
- Run the dev server on a local article page (or render the page HTML) and **capture a DOM snapshot** of the ToC container (the outerHTML of the element with `.qs-toc`), **BEFORE** any changes. Paste it.

> If you cannot find `.qs-toc`, search for: `Table of Contents`, `toc`, `Hide ToC`, `Show ToC`.

---

### 2) Replace the ToC implementation (React) — remove the buggy Hide/Show
**Goal:** The ToC must be a modern card with clear hierarchy (H2→H3→H4), numbered items, scroll-spy highlight, sticky on desktop, collapsible on mobile, and no “Hide/Show” button that blanks content or leaves a white box.

#### 2.1 Create a new component
Create `src/components/ModernTOC.tsx` with **exactly** this implementation (TypeScript; if the project is JS, create `.jsx` and strip types):

```tsx
import React, { useEffect, useMemo, useState } from "react";

type TOCItem = { id: string; text: string; level: number; children: TOCItem[]; number: string };

const slugify = (s: string) =>
  (s || "section")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

function buildTree(headings: Array<{ id?: string; text: string; level: number }>): TOCItem[] {
  const seen = new Set<string>();
  headings.forEach(h => {
    if (!h.id) {
      let base = slugify(h.text), id = base, i = 2;
      while (seen.has(id)) id = `${base}-${i++}`;
      h.id = id;
    }
    seen.add(String(h.id));
  });

  const min = Math.min(...headings.map(h => h.level));
  const root: TOCItem[] = [];
  const stack: Array<{ level: number; children: TOCItem[] }> = [{ level: min - 1, children: root }];

  headings.forEach(h => {
    while (stack.length && h.level <= stack[stack.length - 1].level) stack.pop();
    const item: TOCItem = { id: String(h.id), text: h.text, level: h.level, children: [], number: "" };
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

function renderList(items: TOCItem[], depth = 0): React.ReactNode {
  return items.map(it => (
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

export default function ModernTOC({
  stickyOffset = 96,
  collapsibleMobile = true,
  source = "dom", // "dom" = read headings from the document; or pass in via props (future)
  headings,
}: {
  stickyOffset?: number;
  collapsibleMobile?: boolean;
  source?: "dom";
  headings?: Array<{ id?: string; text: string; level: number }>;
}) {
  const [items, setItems] = useState<TOCItem[]>([]);

  // Build from DOM (H2–H4) so we work even if content is static HTML
  useEffect(() => {
    if (source !== "dom") return;
    const hs = Array.from(document.querySelectorAll("h2, h3, h4")) as HTMLElement[];
    if (!hs.length) return;
    // ensure IDs exist for anchors
    const data = hs.map(h => {
      if (!h.id) {
        let base = slugify(h.textContent || "");
        let id = base, i = 2;
        while (document.getElementById(id)) id = `${base}-${i++}`;
        h.id = id;
      }
      return { id: h.id, text: (h.textContent || "").trim(), level: parseInt(h.tagName.substring(1), 10) };
    });
    setItems(buildTree(data));
  }, [source]);

  const Nav = useMemo(() => {
    if (!items.length) return null;
    return (
      <nav
        className="modern-toc not-prose rounded-2xl shadow-sm ring-1 ring-black/5 p-4 md:p-5 bg-[var(--toc-bg)] text-[var(--toc-text)] lg:sticky lg:max-h-[calc(100vh-120px)] lg:overflow-auto"
        style={{ top: `var(--toc-offset, ${stickyOffset}px)` } as React.CSSProperties}
        aria-label="Table of contents"
      >
        <h2 className="text-sm font-semibold tracking-wide uppercase mb-3">Table of Contents</h2>
        <ol className="space-y-1 text-[0.95rem] leading-6">{renderList(items)}</ol>
      </nav>
    );
  }, [items, stickyOffset]);

  if (!items.length) return null;

  return collapsibleMobile ? (
    <>
      <details className="md:hidden modern-toc-details rounded-xl overflow-hidden">
        <summary className="cursor-pointer p-3 text-sm font-medium">Table of Contents</summary>
        <div className="p-0">{Nav}</div>
      </details>
      <div className="hidden md:block">{Nav}</div>
    </>
  ) : (
    Nav
  );
}
2.2 Replace usage of the old component
Open the existing ToC component that renders the .qs-toc container and the “Hide ToC / Show ToC” toggle.

Remove the toggle logic that empties the list or leaves an empty box.

Mount ModernTOC directly inside the same sidebar/aside where the ToC lived, keeping the same layout container to avoid CLS.

Example replacement in src/components/TableOfContents.js (adjust import/paths as needed):

jsx
Copy code
import ModernTOC from "./ModernTOC";

export default function TableOfContentsSidebar() {
  return (
    <aside className="qs-toc">
      <ModernTOC stickyOffset={96} collapsibleMobile />
    </aside>
  );
}
Important: do not keep any previous “Hide/Show ToC” button or conditional that renders an empty container.

2.3 Small CSS variables (global)
Ensure these CSS variables exist once (e.g., in your global stylesheet or layout):

css
Copy code
:root{
  --toc-bg: color-mix(in oklab, Canvas, var(--wp--preset--color--primary, #4f46e5) 6%);
  --toc-accent: var(--wp--preset--color--primary, #4f46e5);
  --toc-text: var(--wp--preset--color--foreground, #0b1020);
}
@media (prefers-color-scheme: dark){
  :root{ --toc-bg: color-mix(in oklab, Canvas, var(--wp--preset--color--primary, #818cf8) 14%); --toc-text: var(--wp--preset--color--foreground, #e5e7eb); }
}
.modern-toc a[data-active="true"]{ font-weight:600; border-left:2px solid var(--toc-accent); padding-left:.25rem; }
2.4 Scrollspy & smooth scroll (tiny, idle-hydrated)
Add this once to your app shell (or keep your existing enhancer but remove any guard that skps .qs-toc):

html
Copy code
<script defer>
  (window.requestIdleCallback || function(cb){setTimeout(cb,1);})(function(){
    try{
      if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        document.documentElement.style.scrollBehavior = 'smooth';
      }
      var nav = document.querySelector('.modern-toc');
      if (!nav || !('IntersectionObserver' in window)) return;
      var map = new Map();
      nav.querySelectorAll('a[href^="#"]').forEach(a=>{
        var id = decodeURIComponent(a.getAttribute('href').slice(1));
        var el = document.getElementById(id);
        if (el) map.set(el, a);
      });
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          var a = map.get(e.target);
          if (a) a.setAttribute('data-active', e.isIntersecting ? 'true' : 'false');
        });
      }, { rootMargin: '0px 0px -70% 0px', threshold: 0.01 });
      map.forEach(function(_a, el){ io.observe(el); });
    }catch(e){}
  });
</script>
3) Remove the enhancer safety that skips .qs-toc
If you previously added public/assets/toc-enhance.js with a “safety” that does not modify .qs-toc, delete that guard or remove the file entirely (since the ToC is now rendered correctly by React).
Show the diff for that file or confirm it was deleted.

4) Verify & prove (mandatory)
DOM Snapshot After: print the new outerHTML of the .qs-toc area. It must contain:

<nav class="modern-toc …"> with a <h2>Table of Contents</h2>.

A nested <ol> structure with numbered text: 1., 1.1, 1.1.1.

No “Hide ToC / Show ToC” button.

CLS guard: log the ToC container height before and after mount to confirm no layout shift (same height or higher with reserved min-height).

Bundle size: report the added JS and CSS gzipped sizes (should be tiny).

Lighthouse (desktop) on one article page:

Performance score must be unchanged or higher.

CLS must be unchanged (ideally 0).

Report the numbers.

5) Output at the end
Modified file paths.

Full contents of src/components/ModernTOC.tsx and the updated ToC entry file.

Before/After DOM snapshots.

Lighthouse numbers and bundle sizes.

If anything prevents in-place replacement (e.g., the ToC is hard-coded in Markdown), print the exact reason and file, then fall back to DOM-built ToC as implemented above. Do not leave the old Hide/Show behavior.

pgsql
Copy code

This makes Codex stop “enhancing around” your ToC and instead **replaces the component 