1) Lead image placement on every blog post

Goal (for ALL posts):
Title + meta → Lead image (with its caption) → Table of Contents → body text.
Remove any old/blank image block where the lead image used to be. Also shrink ToC gap.

Files to edit:

A) src/pages/BlogPostPage.js (or the post template that renders a single article; if it’s src/templates/Post.jsx or similar, use that file)

Insert this effect after content mounts (keep it idempotent so re-renders are safe):

useEffect(() => {
  try {
    const root = document.querySelector('.post-page') || document;
    const header = root.querySelector('.post-header, .post-meta') || root.querySelector('.post-title')?.closest('header') || root.querySelector('header');
    const toc = root.querySelector('#toc, .toc-shell');

    if (!header || !toc) return;

    // Find the first valid candidate inside article content
    const content = root.querySelector('.post-content, article');
    if (!content) return;

    // Helper: is this a usable lead figure/img?
    const isValidMedia = (el) => {
      const img = el.tagName === 'IMG' ? el : el.querySelector('img');
      if (!img) return false;
      const src = (img.getAttribute('src') || '').trim();
      if (!src || src === '#') return false;
      if (/data:image\/(gif|png|jpeg);base64,iVBOR/.test(src) && (img.naturalWidth <= 1 || img.naturalHeight <= 1)) return false;
      // if rendered height is essentially 0 it's a ghost
      if ((img.clientHeight || 0) <= 40 && (img.naturalHeight || 0) <= 40) return false;
      return true;
    };

    // candidates: figure > img OR bare img, skipping ToC region
    const candidates = Array.from(content.querySelectorAll('figure, img'))
      .filter((el) => !toc.contains(el) && isValidMedia(el));

    if (candidates.length === 0) return;

    // Take the first good one
    const first = candidates[0];
    const figure = first.tagName === 'FIGURE' ? first : first.closest('figure') || first;

    // Move caption if present
    const caption =
      figure.tagName === 'FIGURE'
        ? figure.querySelector('figcaption, .wp-element-caption, .image-caption, .caption, .post-caption')
        : null;

    // Create lead figure container (only once)
    let lead = root.querySelector('.lead-figure');
    if (!lead) {
      lead = document.createElement('figure');
      lead.className = 'lead-figure';
      // Insert *after* header/meta and *before* ToC
      header.insertAdjacentElement('afterend', lead);
    }

    // Move figure’s img into lead container
    lead.innerHTML = '';
    const moved = figure.cloneNode(true);
    // Ensure the img keeps explicit intrinsic dimensions + lazy/async
    const img = moved.tagName === 'IMG' ? moved : moved.querySelector('img');
    if (img) {
      if (!img.getAttribute('width') && img.naturalWidth) img.setAttribute('width', img.naturalWidth);
      if (!img.getAttribute('height') && img.naturalHeight) img.setAttribute('height', img.naturalHeight);
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
      img.style.objectFit = 'cover';
      img.style.aspectRatio = img.getAttribute('width') && img.getAttribute('height')
        ? `${img.getAttribute('width')} / ${img.getAttribute('height')}`
        : '';
    }
    // If the original had a caption, move just the text caption once
    let figcap = moved.querySelector('figcaption, .wp-element-caption, .image-caption, .caption, .post-caption');
    lead.appendChild(moved);
    if (figcap && !lead.querySelector('figcaption')) {
      const cap = document.createElement('figcaption');
      cap.className = 'lead-caption';
      cap.innerHTML = figcap.innerHTML;
      lead.appendChild(cap);
    }

    // Remove the original block entirely (so no blank placeholder remains)
    figure.remove();

    // Cleanup: remove any ghost figure/caption left elsewhere
    Array.from(content.querySelectorAll('figure')).forEach((f) => {
      const hasImg = !!f.querySelector('img');
      const img = f.querySelector('img');
      const blank =
        !hasImg ||
        !img.getAttribute('src') ||
        img.getAttribute('src') === '#' ||
        ((img.naturalWidth || 0) <= 1 && (img.naturalHeight || 0) <= 1) ||
        (img.clientHeight || 0) <= 40;
      if (blank && !f.classList.contains('lead-figure')) f.remove();
    });
    // Remove orphan captions
    Array.from(content.querySelectorAll('figcaption, .wp-element-caption, .image-caption, .caption, .post-caption')).forEach((cap) => {
      if (cap.previousElementSibling?.tagName !== 'FIGURE') cap.remove();
    });
    // Remove empty filler paragraphs
    Array.from(content.querySelectorAll('p')).forEach((p) => {
      if ((p.innerText || '').trim().replace(/\u00a0/g, '') === '') p.remove();
    });

    // SPECIAL SAFETY for two known posts: if any figure remains with no <img>, remove it
    const problemSlugs = [
      '/blog/how-to-stop-attracting-narcissists-9-proven-strategies',
      '/blog/post-breakup-glow-up-transformation-guide-10-proven-steps',
    ];
    if (problemSlugs.some((slug) => location.pathname.includes(slug))) {
      Array.from(content.querySelectorAll('figure')).forEach((f) => {
        if (!f.querySelector('img') && !f.classList.contains('lead-figure')) f.remove();
      });
      Array.from(content.querySelectorAll('figcaption')).forEach((fc) => {
        if (fc.previousElementSibling?.tagName !== 'FIGURE') fc.remove();
      });
    }
  } catch (e) {
    console.warn('lead-image patch non-fatal:', e);
  }
}, []);


