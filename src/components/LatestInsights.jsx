import React from 'react';
import NormalizedLink from './NormalizedLink';
import OptimizedImage from './OptimizedImage';
import { sortedBlogPosts } from '../blogData';

export default function LatestInsights() {
  const [featured, ...restAll] = sortedBlogPosts;
  const rest = restAll.slice(0, 4); // show total of 5 newest items
  return (
    <section id="latest" className="latest qs-container container-wide w-full">
      <div className="flex items-center justify-between mb-4 sm:mb-6 min-w-0">
        <h2 className="text-xl md:text-2xl font-bold text-brand-dark flex-shrink-0">Latest Insights</h2>
        <NormalizedLink
          to="/blog"
          className="text-brand-emphasis text-sm font-medium opacity-80 hover:opacity-100 hover:underline hover:text-brand-dark transition-colors flex-shrink-0 ml-2"
        >
          View All &rarr;
        </NormalizedLink>
      </div>
      <div className="latest-grid grid grid-cols-1 lg:grid-cols-[2fr_1.8fr] gap-6">
        {/* Featured */}
        <article className="featured-card rounded-2xl ring-1 ring-black/5 bg-white p-5 shadow-sm">
          <NormalizedLink to={`/blog/${featured.slug}`} className="block mb-4 rounded-xl overflow-hidden">
            <OptimizedImage
              src={featured.image}
              alt={featured.title}
              className="w-full h-auto aspect-[16/9] md:aspect-[21/9] object-cover"
              width={1200}
              height={630}
              sizes="(max-width: 1024px) 100vw, 66vw"
              usePicture={true}
              priority={false}
            />
          </NormalizedLink>
          <h3 className="text-2xl md:text-3xl font-extrabold leading-tight mb-2">
            <NormalizedLink to={`/blog/${featured.slug}`} aria-label={featured.title} className="hover:underline focus:underline">
              {featured.title}
            </NormalizedLink>
          </h3>
          <p className="text-[15px] md:text-base text-black/70 line-clamp-3 excerpt">{featured.description}</p>
        </article>

        {/* Side list (right column) */}
        <ul className="latest-aside space-y-3 md:space-y-4 min-w-0">
          {rest.map((p) => (
            <li key={p.slug}>
              <NormalizedLink to={`/blog/${p.slug}`} className="flex gap-3 md:gap-3.5 items-start group">
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
                  <p className="text-sm text-slate-600 latest-aside-excerpt">{p.excerpt || p.description}</p>
                </div>
              </NormalizedLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

