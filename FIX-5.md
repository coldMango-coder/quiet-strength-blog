🔧 EXACT CHANGES – DO NOT GUESS
0) Core constraints (do not violate)

Do not change Core Web Vitals: keep explicit width/height on all imgs, keep loading="lazy" and decoding="async".

Do not introduce render-blocking CSS/JS. Append CSS to the last loaded stylesheet.

Do not change content, routes, or slugs.

1) Blog posts: move the first image (with its caption) to lead position on every post

Goal: On every blog post page, the flow must be:

H1 + post meta
↓
Lead image (the first *usable* image from article body)
↓
Caption for that image (if present)
↓
Table of contents
↓
Article text (no ghost/blank figures left behind)


Files to edit

src/pages/BlogPostPage.js (or the file that renders a single post + ToC)

src/styles/theme-additions.css (or append to the last-imported CSS if this file is not last)

1A) Add this effect in BlogPostPage.js (after the component mounts)
import { useEffect } from "react";

useEffect(() => {
  try {
    const root = document.querySelector(".post-content") || document;
    const h1 = document.querySelector("h1");
    const meta = document.querySelector(".post-meta") || h1?.nextElementSibling;
    const toc = document.querySelector("#toc, .toc-shell");

    if (!root || !h1 || !meta) return;

    // Helper: is a usable image element
    const isGoodImg = (img) => {
      if (!img || img.tagName !== "IMG") return false;
      const src = (img.getAttribute("src") || "").trim();
      if (!src || src === "#" || src.startsWith("data:image/gif") || src.startsWith("data:image/svg")) return false;
      return true;
    };

    // Find the first usable figure (prefer <figure> with <img>, else bare <img>)
    const candidates = [
      ...root.querySelectorAll("figure"),
      ...root.querySelectorAll("img")
    ];

    let pickedFigure = null;
    for (const node of candidates) {
      if (node.closest("#toc, .toc-shell")) continue;                 // skip ToC area
      if (node.classList.contains("lead-figure")) continue;           // skip already moved
      if (node.tagName === "FIGURE") {
        const img = node.querySelector("img");
        if (isGoodImg(img)) { pickedFigure = node; break; }
      } else if (isGoodImg(node)) {
        // wrap bare img into a figure (temporarily)
        const fig = document.createElement("figure");
        node.replaceWith(fig);
        fig.appendChild(node);
        pickedFigure = fig;
        break;
      }
    }

    // Insert lead figure just AFTER meta and BEFORE ToC
    if (pickedFigure) {
      // Clone to move; remove original to avoid blank placeholder
      const lead = pickedFigure.cloneNode(true);

      // Ensure explicit sizes + lazy/async on all imgs inside
      lead.querySelectorAll("img").forEach((img) => {
        if (!img.getAttribute("width"))  img.setAttribute("width", img.naturalWidth || "800");
        if (!img.getAttribute("height")) img.setAttribute("height", img.naturalHeight || "533");
        img.setAttribute("loading", "lazy");
        img.setAttribute("decoding", "async");
        img.style.aspectRatio = img.getAttribute("width") && img.getAttribute("height")
          ? `${img.getAttribute("width")}/${img.getAttribute("height")}`
          : "";
        img.style.objectFit = "cover";
      });

      lead.classList.add("lead-figure");

      // Place after meta, before ToC (if ToC exists)
      if (toc && toc.parentNode) {
        toc.parentNode.insertBefore(lead, toc);
      } else {
        meta.parentNode.insertBefore(lead, meta.nextSibling);
      }

      // Remove the original to avoid leaving an empty box
      pickedFigure.remove();
    }

    // Cleanup: remove ghost/blank figures and orphan captions anywhere in body
    const cleanGhosts = () => {
      root.querySelectorAll("figure").forEach((fig) => {
        if (fig.classList.contains("lead-figure")) return;
        const img = fig.querySelector("img");
        const hasRealImg = img && isGoodImg(img);
        const renderedTooSmall = fig.getBoundingClientRect().height <= 40;
        if (!hasRealImg || renderedTooSmall) {
          // remove accompanying caption if present
          const next = fig.nextElementSibling;
          if (next && /figcaption|caption/.test(next.tagName?.toLowerCase() || "") ) next.remove();
          if (next && next.classList?.contains("wp-element-caption")) next.remove();
          fig.remove();
        }
      });

      // Remove orphan captions
      root.querySelectorAll("figcaption, .wp-element-caption, .image-caption, .caption, .post-caption")
        .forEach((cap) => {
          if (cap.previousElementSibling?.tagName !== "FIGURE") cap.remove();
        });

      // Remove purely-empty filler <p>
      root.querySelectorAll("p").forEach((p) => {
        const t = (p.textContent || "").replace(/\u00a0/g, " ").trim();
        if (!t && p.children.length === 0) p.remove();
      });
    };

    cleanGhosts();
    window.addEventListener("load", cleanGhosts, { once: true });

    // If any image errors, remove its figure (but never the lead-figure)
    root.querySelectorAll("img").forEach((img) => {
      img.addEventListener("error", () => {
        const fig = img.closest("figure");
        if (fig && !fig.classList.contains("lead-figure")) fig.remove();
        else img.remove();
      }, { once: true });
    });

    // Diagnostic flag for QA
    window.__leadImagePatched = true;

  } catch (e) {
    console.warn("lead-image move non-fatal:", e);
  }
}, []);

