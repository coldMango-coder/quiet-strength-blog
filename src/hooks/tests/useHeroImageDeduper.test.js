/**
 * @jest-environment jsdom
 */
import { normalizeSrc, collectUrlsFromPicture } from '../useHeroImageDeduper';

describe('useHeroImageDeduper helpers', () => {
  test('normalizeSrc strips query/hash, decodes, and lowercases last segment', () => {
    expect(normalizeSrc('https://site.com/Images/Hero-Image%20One.webp?v=123#hash')).toBe('hero-image one.webp');
    expect(normalizeSrc('/images/HERO.JPG?x=1')).toBe('hero.jpg');
    expect(normalizeSrc('')).toBe('');
  });

  test('collectUrlsFromPicture collects img src and source srcset URLs', () => {
    document.body.innerHTML = `
      <picture id="p">
        <source srcset="/img/hero.avif 1x, /img/hero-2x.avif 2x" type="image/avif" />
        <source srcset="/img/hero.webp 1x, /img/hero-2x.webp 2x" type="image/webp" />
        <img src="/img/hero.jpg" alt="" />
      </picture>
    `;
    const pic = document.getElementById('p');
    const urls = Array.from(collectUrlsFromPicture(pic));
    // Should include base img and each srcset URL
    expect(urls).toEqual(expect.arrayContaining([
      '/img/hero.jpg',
      '/img/hero.avif',
      '/img/hero-2x.avif',
      '/img/hero.webp',
      '/img/hero-2x.webp',
    ]));
  });
});

