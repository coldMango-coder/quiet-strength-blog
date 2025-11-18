# Break-Glass ToC Modernization (React in-place)

**Non-negotiable:** Do **not** degrade Core Web Vitals (LCP, CLS, INP). Only equal or better.  
No render-blocking assets, no new fonts, zero CLS. Keep changes scoped to ToC only.

---

## 1) Find what actually renders the ToC
1. Grep the repo and print matching files + lines for all of:
   - `.qs-toc`, `Table of Contents`, `Hide ToC`, `Show ToC`, `toc`, `list-view`.
2. Pick the component that **renders the sidebar ToC** (the one with `.qs-toc`).  
   **Print its absolute path and full file contents BEFORE edits.**
3. Start the dev server (or render the target article page).  
   **Dump the outerHTML of the element with `.qs-toc` BEFORE edits.**  
   If `.qs-toc` does not exist, find the element that visually holds the ToC and print its outerHTML.

> If you cannot find the renderer, stop and print “RENDERER NOT FOUND” with the list of candidates.

---

## 2) Replace the renderer with a modern, hierarchical ToC (remove old Hide/Show)
- Create `src/components/ModernTOC.tsx` (or `.jsx` if no TS) with the exact component below.
- Replace usage in the real sidebar component (e.g., `src/components/TableOfContents.(js|tsx)`):  
  **Delete any Hide/Show logic** that empties the list or leaves a blank box. Mount `<ModernTOC />` inside the same wrapper to preserve layout (no CLS).

```tsx
// src/components/ModernTOC.tsx
import React, { useEffect, useMemo, useState } from "react";
type TOCItem = { id: string; text: string; level: number; children: TOCItem[]; number: string };

const slugify = (s: string) =>
  (s || "section").toLowerCase().normalize("NFKD")
  .replace(/[^\w\s-]/g,"").trim().replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,"") || "section";

function buildTree(headings: Array<{ id?: string; text: string; level: number }>): TOCItem[] {
  const seen = new Set<string>();
  headings.forEach(h => { if (!h.id){ let b=slugify(h.text), id=b, i=2; while(seen.has(id)) id=`${b}-${i++}`; h.id=id; } seen.add(String(h.id)); });
  const min = Math.min(...headings.map(h=>h.level)), root: TOCItem[] = [];
  const stack: Array<{ level:number; children:TOCItem[] }> = [{ level:min-1, children:root }];
  headings.forEach(h=>{ while(stack.length && h.level<=stack[stack.length-1].level) stack.pop();
    const it: TOCItem={ id:String(h.id), text:h.text, level:h.level, children:[], number:"" };
    stack[stack.length-1].children.push(it); stack.push({ level:h.level, children:it.children });
  });
  const nums:number[]=[]; (function num(a:TOCItem[],d=0){ let i=1; for(const it of a){ nums[d]=i++; it.number=nums.slice(0,d+1).join("."); num(it.children,d+1);} })(root);
  return root;
}

function renderList(items: TOCItem[], depth=0): React.ReactNode {
  return items.map(it=>(
    <li key={it.id}>
      <a className={"block px-2 py-1 rounded hover:underline " + (depth===0?"font-medium":depth===1?"text-sm opacity-90":"text-sm opacity-80")}
         href={`#${it.id}`} data-active="false">{it.number} {it.text}</a>
      {it.children?.length ? <ol className="mt-1 ml-4 border-l pl-3 space-y-1">{renderList(it.children, depth+1)}</ol> : null}
    </li>
  ));
}

