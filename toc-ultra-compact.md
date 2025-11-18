# Ultra-Compact TOC (H2-only default) — no CWV regression

**Hard rule:** Core Web Vitals (LCP, CLS, INP) must not get worse.  
- No render-blocking assets.  
- Keep/trim JS & CSS; hydrate on `requestIdleCallback`.  
- Zero CLS (no layout jump; simple show/hide).

## What to change
Update the existing `src/components/ModernTOC.(tsx|jsx)` to:
- Build the full tree from H2–H4 (as it does now), **but render only H2 by default**.
- For each H2, show a tiny text button: **“Show topics (N)”** where N = number of H3s under that H2.
  - On click, render that H2’s H3 list (no H4s). Button becomes “Hide topics”.
- Add a small toolbar on the right: **“Expand all / Collapse all”** (toggles all H2 sections).
- Keep the existing global **Hide ToC** button.
- Remove any inner overflow scroll; TOC uses page scroll.
- Accent colors remain from CSS vars.

## Patch ModernTOC (replace file in place)

```tsx
import React, { useEffect, useMemo, useState } from "react";

type RawHeading = { id?: string; text: string; level: number };
type TOCItem = { id: string; text: string; level: number; children: TOCItem[]; number: string };

const slugify = (s: string) =>
  (s || "section").toLowerCase().normalize("NFKD")
  .replace(/[^\w\s-]/g,"").trim().replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,"") || "section";

function buildTree(headings: RawHeading[]): TOCItem[] {
  const seen = new Set<string>();
  headings.forEach(h=>{
    if(!h.id){ let b=slugify(h.text), id=b, i=2; while(seen.has(id)) id=`${b}-${i++}`; h.id=id; }
    seen.add(String(h.id));
  });
  const min = Math.min(...headings.map(h=>h.level));
  const root: TOCItem[] = [];
  const stack: Array<{ level:number; children:TOCItem[] }> = [{ level:min-1, children:root }];
  headings.forEach(h=>{
    while(stack.length && h.level <= stack[stack.length-1].level) stack.pop();
    const it: TOCItem = { id:String(h.id), text:h.text, level:h.level, children:[], number:"" };
    stack[stack.length-1].children.push(it);
    stack.push({ level:h.level, children:it.children });
  });
  const nums:number[]=[];
  (function num(arr:TOCItem[], d=0){ let i=1; for(const it of arr){ nums[d]=i++; it.number=nums.slice(0,d+1).join("."); num(it.children, d+1);} })(root);
  return root;
}

export default function ModernTOC({
  stickyOffset = 96,
  collapsibleMobile = true
}:{ stickyOffset?:number; collapsibleMobile?:boolean }) {
  const [items,setItems]=useState<TOCItem[]>([]);
  const [collapsed,setCollapsed]=useState(false);
  const [open,setOpen]=useState<Record<string,boolean>>({}); // per-H2 open state

  useEffect(()=>{
    const hs = Array.from(document.querySelectorAll("h2, h3, h4")) as HTMLElement[];
    if(!hs.length) return;
    const data: RawHeading[] = hs.map(h=>{
      if(!h.id){ let b=slugify(h.textContent||""), id=b, i=2; while(document.getElementById(id)) id=`${b}-${i++}`; h.id=id; }
      return { id:h.id, text:(h.textContent||"").trim(), level:parseInt(h.tagName.substring(1),10) };
    });
    setItems(buildTree(data));
  },[]);

  const h2s = useMemo(()=> items.map(h2 => ({ ...h2, children: h2.children })), [items]);
  const anyClosed = useMemo(()=> h2s.some(h2 => !open[h2.id]), [h2s, open]);
  const allOpen = useMemo(()=> h2s.length>0 && h2s.every(h2 => !!open[h2.id]), [h2s, open]);

  const Nav = useMemo(()=> {
    if (!h2s.length) return null;
    return (
      <nav
        className={"modern-toc not-prose rounded-2xl shadow-sm ring-1 ring-black/5 p-4 md:p-5 bg-[var(--toc-bg)] text-[var(--toc-text)] lg:sticky"}
        style={{ top: `var(--toc-offset, ${stickyOffset}px)` } as React.CSSProperties}
        aria-label="Table of contents"
        hidden={collapsed}
      >
        <div className="flex items-center justify-between mb-3 gap-3">
          <h2 className="text-sm font-semibold tracking-wide uppercase">Table of Contents</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-xs font-medium px-2 py-1 rounded border border-black/10 hover:bg-black/5"
              onClick={()=> setCollapsed(v=>!v)}
              aria-expanded={!collapsed}
              aria-controls="modern-toc-list"
            >
              {collapsed ? "Show ToC" : "Hide ToC"}
            </button>
            <button
              type="button"
              className="text-xs font-medium px-2 py-1 rounded border border-black/10 hover:bg-black/5"
              onClick={()=>{
                if (anyClosed) {
                  const next: Record<string,boolean> = {};
                  h2s.forEach(h2 => next[h2.id] = true);
                  setOpen(next);
                } else {
                  setOpen({});
                }
              }}
              aria-pressed={allOpen}
            >
              {anyClosed ? "Expand all" : "Collapse all"}
            </button>
          </div>
        </div>

        <ol id="modern-toc-list" className="space-y-1 text-[0.95rem] leading-6">
          {h2s.map(h2 => {
            const totalH3 = h2.children.length;
            const isOpen = !!open[h2.id];
            return (
              <li key={h2.id} className="group">
                <div className="flex items-start justify-between gap-2">
                  <a
                    className="block px-2 py-1 rounded hover:underline font-medium text-[var(--toc-link)]"
                    href={`#${h2.id}`}
                    data-active="false"
                  >
                    {h2.number} {h2.text}
                  </a>
                  {totalH3 > 0 && (
                    <button
                      type="button"
                      className="text-[11px] underline opacity-80 mt-1 shrink-0"
                      onClick={() => setOpen(s => ({ ...s, [h2.id]: !s[h2.id] }))}
                      aria-expanded={isOpen}
                    >
                      {isOpen ? "Hide topics" : `Show topics (${totalH3})`}
                    </button>
                  )}
                </div>

                {isOpen && (
                  <ol className="mt-1 ml-4 border-l pl-3 space-y-1">
                    {h2.children.map(h3 => (
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
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }, [h2s, open, collapsed, stickyOffset, anyClosed, allOpen]);

  if (!items.length) return null;

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
CSS (tiny; only if not present)
Ensure these exist once in your global stylesheet:

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
.modern-toc a[data-active="true"]{
  font-weight:600; border-left:2px solid var(--toc-accent); padding-left:.25rem; color: var(--toc-accent);
}