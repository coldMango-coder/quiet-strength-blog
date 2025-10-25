import fs from "node:fs";
import path from "node:path";
import { load } from "cheerio";

const PAGES = [
  "build/index.html",
  "build/blog/index.html"
];

let errs = 0;
for (const p of PAGES) {
  const filePath = path.resolve(p);
  if (!fs.existsSync(filePath)) {
    console.error("Missing:", p);
    errs++;
    continue;
  }
  const html = fs.readFileSync(filePath, "utf8");
  const $ = load(html);
  const canonical = $('link[rel="canonical"]').attr("href");
  if (!canonical) {
    console.error("No canonical in", p);
    errs++;
  } else if (!canonical.startsWith("https://trueallyguide.com")) {
    console.error("Canonical not on canonical host in", p, "=>", canonical);
    errs++;
  }
  if (!$('meta[name="twitter:card"]').length) {
    console.warn("Warning: No twitter:card in", p);
  }
}
process.exitCode = errs ? 1 : 0;
if (!errs) console.log("Quick SEO validation passed ✅.");
