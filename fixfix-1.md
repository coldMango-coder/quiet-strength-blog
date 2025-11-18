🔧 DO THESE CHANGES EXACTLY (keep CWV unchanged)
Never break CWV

Do not add render-blocking files.

Keep explicit width/height on all <img>, and keep loading="lazy" + decoding="async".

Do not change routes/slugs/content.

1) Move the first real article-body image (with its caption) to lead position on every post

Why your current code fails: it queries the whole document, so it can see the header logo. It also doesn’t validate the candidate image. You must only look inside the article body and reject logos/icons/avatars/tiny placeholders.

Files

src/pages/BlogPostPage.js (or the component that renders a single post)

src/styles/theme-additions.css (or append to the last-loaded CSS)

1A) Replace your current image-moving effect with this one
import { useEffect } from "react";

useEffect(() => {
  try {
    // 1) Scope: find the ARTICLE BODY only (never header/footer/nav/sidebars)
    const article =
      document.querySelector("article.single, article.post, article") ||
      document.querySelector(".single-post, .post");
    const body =
      (article && article.querySelector(".post-content, .entry-content, .prose, .content")) ||
      document.querySelector(".post-content, .entry-content, .prose, .content");

    if (!body) return;

    // 2) Key landmarks
    const h1   = document.querySelector("h1");
    const meta = document.querySelector(".post-meta") || h1?.nextElementSibling;
    const toc  = document.querySelector("#toc, .toc-shell, .table-of-contents");

    if (!h1 || !meta) return;

    // 3) Strict filter helpers
    const badContainers = new Set([
      "header","nav","footer","aside",
      ".site-header",".site-logo",".logo",".brand",".nav",".menu",".sidebar",".hero",
      ".author",".author-card",".about",".latest",".related",
      "#toc",".toc-shell",".table-of-contents",".lead-figure"
    ]);

    const isInsideBadContainer = (el) => {
      for (const sel of badContainers) { if (el.closest(sel)) return true; }
      return false;
    };

    const isGoodImg = (img) => {
      if (!img || img.tagName !== "IMG") return false;
      const src = (img.getAttribute("src") || "").trim();
      if (!src || src === "#") return false;
      if (/logo|icon|emoji|avatar|badge/i.test(img.className + " " + (img.alt || ""))) return false;
      if (src.startsWith("data:image/")) return false;               // placeholders
      if (/\.(svg|gif)(\?|$)/i.test(src)) return false;              // avoid svg/gif
      const w = parseInt(img.getAttribute("width")  || img.naturalWidth  || "0", 10);
      const h = parseInt(img.getAttribute("height") || img.naturalHeight || "0", 10);
      // must be a real photo-ish size (prevents logos/tiny icons)
      if (w < 300 || h < 180) return false;
      return true;
    };

    // 4) Find the FIRST usable figure within the BODY only
    const nodes = [
      ...body.querySelectorAll("figure:has(img)"),
      ...body.querySelectorAll(":not(figure) > img") // bare imgs
    ];

    let firstFigure = null;
    for (const node of nodes) {
      const fig = node.tagName === "FIGURE" ? node : (() => { const f=document.createElement("figure"); node.before(f); f.appendChild(node); return f; })();
      const img = fig.querySelector("img");

      if (isInsideBadContainer(fig))         { fig.replaceWith(...fig.childNodes); continue; }
      if (!isGoodImg(img))                   { fig.replaceWith(...fig.childNodes); continue; }

      firstFigure = fig;
      break;
    }

    if (!firstFigure) return; // nothing to move

    // 5) Prepare the lead figure clone with CWV-safe attributes
    const lead = firstFigure.cloneNode(true);
    lead.classList.add("lead-figure");

    lead.querySelectorAll("img").forEach((img) => {
      // keep or set explicit sizes + lazy/async
      const w = parseInt(img.getAttribute("width")  || img.naturalWidth  || "800", 10);
      const h = parseInt(img.getAttribute("height") || img.naturalHeight || "533", 10);
      img.setAttribute("width",  String(w));
      img.setAttribute("height", String(h));
      img.setAttribute("loading",  "lazy");
      img.setAttribute("decoding", "async");
      img.style.aspectRatio = `${w}/${h}`;
      img.style.objectFit = "cover";
    });

    // 6) Insert AFTER meta and BEFORE ToC (if ToC exists)
    if (toc && toc.parentNode) toc.parentNode.insertBefore(lead, toc);
    else meta.parentNode.insertBefore(lead, meta.nextSibling);

    // 7) Remove the ORIGINAL figure (no blank space left) and any caption right after it
    const after = firstFigure.nextElementSibling;
    if (after && /figcaption|caption/i.test(after.tagName || "") ) after.remove();
    firstFigure.remove();

    // 8) Cleanup elsewhere in the body: purge ghost/blank figures & orphan captions
    const cleanGhosts = () => {
      body.querySelectorAll("figure").forEach((fig) => {
        if (fig.classList.contains("lead-figure")) return;
        const img = fig.querySelector("img");
        const tooSmall = fig.getBoundingClientRect().height <= 40;
        const invalid = !img || !isGoodImg(img) || tooSmall;
        if (invalid) {
          const next = fig.nextElementSibling;
          if (next && /figcaption/i.test(next.tagName || "")) next.remove();
          fig.remove();
        }
      });
      body.querySelectorAll("figcaption, .wp-element-caption, .image-caption, .caption, .post-caption")
        .forEach((cap) => {
          if (cap.previousElementSibling?.tagName !== "FIGURE") cap.remove();
        });
      body.querySelectorAll("p").forEach((p) => {
        const t=(p.textContent||"").replace(/\u00a0/g," ").trim();
        if (!t && p.children.length===0) p.remove();
      });
    };

    cleanGhosts();
    window.addEventListener("load", cleanGhosts, { once: true });

    // 9) If any non-lead image errors later, remove its figure
    body.querySelectorAll("img").forEach((img) => {
      img.addEventListener("error", () => {
        const fig = img.closest("figure");
        if (fig && !fig.classList.contains("lead-figure")) fig.remove();
        else img.remove();
      }, { once: true });
    });

    // QA flag
    window.__leadImagePatched = true;
  } catch (e) {
    console.warn("lead-image move non-fatal:", e);
  }
}, []);

