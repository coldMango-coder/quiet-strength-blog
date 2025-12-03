import React from 'react';
import NormalizedLink from './NormalizedLink';
import OptimizedImage from './OptimizedImage';
import { sortedBlogPosts } from '../blogData';

export default function LatestInsights() {
  const [featured, ...restAll] = sortedBlogPosts;
  const rest = restAll.slice(0, 4); // show total of 5 newest items
  return (
    <section id="latest" className="latest qs-container container-wide w-full py-12 md:py-16">
      <div className="flex items-end justify-between mb-8 sm:mb-10 min-w-0 border-b border-black/5 pb-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight mb-2">Latest Insights</h2>
          <p className="text-slate-600 text-lg">Fresh perspectives on quiet leadership and burnout recovery.</p>
        </div>
        <NormalizedLink
          to="/blog"
          className="hidden md:flex items-center text-brand-emphasis font-semibold hover:text-brand-dark transition-colors mb-1"
        >
          View All Articles <span className="ml-2 text-xl">&rarr;</span>
        </NormalizedLink>
      </div>

      <div className="latest-grid grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Featured - Takes up 7 columns on large screens */}
        <div className="lg:col-span-7">
          <article className="group relative flex flex-col h-full">
            <NormalizedLink to={`/blog/${featured.slug}`} className="block w-full overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="relative aspect-[16/9] overflow-hidden">
                <OptimizedImage
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                  width={1200}
                  height={630}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  usePicture={true}
                  priority={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </NormalizedLink>

            <div className="mt-6 flex flex-col flex-grow">
              <div className="flex items-center gap-3 text-sm font-medium text-brand-primary/80 mb-3">
                <span className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full">{featured.category || 'Article'}</span>
                <span>&bull;</span>
                <span>{featured.readTime || '5 min read'}</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold text-brand-dark leading-tight mb-4 group-hover:text-brand-emphasis transition-colors">
                <NormalizedLink to={`/blog/${featured.slug}`}>
                  {featured.title}
                </NormalizedLink>
              </h3>

              <p className="text-lg text-slate-600 leading-relaxed mb-6 line-clamp-3">
                {featured.description}
              </p>

              <div className="mt-auto pt-4">
                <NormalizedLink
                  to={`/blog/${featured.slug}`}
                  className="inline-flex items-center font-bold text-brand-emphasis hover:text-brand-dark transition-colors"
                >
                  Read Article <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </NormalizedLink>
              </div>
            </div>
          </article>
        </div>

        {/* Side list (right column) - Takes up 5 columns */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {rest.map((p) => (
            <article key={p.slug} className="group flex gap-5 items-start p-4 rounded-2xl hover:bg-white hover:shadow-sm transition-all duration-300 border border-transparent hover:border-black/5">
              <NormalizedLink to={`/blog/${p.slug}`} className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-xl bg-gray-100">
                <OptimizedImage
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  width={200}
                  height={200}
                  sizes="128px"
                />
              </NormalizedLink>

              <div className="flex flex-col min-w-0 py-1">
                <div className="text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1.5 opacity-80">
                  {p.category || 'Blog'}
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-brand-dark leading-snug mb-2 group-hover:text-brand-emphasis transition-colors">
                  <NormalizedLink to={`/blog/${p.slug}`}>
                    {p.title}
                  </NormalizedLink>
                </h4>
                {/* No line clamp on title, but maybe hide description on mobile if needed, or keep it short */}
              </div>
            </article>
          ))}

          <div className="mt-4 md:hidden text-center">
            <NormalizedLink
              to="/blog"
              className="inline-block px-6 py-3 bg-white border border-black/10 rounded-full font-semibold text-brand-dark shadow-sm hover:bg-gray-50 transition-colors"
            >
              View All Articles
            </NormalizedLink>
          </div>
        </div>
      </div>
    </section>
  );
}