1B) Tighten ToC spacing (applies to every post)

Append to the last-loaded CSS file (prefer src/styles/theme-additions.css; if not last, append to src/index.css at the very end):

/* --- ToC spacing & lead image --- */
.lead-figure { margin: 1rem 0 .6rem; }

#toc, .toc-shell { 
  margin-bottom: .5rem !important;
}

/* Remove the extra top-gap after the ToC for the very next element */
#toc + *:not(script):not(style),
.toc-shell + *:not(script):not(style) {
  margin-top: 0 !important;
}


Acceptance for §1

On all posts (especially these two slugs):

/blog/how-to-stop-attracting-narcissists-9-proven-strategies-2025

/blog/post-breakup-glow-up-transformation-guide-10-proven-steps-2025

The first usable image from the article body is now right after H1/meta, before the ToC, with its caption, and the old spot is removed (no empty container).

ToC sits tight above the first paragraph (no large gap).

window.__leadImagePatched === true in console.

2) Home page “My Story” author image must be circular and show the full face

Files

src/components/About.jsx

src/styles/theme-additions.css (or last CSS)

2A) Component (use a single circular img – no rectangle)

In About.jsx, ensure the avatar renders exactly like this:

<img
  className="about-avatar"
  src={authorImageSrc}
  alt="Marica Šinko"
  width="144"
  height="144"
  loading="lazy"
  decoding="async"
/>

2B) CSS (make it a true circle & center face)

Append to last-loaded CSS:

/* --- Home: circular author avatar --- */
.about-avatar {
  width: min(144px, 20vw);
  height: min(144px, 20vw);
  border-radius: 9999px;
  object-fit: cover;
  object-position: 50% 28%; /* nudge face into center */
  display: block;
  box-shadow: 0 1px 3px rgba(15,23,42,.08), 0 6px 20px rgba(15,23,42,.06);
}


Acceptance for §2

On the home section “My Story: From Burnout to Quiet Strength”, the author image is circular, face fully visible, single image (no rectangle left anywhere).

3) Latest Insights (right column) readability improvements

Files

src/components/LatestInsights.jsx

src/styles/theme-additions.css (or last CSS)

Goal: Right-hand list items should have bigger thumbnails and 2–3 lines of title visible. Use a modern, clean card list.

3A) Component tweaks

Keep the big featured card unchanged.

For the right-hand list, render items like this (pseudo-JSX):

<ul className="latest-aside space-y-3 md:space-y-4">
  {posts.slice(1,5).map(p => (
    <li key={p.slug}>
      <a className="flex gap-3 md:gap-3.5 items-start group" href={p.url}>
        <img
          className="rounded-xl flex-none"
          src={p.image}
          alt={p.title}
          width="88"
          height="88"
          loading="lazy"
          decoding="async"
          style={{ objectFit: 'cover' }}
        />
        <div className="min-w-0">
          <h4 className="font-semibold leading-snug latest-aside-title">
            {p.title}
          </h4>
          <p className="text-sm text-slate-600 latest-aside-excerpt">
            {p.excerpt}
          </p>
        </div>
      </a>
    </li>
  ))}
</ul>

3B) CSS for clamping & layout

Append to last-loaded CSS:

/* --- Latest Insights aside --- */
.latest-aside .latest-aside-title {
  display: -webkit-box;
  -webkit-line-clamp: 3;           /* 3 lines on mobile */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
@media (min-width: 768px) {
  .latest-aside .latest-aside-title { -webkit-line-clamp: 2; } /* 2 lines on md+ */
}
.latest-aside .latest-aside-excerpt {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}


Acceptance for §3

Right column items: 88×88 rounded thumbnails, titles show 2–3 lines, excerpts 2 lines. Looks balanced on mobile and desktop.

4) One-time sweep for blank ghost figures (the two problem posts)

Add this after the effect in §1 (same file), or keep as part of the cleanup function, making sure it runs on these slugs as well:

/blog/how-to-stop-attracting-narcissists-9-proven-strategies-2025

/blog/post-breakup-glow-up-transformation-guide-10-proven-steps-2025

It is already covered by the cleanup in §1: any <figure> that has no valid <img> or is <= 40px tall gets removed, along with its adjacent caption.
Confirm that after reload no empty boxes remain under the first paragraphs on these two pages.

✅ Final QA checklist (must all pass)

On every blog post:

Order is H1/meta → lead image (with caption) → ToC → text.

The old image spot is gone (no blank box, no orphan caption).

The ToC gap is tight (~0.5rem to first paragraph).

Console shows window.__leadImagePatched === true.

Home “My Story”: exactly one avatar, circular, face centered and fully visible.

Latest Insights: right column titles are not truncated to one line; 2–3 lines visible. Thumbs are 88×88.

CWV sanity:

No added render-blocking files.

All imgs keep explicit width/height + loading="lazy" + decoding="async".

No CLS spikes on page load.

If any of the above cannot be placed in src/styles/theme-additions.css because that file isn’t last, append the CSS to the end of src/index.css so it loads last.