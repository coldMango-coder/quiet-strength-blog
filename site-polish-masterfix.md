# Master Fix Pack — Global author name, non-overlapping cards, restored author photo, better article images on mobile, and tidy latest-posts list
**Hard rule:** Do **not** degrade Core Web Vitals (LCP, CLS, INP).  
- No render-blocking CSS/JS.  
- Prefer CSS/layout changes; any JS must be idle-hydrated.  
- Images must include width/height (or aspect-ratio) to avoid CLS.  
- All fixes must work on **mobile and desktop**.

---

## A) Author name must be “Marica Šinko” on *every* article (build-time + render-time)

### A1. Build-time global fix (run before build)
Create `scripts/fix-author-encoding.mjs`:

```js
// node scripts/fix-author-encoding.mjs
import fs from "fs";
import path from "path";

const roots = ["content", "posts", "src", "public", "data"];
const exts = /\.(mdx?|ya?ml|json|js|jsx|ts|tsx|html)$/i;

const patterns = [
  /Marica\s*A\u030A\s*inko/gi,   // A + ring combining
  /Marica\s*Å\s*inko/gi,         // Å + optional space/nbsp
  /Marica\s*Å&nbsp;inko/gi,
  /Marica\s*S\u030C?inko/gi,     // S + caron combining (or plain S)
  /Marica\s*Sinko\b/gi
];

function fix(txt){
  let s = txt.normalize("NFC");
  for(const p of patterns) s = s.replace(p, "Marica Šinko");
  // also fix stray last name occurrences
  s = s.replace(/\bŠinko\b/gi, "Šinko");
  return s;
}

function walk(dir){
  for(const e of fs.readdirSync(dir, { withFileTypes:true })){
    const p = path.join(dir, e.name);
    if(e.isDirectory()) walk(p);
    else if(exts.test(e.name)){
      const raw = fs.readFileSync(p, "utf8");
      const fixed = fix(raw);
      if(fixed !== raw){ fs.writeFileSync(p, fixed, "utf8"); console.log("Fixed:", p); }
    }
  }
}

for(const r of roots) if(fs.existsSync(r)) walk(r);
console.log("✅ Author strings fixed to 'Marica Šinko' across sources.");
Add to package.json:

json
Copy code
{
  "scripts": {
    "prebuild": "node scripts/fix-author-encoding.mjs",
    "build": "YOUR_EXISTING_BUILD_COMMAND"
  }
}
A2. Render-time safety (lightweight)
src/lib/content/normalizeAuthor.js:

js
Copy code
export const normalizeAuthor = (name="") =>
  name.normalize("NFC")
      .replace(/A\u030A\s*inko/gi,"Šinko")
      .replace(/Å\s*inko/gi,"Šinko")
      .replace(/\bSinko\b/gi,"Šinko")
      .replace(/Marica\s+Šinko/i,"Marica Šinko");
Use in the byline component:

jsx
Copy code
import { normalizeAuthor } from "@/lib/content/normalizeAuthor";
const safeName = normalizeAuthor(authorName || "Marica Šinko");
A3. Charset guard (only if missing)
Ensure <meta charSet="utf-8" /> in the base HTML / _document.tsx.

Verification to print: grep results changed by the script; outerHTML of the byline on 3 random articles showing By Marica Šinko.

B) Category/archive post cards overlapping — convert to stable grid
B1. Find the archive grid component
Search for page components that render category/archive lists (e.g., CategoryPage, ArchiveGrid, PostsGrid). Print the path and JSX.

B2. Replace wrapper & card styles (Tailwind)
Wrapper:

jsx
Copy code
<div className="archive-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
  {posts.map(p => (
    <article key={p.slug} className="post-card h-full flex flex-col rounded-2xl ring-1 ring-black/5 bg-white p-5 shadow-sm">
      {/* image, meta, title, excerpt, footer */}
    </article>
  ))}
</div>
Card image (inside post-card):

jsx
Copy code
<a href={p.href} className="block mb-3 rounded-xl overflow-hidden">
  <img
    src={p.image} alt={p.imageAlt || p.title}
    loading="lazy" decoding="async"
    className="w-full h-auto aspect-[16/9] object-cover"
    width="800" height="450" />
</a>
Title/excerpt (limit lines):

jsx
Copy code
<h3 className="text-lg font-semibold leading-snug line-clamp-2">{p.title}</h3>
<p className="mt-2 text-sm text-black/70 line-clamp-3">{p.excerpt}</p>
If not using Tailwind, append fallback CSS:

css
Copy code
.archive-grid{ display:grid; grid-template-columns:repeat(1,minmax(0,1fr)); gap:1.5rem; width:100%; }
@media (min-width:768px){ .archive-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (min-width:1024px){ .archive-grid{ grid-template-columns:repeat(3,minmax(0,1fr)); } }
.post-card{ display:flex; flex-direction:column; height:100%; position:static; margin:0; }
.post-card img{ width:100%; height:auto; aspect-ratio:16/9; object-fit:cover; display:block; }
.line-clamp-2{ display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.line-clamp-3{ display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
Remove any negative margins, position:absolute/fixed, or inner overflow:auto on grid/cards.
Verify: computed display:grid, non-zero gap, and cards position:static.

C) Author photo on home page disappeared — restore with fallback
Find the homepage “About/Author” block (e.g., HomeHero, AuthorCard).

Ensure the image import/path is correct.

Add a reliable fallback image and explicit dimensions to prevent CLS.

jsx
Copy code
import authorFallback from "@/assets/author.jpg"; // place image under /public or /src/assets

<img
  src={author?.photo || authorFallback}
  alt="Marica Šinko — portrait"
  width="320" height="320"
  className="rounded-full object-cover w-40 h-40 md:w-56 md:h-56"
  loading="lazy" decoding="async"
/>
If the image is coming from CMS and sometimes empty, gate with:

jsx
Copy code
const avatar = author?.photo?.trim() ? author.photo : authorFallback;
D) Category cards on home page are too small — make them readable at all sizes
Find the “Our Core Self-Help Themes” grid component and increase card size with responsive min-heights & typography.

Wrapper:

jsx
Copy code
<div className="themes-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
  {/* cards */}
</div>
Card:

jsx
Copy code
<article className="theme-card h-full min-h-[260px] md:min-h-[300px] flex flex-col rounded-2xl ring-1 ring-black/5 bg-white/90 p-6 shadow-sm">
  <header className="mb-3 flex items-center gap-3">
    {/* icon circle */}
    <div className="w-10 h-10 rounded-full bg-black/5 grid place-items-center"></div>
    <h3 className="text-lg md:text-xl font-semibold leading-snug">{title}</h3>
  </header>
  <p className="text-sm md:text-[15px] text-black/70 flex-1">{blurb}</p>
  <a href={href} className="mt-4 text-sm font-medium">Explore More →</a>
</article>
Fallback CSS (if no Tailwind):

css
Copy code
.theme-card{ min-height:260px; }
@media (min-width:768px){ .theme-card{ min-height:300px; } }
E) Article images on mobile are too small — make them modern & proportional
Global article content CSS (in src/index.css or globals.css), scoped to your article container (replace .post-content with yours, e.g., .prose or article):

css
Copy code
/* Scale images to container width, keep aspect, add gentle rounding */
.post-content img{
  width:100% !important;
  height:auto !important;
  display:block;
  border-radius:12px;
  object-fit:cover;
}
.post-content figure{ margin:1.25rem 0; }
.post-content figure > img{ aspect-ratio:auto; }
@media (max-width:640px){
  .post-content img{ border-radius:10px; }
}

/* Ensure captions wrap nicely */
.post-content figcaption{
  font-size:.9rem; color:rgba(0,0,0,.65); text-align:center; margin-top:.5rem;
}
If your article template constrains images (e.g., a small column), ensure the content column itself is wide enough on mobile:

css
Copy code
@media (max-width:640px){
  .post-content{ padding-left:1rem; padding-right:1rem; }
}
F) “Latest Insights” / latest posts list on home — reduce oversized blocks, professional media-list style
Find the component for the home latest posts list. Replace each item with a media object: small fixed thumb + text block with clamps.

jsx
Copy code
<li className="flex gap-3 py-3">
  <a href={p.href} className="shrink-0 rounded-lg overflow-hidden block">
    <img src={p.image} alt={p.imageAlt || p.title}
         width="120" height="120"
         className="w-[88px] h-[88px] md:w-[110px] md:h-[110px] object-cover rounded-lg"
         loading="lazy" decoding="async" />
  </a>
  <div className="min-w-0">
    <a href={p.href} className="block text-base font-semibold leading-snug line-clamp-2">{p.title}</a>
    <p className="mt-1 text-sm text-black/70 line-clamp-2">{p.excerpt}</p>
    <div className="mt-2 flex items-center gap-2 text-xs text-black/60">
      <span>{p.category}</span>
      <span>•</span>
      <time dateTime={p.dateISO}>{p.dateShort}</time>
    </div>
  </div>
</li>
Fallback CSS for clamps (if not using Tailwind):

css
Copy code
.line-clamp-2{ display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
G) Verification (must print)
Author name: list files changed by scripts/fix-author-encoding.mjs and show the byline outerHTML on 3 random articles — all show By Marica Šinko.

Archive grid: DOM/computed styles confirm display:grid, gap>0, .post-card is position:static, no overlap.

Home author photo: final img tag outerHTML with correct src, width/height.

Theme cards: min-height present; no overlap on mobile/desktop.

Article images mobile: one article DOM snippet showing .post-content img is full-width.

Latest posts list: first two items show 88–110px thumbs and clamped text.

CWV check: quick Lighthouse (desktop) for home + one article; CLS unchanged or better.
