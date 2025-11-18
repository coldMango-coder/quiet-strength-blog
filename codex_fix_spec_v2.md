Non-negotiable goals

Article pages

Show the first image (or featuredImage) immediately after Title + Meta, then ToC, then the rest of the content.

The hero image must have its caption right under it.

Remove the later duplicate/blank image container and any caption tied to it.

ToC

Render right after the hero image and before the first paragraph/H2. Tight spacing (mb-4 or ~1rem).

Homepage author image (“My Story: From Burnout to Quiet Strength”)

Make the photo and its placeholder perfectly circular, face centered.

If a file name differs, find the equivalent and apply the same change. Do not skip.

Concrete edits (apply in this order)
A. Article template logic (move first image under title/meta; strip it from body)

Target file (one of the files Codex already read):
src/pages/BlogPostPage.js (or the file that renders a single article page — if different, modify that one)

1) Add hero extraction helpers (top of file or near imports):

// Helper: extract & remove first <img> from HTML, returning { htmlWithoutFirst, hero }
function promoteFirstImage(html) {
  if (!html) return { htmlWithoutFirst: html, hero: null };
  const imgRe = /<figure[^>]*>\s*<img\s+([^>]+)>\s*(<figcaption[^>]*>[\s\S]*?<\/figcaption>)?\s*<\/figure>/i;
  const imgReLoose = /<img\s+([^>]+?)\s*\/?>/i;

  let m = html.match(imgRe) || html.match(imgReLoose);
  if (!m) return { htmlWithoutFirst: html, hero: null };

  const full = m[0];
  const attrs = m[1] || "";
  const capMatch = full.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
  const caption = capMatch ? capMatch[1].trim() : null;

  const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
  const altMatch = attrs.match(/alt=["']([^"']*)["']/i);
  if (!srcMatch) return { htmlWithoutFirst: html, hero: null };

  const hero = {
    src: srcMatch[1],
    alt: altMatch ? altMatch[1] : "",
    caption,
  };
  const htmlWithoutFirst = html.replace(full, ""); // remove the first image block
  return { htmlWithoutFirst, hero };
}


2) Wire hero selection in the component (prefer front-matter; else first inline image):

// Inside the article page component render (pseudocode -> implement in your JSX):
const fmHero = post?.frontmatter?.featuredImage || post?.frontmatter?.cover || post?.frontmatter?.image;

let contentHtml = post?.html || post?.content || bodyHtml;
let hero = null;

if (fmHero?.src || typeof fmHero === 'string') {
  hero = {
    src: fmHero.src ? fmHero.src : fmHero,
    alt: post?.frontmatter?.featuredAlt || post?.frontmatter?.title || '',
    caption: post?.frontmatter?.featuredCaption || post?.frontmatter?.imageCaption || null
  };
} else {
  const promoted = promoteFirstImage(contentHtml);
  contentHtml = promoted.htmlWithoutFirst;
  hero = promoted.hero;
}


3) Render header as: Title → Meta → Hero (with caption)

<header className="post-header">
  <h1 className="post-title">{post.title}</h1>
  <div className="post-meta">{post.date} · {post.readingTime}</div>

  {hero && hero.src && (
    <figure className="post-hero lead-figure">
      <img src={hero.src} alt={hero.alt || post.title} loading="eager" decoding="async" />
      {hero.caption && <figcaption className="image-caption" dangerouslySetInnerHTML={{__html: hero.caption}} />}
    </figure>
  )}
</header>


4) ToC must appear here (just below hero):

{/* ToC directly after hero */}
{typeof TableOfContents !== 'undefined' && <TableOfContents headings={post.headings} className="mb-4" />}


5) Render the rest of the content WITHOUT the first image:

<article className="post-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />


6) Remove the later duplicate image / blank placeholder
Search in this same component for any of these and delete their render if they occur below the header:

<CoverImage, <Hero, <ImagePlaceholder, class names like placeholder, blank, lead-figure not in the header.
If they’re separate components, short-circuit them on article pages:

// Example guard
if (isArticlePage) {
  return null; // for the placeholder/duplicate component
}

B. ToC spacing (keep tight, avoid CLS)

Target (already edited): src/components/TableOfContents.js
Ensure mount spacing is tight and stable (you already set mb-4 and minHeight 120px — keep that).

C. Caption styling (keep simple)

Target (already edited): src/styles/lead-figure-overrides.css
If not present, add:

.lead-figure figcaption,
.lead-figure .wp-element-caption,
.lead-figure .image-caption,
.lead-figure .caption {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #6b7280;
  margin-top: 0.5rem;
  text-align: left;
}
.post-hero { margin: 1rem 0 1rem; }

D. Homepage: circle the author image + placeholder

Targets (from your logs): src/components/About.jsx and/or HomePage.js, plus CSS in src/index.css or src/styles/theme-additions.css

1) Ensure the markup has a class that can be targeted:

<div className="author-photo">
  <img src={authorImage} alt="Author" />
</div>


2) Enforce perfect circle and centered face (add to your global/theme CSS):

.author-photo,
.author-photo img {
  width: 160px; /* adjust to design */
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  display: block;
}
.author-photo img {
  object-fit: cover;
  object-position: center;
}


3) If a rectangular placeholder is used, apply the same class to it or wrap it inside .author-photo so it’s circular too.

Verification (automated-ish)

In BlogPostPage.js (or equivalent), confirm only one hero image renders and that it’s in the header, right after title/meta.

Confirm the ToC component renders immediately after the hero.

Confirm contentHtml no longer contains the first image (search the HTML for the hero’s src and ensure it’s absent from the body).

On homepage, ensure the avatar and placeholder render as circles.

Commit checklist Codex must output

 src/pages/BlogPostPage.js: hero extraction + header render + duplicate removal + ToC position.

 src/components/TableOfContents.js: tight spacing preserved.

 src/styles/lead-figure-overrides.css: caption/hero margin styles.

 src/components/About.jsx or HomePage.js: .author-photo wrapper.

 src/index.css or src/styles/theme-additions.css: circular image CSS.

 Show diffs for all changed files. Build and print a short QA log for two articles + homepage.

If structure is different

If these filenames don’t match, search and apply equivalent changes in the correct files. Do not claim “already implemented”; move the first image under the header and strip it from body regardless.