Tighten ToC gap using CSS (next section).

B) src/styles/lead-figure-overrides.css (make sure this file is imported last from src/index.css)

Append (or keep) these rules:

/* Lead figure spacing */
.lead-figure { margin: 1.25rem 0 0.75rem; }

/* ToC closer to text */
#toc, .toc-shell { margin-bottom: 0.5rem !important; }
#toc + *:not(script):not(style),
.toc-shell + *:not(script):not(style) { margin-top: 0 !important; }


IMPORTANT: Ensure src/index.css imports lead-figure-overrides.css last so these win.

2) Main page — Author image shape (circle) and face fully visible

Goal: In the homepage “My Story: From Burnout to Quiet Strength” section, the author photo is circular, with the full face clearly visible; do not alter text layout or CWV.

Files:

A) src/components/About.jsx (the home author section)

Ensure the image element uses this class and intrinsic size:

<img
  className="about-avatar"
  src={authorImageSrc}
  alt="Marica Šinko"
  width="144"
  height="144"
  loading="lazy"
  decoding="async"
/>

B) src/styles/theme-additions.css (append)
/* Circular home author avatar. Keep intrinsic sizes (CLS-safe) */
.about-avatar{
  border-radius: 9999px;
  object-fit: cover;
  object-position: 50% 28%; /* lift face */
  display: block;
}
@media (min-width: 1024px){
  .about-avatar{ width: 160px; height: 160px; }
}
@media (max-width: 640px){
  .about-avatar{ width: 128px; height: 128px; }
}

3) Latest Insights — improve right-side item readability (desktop + mobile)

Goal: The right column items feel larger and show fuller titles (2–3 lines) with bigger thumbnails; keep left featured card as is.

File: src/components/LatestInsights.jsx

On the outer grid, widen the right column a bit:

<div className="latest grid gap-6 lg:grid-cols-[2fr_1.8fr]">


For the right-side item component (thumbnail + text):

Make the whole row a block link (<a> around thumbnail + text).

Thumbnail: 80×80 (rounded-xl), object-cover.

Title: allow 2–3 lines (line-clamp-2 md:line-clamp-3).

Add a little more vertical padding: py-2 md:py-3.

Example snippet for each right item:

<a href={post.slug} className="group flex items-center gap-3 py-2 md:py-3">
  <img
    className="h-20 w-20 rounded-xl object-cover"
    src={post.image}
    alt={post.title}
    width="80"
    height="80"
    loading="lazy"
    decoding="async"
  />
  <div className="min-w-0">
    <h4 className="text-[15px] font-semibold leading-snug line-clamp-2 md:line-clamp-3 group-hover:underline">
      {post.title}
    </h4>
    {post.excerpt && (
      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
    )}
  </div>
</a>


If your Tailwind build lacks the line-clamp plugin, append this tiny polyfill to theme-additions.css:

.line-clamp-2{
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
}
.line-clamp-3{
  display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;
}

4) One-time hot-fix for two specific posts with ghost blocks

On these two slugs there are leftover blank figures/captions after the first image move. The effect in step 1 already handles it, but add a final guard:

In the same effect (already pasted), the problemSlugs array includes the two routes:

/blog/how-to-stop-attracting-narcissists-9-proven-strategies
/blog/post-breakup-glow-up-transformation-guide-10-proven-steps


For both, after moving the lead image, remove any <figure> without an <img> and any orphan captions in .post-content. This code is already included above (do not remove it).

Acceptance criteria (verify after deploy)

On every post, the first real image (with its caption) now appears right after the title/meta and before ToC.

There is no old empty image block left below (no blank figure or caption).

The ToC sits close to the first paragraph.

On the homepage, the author photo is circular and the full face is clearly visible on desktop and mobile—no layout shift (intrinsic width/height kept).

Latest Insights right column: larger thumbnails and multi-line titles (2–3 lines). The entire row is clickable.

No CWV regressions: we didn’t add render-blocking assets; all images keep explicit width/height and lazy/async.