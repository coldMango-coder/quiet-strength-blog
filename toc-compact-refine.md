# Compact Modern TOC — shorten, colorize, add Hide/Show (no CWV regression)

**Hard rule:** Existing Core Web Vitals (LCP, CLS, INP) must not get worse.  
- No render-blocking assets.  
- Keep JS tiny; reuse existing component.  
- No layout shift: hide/show is pure collapse (height transition optional, but default to none).

---

## Change Summary
1) **Shorter structure**: show **H2 and (optionally) up to 3 H3 per H2** by default. The rest are hidden behind a per-section “Show more” link. (Depth limit and per-section limit are props.)  
2) **Remove inner scrollbar**: keep sticky, **no max-height/overflow** on the nav.  
3) **Add accent color** to link text and active item.  
4) **Add a Hide/Show ToC button** (collapses the whole nav without leaving an empty white box).  
5) Keep the existing mobile `<details>` wrapper.

---

## Edit `src/components/ModernTOC.tsx` (or `.jsx`) in place

**Replace** the current file with the version below (TypeScript; drop types if using JS):

```tsx
import React, { useEffect, useMemo, useState } from "react";

type RawHeading = { id?: string; text: string; level: number };
type TOCItem = { id: string; text: string; level: number; children: TOCItem[]; number: string };

const slugify = (s: string) =>
  (s || "section")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

function buildTree(headings: RawHeading[]): TOCItem[] {
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
    const it: TOCItem = { id: String(h.id), text: h.text, level: h.level, children: [], number: "" };
    stack[stack.length - 1].children.push(it);
    stack.push({ level: h.level, children: it.children });
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

// Limit depth and number of H3 children per H2
function compactTree(items: TOCItem[], maxDepth = 2, maxChildrenPerH2 = 3) {
  if (maxDepth <= 1) {
    return items.map(h2 => ({ ...h2, children: [] }));
  }
  return items.map(h2 => {
    const limited = h2.children.slice(0, maxChildrenPerH2);
    return { ...h2, children: limited.map(h3 => ({ ...h3, children: [] })) };
  });
}

export default function ModernTOC({
  stickyOffset = 96,
  collapsibleMobile = true,
  maxDepth = 2,            // H2 + H3 (default)
  maxChildrenPerH2 = 3     // show at most 3 H3 per H2
}: {
  stickyOffset?: number;
  collapsibleMobile?: boolean;
  maxDepth?: 1 | 2 | 3;
  maxChildrenPerH2?: number;
}) {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [expandedH2, setExpandedH2] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const hs = Array.from(document.querySelectorAll("h2, h3, h4")) as HTMLElement[];
    if (!hs.length) return;
    const data: RawHeading[] = hs.map(h => {
      if (!h.id) {
        let base = slugify(h.textContent || ""), id = base, i = 2;
        while (document.getElementById(id)) id = `${base}-${i++}`;
        h.id = id;
      }
      return { id: h.id, text: (h.textContent || "").trim(), level: parseInt(h.tagName.substring(1), 10) };
    });
    setItems(buildTree(data));
  }, []);

  const compact = useMemo(
    () => compactTree(items, maxDepth, maxChildrenPerH2),
    [items, maxDepth, maxChildrenPerH2]
  );

  const Nav = useMemo(() => {
    if (!compact.length) return null;
    return (
      <nav
        className={
          // removed lg:max-h and lg:overflow-auto -> no ugly inner scrollbar
          "modern-toc not-prose rounded-2xl shadow-sm ring-1 ring-black/5 p-4 md:p-5 " +
          "bg-[var(--toc-bg)] text-[var(--toc-text)] lg:sticky"
        }
        style={{ top: `var(--toc-offset, ${stickyOffset}px)` } as React.CSSProperties}
        aria-label="Table of contents"
        hidden={collapsed}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold tracking-wide uppercase">Table of Contents</h2>
          <button
            type="button"
            className="text-xs font-medium px-2 py-1 rounded border border-black/10 hover:bg-black/5"
            onClick={() => setCollapsed(v => !v)}
            aria-expanded={!collapsed}
            aria-controls="modern-toc-list"
          >
            {collapsed ? "Show ToC" : "Hide ToC"}
          </button>
        </div>

        <ol id="modern-toc-list" className="space-y-1 text-[0.95rem] leading-6">
          {compact.map((h2) => (
            <li key={h2.id}>
              <a
                className="block px-2 py-1 rounded hover:underline font-medium text-[var(--toc-link)]"
                href={`#${h2.id}`}
                data-active="false"
              >
                {h2.number} {h2.text}
              </a>

              {/* H3 children (compact) */}
              {items.find(x => x.id === h2.id)?.children.length! > h2.children.length ? (
                <button
                  type="button"
                  className="ml-2 mt-1 text-xs underline opacity-80"
                  onClick={() => setExpandedH2(s => ({ ...s, [h2.id]: true }))}
                  hidden={!!expandedH2[h2.id]}
                >
                  Show more
                </button>
              ) : null}

              <ol className="mt-1 ml-4 border-l pl-3 space-y-1">
                {(expandedH2[h2.id] ? items.find(x => x.id === h2.id)!.children : h2.children).map(h3 => (
                  <li key={h3.id}>
                    <a
                      className="block px-2 py-1 text-sm opacity-90 hover:underline text-[var(--toc-link-muted)]"
                      href={`#${h3.id}`}
                    >
                      {h3.number} {h3.text}
                    </a>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </nav>
    );
  }, [compact, items, expandedH2, collapsed, stickyOffset]);

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
Add/Adjust global CSS variables once (if not present)
Add to your global stylesheet (no blocking, tiny):

css
Copy code
:root{
  --toc-bg: color-mix(in oklab, Canvas, var(--wp--preset--color--primary, #4f46e5) 6%);
  --toc-accent: var(--wp--preset--color--primary, #4f46e5);
  --toc-text: var(--wp--preset--color--foreground, #0b1020);
  --toc-link: color-mix(in oklab, var(--toc-text), var(--toc-accent) 35%);
  --toc-link-muted: color-mix(in oklab, var(--toc-text), var(--toc-accent) 20%);
}
@media (prefers-color-scheme: dark){
  :root{
    --toc-bg: color-mix(in oklab, Canvas, var(--wp--preset--color--primary, #818cf8) 14%);
    --toc-text: var(--wp--preset--color--foreground, #e5e7eb);
    --toc-link: color-mix(in oklab, var(--toc-text), var(--toc-accent) 45%);
    --toc-link-muted: color-mix(in oklab, var(--toc-text), var(--toc-accent) 30%);
  }
}
/* active state accent (scrollspy already toggles data-active) */
.modern-toc a[data-active="true"]{
  font-weight:600; border-left:2px solid var(--toc-accent); padding-left:.25rem;
  color: var(--toc-accent);
}
What changes visually
Shorter TOC: default shows only H2 + the first 3 H3 per H2; click “Show more” to reveal the rest for that section.

No internal scrollbar; the nav remains sticky but uses the page scroll.

Colored links for better recognition; active section uses the accent color.

Hide/Show button collapses the TOC without leaving an empty box.

Verification (Codex must print)
Path + diff of src/components/ModernTOC.tsx (or .jsx) after edit.

The .qs-toc outerHTML showing <nav class="modern-toc">… with a Hide ToC button visible.

Lighthouse quick run on one article page; confirm no CLS increase and scores unchanged or better.

arduino
Copy code

**One-liner for Codex run:**

```bash
codex run --read toc-compact-refine.md --no-cwv-degrade