1B) Tighten ToC spacing & lead-figure margins

Append to the last-loaded CSS (prefer src/styles/theme-additions.css; otherwise append at end of src/index.css):

/* lead image & ToC spacing */
.lead-figure { margin: 1rem 0 .6rem; }
#toc, .toc-shell { margin-bottom: .5rem !important; }
#toc + *:not(script):not(style),
.toc-shell + *:not(script):not(style) { margin-top: 0 !important; }


Acceptance (must pass on every post, especially these two):

/blog/how-to-stop-attracting-narcissists-9-proven-strategies-2025

/blog/post-breakup-glow-up-transformation-guide-10-proven-steps-2025
✅ Flow is H1/meta → lead image (from article body) → caption → ToC → body text.
✅ No blank/ghost figures remain where the image used to be.
✅ ToC sits tight above the first paragraph.
✅ In console: window.__leadImagePatched === true.
✅ No logo/icon/avatar was selected as the lead image.

2) Home “My Story” avatar must be circular (not a rectangle) and show the whole face

About.jsx should render one image:

<img
  className="about-avatar"
  src={authorImageSrc}
  alt="Marica Šinko"
  width="144"
  height="144"
  loading="lazy"
  decoding="async"
/>


CSS (append to last CSS):

.about-avatar{
  width:min(144px,20vw);
  height:min(144px,20vw);
  border-radius:9999px;
  object-fit:cover;
  object-position:50% 28%; /* face centered */
  display:block;
  box-shadow:0 1px 3px rgba(15,23,42,.08),0 6px 20px rgba(15,23,42,.06);
}


Acceptance: exactly one circular avatar, face fully visible, no rectangle/duplicate remains.

3) Latest Insights right column readability

Thumbnails: 88×88, rounded.

Titles clamp to 3 lines on mobile, 2 lines on md+.

Keep featured (left) card unchanged.

JSX (right column items):

<ul className="latest-aside space-y-3 md:space-y-4">
  {posts.slice(1,5).map(p=>(
    <li key={p.slug}>
      <a className="flex gap-3 md:gap-3.5 items-start group" href={p.url}>
        <img className="rounded-xl flex-none" src={p.image} alt={p.title}
             width="88" height="88" loading="lazy" decoding="async" style={{objectFit:'cover'}}/>
        <div className="min-w-0">
          <h4 className="font-semibold leading-snug latest-aside-title">{p.title}</h4>
          <p className="text-sm text-slate-600 latest-aside-excerpt">{p.excerpt}</p>
        </div>
      </a>
    </li>
  ))}
</ul>


CSS:

.latest-aside .latest-aside-title{
  display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;-webkit-line-clamp:3;
}
@media (min-width:768px){ .latest-aside .latest-aside-title{ -webkit-line-clamp:2; } }
.latest-aside .latest-aside-excerpt{
  display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;-webkit-line-clamp:2;
}


Acceptance: right-column items show 2–3 title lines, 2-line excerpts, and 88×88 thumbs.

4) One-time verification for the two problem posts

After deploy:

Confirm the lead image is the first photo from the article body, not the logo.

Confirm the old blank figure below the first paragraphs is gone, including its caption.

Confirm ToC gap is tight.

If any fail, log console.log("LEAD DEBUG", { pickedFigureHtml: lead?.outerHTML }) inside the effect temporarily and fix selectors — but do not broaden the scope beyond the body or remove the filters that exclude logos/icons/avatars.