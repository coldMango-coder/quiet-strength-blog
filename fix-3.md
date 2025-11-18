🧩 1) src/pages/BlogPostPage.js — MOVE lead image + CLEANUP leftovers (applies to every post)

Add/replace this useEffect inside your blog post page component (leave imports alone). This runs after hydration and on window.load, so it works even if content is injected late. It also includes a precise cleanup for the two problematic posts.

// --- Lead image + cleanup (CWV-safe) ---
useEffect(() => {
  try {
    const page    = document.querySelector('.post-page, .article-page') || document;
    const meta    = page.querySelector('.post-meta, .entry-meta, .article-meta');
    const content = page.querySelector('.post-content, .entry-content, .article-body, .prose');
    const toc     = page.querySelector('#toc, .toc-shell, .table-of-contents');
    if (!meta || !content) return;

    const isUsableImg = (img) => {
      if (!img) return false;
      const src = (img.getAttribute('src') || '').trim();
      if (!src || src === '#') return false;
      if (img.naturalWidth === 0 || img.naturalHeight === 0) return false;
      if (img.clientWidth <= 1 || img.clientHeight <= 1) return false;
      return true;
    };

    // pick first usable FIGURE with a valid IMG; otherwise first bare IMG
    let candidate = null;
    for (const fig of content.querySelectorAll('figure')) {
      if (fig.closest('#toc, .toc-shell, .table-of-contents, .lead-figure')) continue;
      if (isUsableImg(fig.querySelector('img'))) { candidate = fig; break; }
    }
    if (!candidate) {
      for (const img of content.querySelectorAll('img')) {
        if (img.closest('#toc, .toc-shell, .table-of-contents, .lead-figure')) continue;
        if (isUsableImg(img)) { candidate = img; break; }
      }
    }

    const ensureLead = () => {
      let host = page.querySelector('.lead-figure');
      if (host) return host;
      host = document.createElement('div');
      host.className = 'lead-figure';
      if (toc && toc.parentNode === content) content.insertBefore(host, toc);
      else meta.insertAdjacentElement('afterend', host);
      return host;
    };

    if (candidate) {
      const lead = ensureLead();
      if (candidate.tagName === 'FIGURE') {
        // move figure + keep caption
        lead.appendChild(candidate.cloneNode(true));
        candidate.remove();
      } else {
        // wrap bare image into a figure and move optional caption
        const fig = document.createElement('figure');
        fig.appendChild(candidate.cloneNode(true));
        const maybeCap = candidate.nextElementSibling;
        if (maybeCap && /figcaption|caption/i.test(maybeCap.tagName || maybeCap.className)) {
          fig.appendChild(maybeCap.cloneNode(true));
          maybeCap.remove();
        }
        lead.appendChild(fig);
        candidate.remove();
      }

      // harden image attributes for CWV (no CLS regressions)
      const leadImg = lead.querySelector('img');
      if (leadImg) {
        if (!leadImg.getAttribute('loading'))  leadImg.setAttribute('loading', 'lazy');
        if (!leadImg.getAttribute('decoding')) leadImg.setAttribute('decoding', 'async');
        if (!leadImg.style.aspectRatio) leadImg.style.aspectRatio = '16/9';
        leadImg.style.objectFit = leadImg.style.objectFit || 'cover';
      }
    }

    // --- Cleanup pass (delete leftovers/ghosts) ---
    const killGhostFigure = (fig) => {
      if (fig.closest('.lead-figure')) return;
      const img  = fig.querySelector('img');
      const src  = (img?.getAttribute('src') || '').trim();
      const bad  = !img || !src || src === '#';
      const zero = !!img && (img.naturalWidth === 0 || img.naturalHeight === 0);
      const tiny = fig.clientHeight <= 40;
      if (bad || zero || tiny) {
        const sib = fig.nextElementSibling;
        fig.remove();
        if (sib && /figcaption|caption/i.test(sib.tagName || sib.className)) sib.remove();
      }
    };

    // generic sweep
    [...content.querySelectorAll('figure')].forEach(killGhostFigure);
    [...content.querySelectorAll('figcaption, .wp-element-caption, .image-caption, .caption, .post-caption')]
      .forEach(c => { if (!c.previousElementSibling || c.previousElementSibling.tagName !== 'FIGURE') c.remove(); });
    [...content.querySelectorAll('p')].forEach(p => { if (!p.textContent.replace(/\u00a0/g,'').trim()) p.remove(); });

    // extra certainty for the two known slugs
    const slug = location.pathname.replace(/\/+$/, '');
    if (/\/blog\/how-to-stop-attracting-narcissists/i.test(slug) ||
        /\/blog\/post-breakup-glow-up/i.test(slug)) {
      // remove any figure after the lead-figure that has empty/broken img
      const lead = page.querySelector('.lead-figure');
      const afterLead = lead ? [...content.querySelectorAll('figure')].filter(f => f.compareDocumentPosition(lead) & Node.DOCUMENT_POSITION_FOLLOWING) : [];
      afterLead.forEach(killGhostFigure);
    }

    // run again after all lazy loaders fire
    window.addEventListener('load', () => {
      [...content.querySelectorAll('figure')].forEach(killGhostFigure);
    }, { once: true });

    window.__leadImagePatched = true;
  } catch (e) {
    console.warn('lead-image patch (non-fatal):', e);
  }
}, []);