export default function ModernTOC({ stickyOffset=96, collapsibleMobile=true }:{stickyOffset?:number; collapsibleMobile?:boolean;}){
  const [items,setItems]=useState<TOCItem[]>([]);
  useEffect(()=>{ const hs = Array.from(document.querySelectorAll("h2, h3, h4")) as HTMLElement[];
    if(!hs.length) return;
    const data = hs.map(h=>{ if(!h.id){ let b=slugify(h.textContent||""), id=b, i=2; while(document.getElementById(id)) id=`${b}-${i++}`; h.id=id; }
      return { id:h.id, text:(h.textContent||"").trim(), level:parseInt(h.tagName.substring(1),10) };
    });
    setItems(buildTree(data));
  },[]);
  const Nav = useMemo(()=> !items.length?null:(
    <nav className="modern-toc not-prose rounded-2xl shadow-sm ring-1 ring-black/5 p-4 md:p-5 bg-[var(--toc-bg)] text-[var(--toc-text)] lg:sticky lg:max-h-[calc(100vh-120px)] lg:overflow-auto"
         style={{ top:`var(--toc-offset, ${stickyOffset}px)` } as React.CSSProperties} aria-label="Table of contents">
      <h2 className="text-sm font-semibold tracking-wide uppercase mb-3">Table of Contents</h2>
      <ol className="space-y-1 text-[0.95rem] leading-6">{renderList(items)}</ol>
    </nav>
  ),[items,stickyOffset]);
  if(!items.length) return null;
  return collapsibleMobile ? (<>
    <details className="md:hidden modern-toc-details rounded-xl overflow-hidden">
      <summary className="cursor-pointer p-3 text-sm font-medium">Table of Contents</summary>
      <div className="p-0">{Nav}</div>
    </details>
    <div className="hidden md:block">{Nav}</div>
  </>) : Nav;
}
Replace usage (example):

jsx
Copy code
// src/components/TableOfContents.js  (or .tsx)
import ModernTOC from "./ModernTOC";
export default function TableOfContents(){ return <aside className="qs-toc"><ModernTOC stickyOffset={96} collapsibleMobile /></aside>; }
Remove any legacy Hide/Show button and any logic that empties the list or leaves a blank container.

3) Minimal globals (already present? then skip)
Add once to global CSS:

css
Copy code
:root{ --toc-bg: color-mix(in oklab, Canvas, var(--wp--preset--color--primary, #4f46e5) 6%);
       --toc-accent: var(--wp--preset--color--primary, #4f46e5);
       --toc-text: var(--wp--preset--color--foreground, #0b1020); }
@media (prefers-color-scheme: dark){ :root{ --toc-bg: color-mix(in oklab, Canvas, var(--wp--preset--color--primary, #818cf8) 14%);
       --toc-text: var(--wp--preset--color--foreground, #e5e7eb); } }
.modern-toc a[data-active="true"]{ font-weight:600; border-left:2px solid var(--toc-accent); padding-left:.25rem; }
Add tiny idle scroll-spy once (e.g., in layout or _app):

html
Copy code
<script defer>
 (window.requestIdleCallback||function(cb){setTimeout(cb,1)})(function(){
  try{
    if (matchMedia('(prefers-reduced-motion: no-preference)').matches) document.documentElement.style.scrollBehavior='smooth';
    var nav=document.querySelector('.modern-toc'); if(!nav||!('IntersectionObserver' in window))return;
    var map=new Map(); nav.querySelectorAll('a[href^="#"]').forEach(a=>{var id=decodeURIComponent(a.getAttribute('href').slice(1));var el=document.getElementById(id);if(el)map.set(el,a);});
    var io=new IntersectionObserver(es=>{es.forEach(e=>{var a=map.get(e.target); if(a) a.setAttribute('data-active', e.isIntersecting?'true':'false');});},{rootMargin:'0px 0px -70% 0px',threshold:0.01});
    map.forEach((_,el)=>io.observe(el));
  }catch(e){}
 });
</script>
4) Remove enhancers that skip .qs-toc
If public/assets/toc-enhance.js exists and skips .qs-toc, delete that guard or remove the file. Show the diff or deletion.

5) Prove it worked (fail if not)
After edits, print the path and new contents of the ToC component you modified.

Dump the outerHTML of .qs-toc AFTER edits. It must contain:

<nav class="modern-toc …"> and a <h2>Table of Contents</h2>.

A nested <ol> structure with numbered text (e.g., 1., 1.1).

No Hide/Show button.

Report added JS/CSS gzipped sizes (they should be tiny) and a Lighthouse desktop run for one article page, confirming:

Performance score unchanged or higher.

CLS unchanged (preferably 0).

If any check fails, stop and fix; do not claim success until the AFTER snapshot matches the criteria.

java
Copy code

**How to run (short CLI):**
```bash
codex run --read toc-breakglass-inplace.md --no-cwv-degrade