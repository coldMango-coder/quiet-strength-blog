import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

function extractSlugs(): string[] {
  const p = path.join(__dirname, '../../src/blogData.js');
  const content = fs.readFileSync(p, 'utf8');
  const matches = [...content.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
  // Deduplicate and sample up to 10
  return Array.from(new Set(matches)).slice(0, 10);
}

function filenameFromUrl(u: string): string {
  try {
    const a = new URL(u, 'https://trueallyguide.com');
    const last = a.pathname.split('/').filter(Boolean).pop() || '';
    return decodeURIComponent(last.toLowerCase());
  } catch {
    return '';
  }
}

test.describe('No duplicate hero images', () => {
  const slugs = extractSlugs();

  for (const slug of slugs) {
    test(`slug ${slug} has a single hero instance`, async ({ page }) => {
      const url = `https://trueallyguide.com/blog/${slug}`;
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      const heroSrc = await page.$eval('#intro-media img, #intro-media picture img', (img: HTMLImageElement) => (img?.currentSrc || img?.src || ''));
      expect(heroSrc).toBeTruthy();
      const heroFile = filenameFromUrl(heroSrc);
      expect(heroFile).toBeTruthy();

      // Count occurrences within the article
      const count = await page.evaluate((fn) => {
        const sel = 'article picture, article img';
        const nodes = Array.from(document.querySelectorAll(sel));
        const norm = (u: string) => {
          try {
            const a = document.createElement('a');
            a.href = u;
            return decodeURIComponent((a.pathname || '').toLowerCase().split('/').filter(Boolean).pop() || '');
          } catch { return ''; }
        };
        let c = 0;
        for (const n of nodes) {
          const img = (n as HTMLElement).tagName === 'IMG' ? (n as HTMLImageElement) : (n.querySelector('img') as HTMLImageElement | null);
          if (!img) continue;
          const srcs = new Set<string>();
          if (img.getAttribute('src')) srcs.add(img.getAttribute('src')!);
          if ((img as any).currentSrc) srcs.add((img as any).currentSrc);
          (n.querySelectorAll('source[srcset]') || []).forEach((s) => {
            const ss = (s as HTMLSourceElement).srcset || '';
            ss.split(',').map((x) => x.trim().split(' ')[0]).forEach((u) => u && srcs.add(u));
          });
          const match = Array.from(srcs).some((u) => norm(u) === fn);
          if (match) c++;
        }
        return c;
      }, heroFile);

      expect(count).toBe(1);
    });
  }
});