🧩 2) src/styles/theme-additions.css — ToC gap, circle avatar, Latest Insights readability

Append these rules at the end of the file (it’s already imported last → wins safely):

/* --- ToC spacing: pull body text closer --- */
#toc, .toc-shell, .table-of-contents { margin-bottom: .5rem !important; }
#toc + *:not(script):not(style),
.toc-shell + *:not(script):not(style),
.table-of-contents + *:not(script):not(style) { margin-top: 0 !important; }
#toc + .prose > *:first-child,
.toc-shell + .prose > *:first-child,
.table-of-contents + .prose > *:first-child { margin-top: 0 !important; }

/* --- Lead figure breathing room (keeps CLS flat) --- */
.lead-figure { margin: 1.25rem 0 .75rem; }

/* --- Home "My Story" avatar: force circle + center face --- */
.about-avatar {
  width: min(144px, 12vw) !important;
  height: min(144px, 12vw) !important;
  border-radius: 9999px !important;
  object-fit: cover !important;
  object-position: 50% 28% !important; /* lift face */
  display: block;
  box-shadow: 0 1px 2px rgba(0,0,0,.06);
}
@media (max-width: 640px) {
  .about-avatar { width: 112px !important; height: 112px !important; }
}

/* --- Latest Insights right column: bigger thumbs & readable titles --- */
.latest-insights-aside li { padding-top: .5rem; padding-bottom: .5rem; }
.latest-insights-aside img {
  width: 80px; height: 80px; border-radius: .75rem; object-fit: cover;
}
@media (max-width: 640px) {
  .latest-insights-aside img { width: 64px; height: 64px; }
}
/* clamp titles without plugin */
.latest-insights-aside .clamp-2, .latest-insights-aside .clamp-3 {
  display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden;
}
.latest-insights-aside .clamp-2 { -webkit-line-clamp: 2; }
.latest-insights-aside .clamp-3 { -webkit-line-clamp: 3; }

🧩 3) src/components/About.jsx — Replace the author image with a single, circular avatar

Make sure there is only one image and it uses about-avatar:

<img
  className="about-avatar"
  src={authorImageSrc}
  alt="Marica Šinko"
  width="144"
  height="144"
  loading="lazy"
  decoding="async"
/>


Remove any left-over rectangle image (e.g., hero-about-rect). The one above is the only avatar.

🧩 4) src/components/LatestInsights.jsx — make right-hand items readable

Ensure the right column <ul> has a class like latest-insights-aside.

For each right-hand item, use:

Thumb <img> only (no background div), width/height as above.

Title: add class clamp-3 md:clamp-2 (or clamp-2 only), bump font to text-[0.95rem] md:text-base.

Give the <li> a py-3 or rely on the CSS above.

Example for each side item:

<li className="flex items-start gap-3 py-3 latest-insights-item">
  <a href={post.url} className="group flex items-start gap-3">
    <img
      src={post.image} alt={post.imageAlt || post.title}
      width="80" height="80" loading="lazy" decoding="async"
      className=""
    />
    <div className="min-w-0">
      <h4 className="font-semibold leading-snug text-[0.95rem] md:text-base clamp-3 md:clamp-2 group-hover:underline">
        {post.title}
      </h4>
      <p className="mt-1 text-sm text-muted-foreground clamp-2">{post.excerpt}</p>
    </div>
  </a>
</li>

✅ What to check after build

Two problem posts

Order: Title/Meta → Lead image (with caption) → ToC (tight) → paragraph text.

There is no second/blank figure later in the article.

Console: window.__leadImagePatched === true.

All posts follow the same order.

Home/My Story avatar is circular and shows the whole face on desktop & mobile.

Latest Insights right column: bigger thumbs, titles show 2–3 lines, easy to read/tap.

If the two posts still show a blank box

Open console on each page and run this one-liner (it’s safe; it mimics the cleanup):

document.querySelectorAll('.post-content figure').forEach(fig=>{
  const lead = document.querySelector('.lead-figure');
  const isAfterLead = lead && (fig.compareDocumentPosition(lead) & Node.DOCUMENT_POSITION_FOLLOWING);
  const img = fig.querySelector('img'); const src=(img?.src||'').trim();
  const bad = !img || !src || src === '#' || img.naturalWidth===0 || img.naturalHeight===0 || fig.clientHeight<=40;
  if (isAfterLead && bad) { const cap=fig.nextElementSibling; fig.remove(); if (cap && /FIGCAPTION/i.test(cap.tagName)) cap.remove(); }
});


This proves the selectors are right; if it fixes it live, the effect in step 1 will fix it permanently.