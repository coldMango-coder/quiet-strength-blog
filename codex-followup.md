1) Create a clean replacement component (UTF-8)

Create src/components/AuthorBio.jsx with UTF-8 encoding and wire in the new utilities (sanitizer + Avatar). This also fixes your “weird characters” issue at the source.

// src/components/AuthorBio.jsx
import React from "react";
import Avatar from "./Avatar";
import { sanitizeText } from "@/lib/content/sanitizeText";

// Keep props simple and resilient
export default function AuthorBio({
  name = "Marica Šinko",
  title = "Founder of Quiet Strength",
  bio = "Empowering introverted women to build quiet confidence without burnout.",
  avatarSrc = "/images/author-marica-sinko.jpg",
  avatarAlt = "Portrait of Marica Šinko",
  size = 112,
}) {
  // Sanitize any text that could carry stray symbols or nbsp
  const safeName = sanitizeText(name);
  const safeTitle = sanitizeText(title);
  const safeBio = sanitizeText(bio);

  return (
    <aside
      className="mt-10 flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
      // Avoid CLS: reserve space by providing explicit sizes for image container via Avatar
    >
      <Avatar src={avatarSrc} alt={avatarAlt} size={size} />
      <div className="min-w-0">
        <h3 className="text-lg font-semibold leading-tight text-balance">
          {safeName}
        </h3>
        <p className="text-sm text-neutral-600">{safeTitle}</p>
        <p className="mt-2 text-sm leading-6 text-neutral-700">{safeBio}</p>
      </div>
    </aside>
  );
}


(Assumes you already added Avatar.jsx and sanitizeText.js per the prompt.)

2) Point imports to the new file

If your imports omit extensions (recommended), you may not have to change anything; React will resolve .jsx. If any files import the old path with extension or the old name differs, switch them:

# See all places that reference AuthorBio
git grep -n "AuthorBio"

# If any imports explicitly reference .js, update them to extensionless or .jsx
# Extensionless (preferred):
rg -l "from ['\"]/.*AuthorBio\.js['\"]" | xargs sed -i '' -e "s/AuthorBio\.js/AuthorBio/g"
# or to .jsx
rg -l "from ['\"]/.*AuthorBio\.js['\"]" | xargs sed -i '' -e "s/AuthorBio\.js/AuthorBio.jsx/g"


If you don’t use ripgrep (rg), use grep -rl instead.

3) Delete the mojibake file
git rm src/components/AuthorBio.js


(If you’d rather keep it temporarily, rename it so nothing imports it.)

4) Install the new dependency (if you haven’t yet)

Your agent added lodash.deburr for slugify.js. Make sure it’s installed:

npm i lodash.deburr

5) Rebuild + validate (preserves SEO & Core Web Vitals)
npm run build
npm run test
npm run test:prerender
npm run validate:seo:enhanced


Then quickly sanity-check Lighthouse (mobile & desktop) to confirm:

LCP ≤ 1.8s (mobile), CLS ≤ 0.05, TBT ≤ 50ms

SEO/Best Practices/Accessibility remain 100/100

6) (Alternative) Convert the old file in place to UTF-8

If you prefer to keep AuthorBio.js as-is and just fix its encoding:

# Detect encoding (best-effort)
file -I src/components/AuthorBio.js
# or
python - <<'PY'
import chardet
data = open("src/components/AuthorBio.js","rb").read()
print(chardet.detect(data))
PY

# If it reports windows-1250 or iso-8859-2 (common for Š/č/ć):
iconv -f WINDOWS-1250 -t UTF-8 src/components/AuthorBio.js > src/components/AuthorBio.fixed.js
# or:
iconv -f ISO-8859-2 -t UTF-8 src/components/AuthorBio.js > src/components/AuthorBio.fixed.js

mv src/components/AuthorBio.fixed.js src/components/AuthorBio.jsx
git add -A


Then update imports exactly as in step 2.

7) Make AuthorBio consume the new Avatar and sanitizer everywhere

Search for all uses of AuthorBio and ensure the new props cover them (name/title/bio/src). If some pages pass raw strings from Markdown/front-matter, you’re already protected by sanitizeText inside the component.

8) Commit
git add -A
git commit -m "Replace non-UTF-8 AuthorBio.js with UTF-8 AuthorBio.jsx + sanitizer & Avatar integration (no SEO/CWV regressions)"