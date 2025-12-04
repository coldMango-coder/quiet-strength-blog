import React from 'react';
import NormalizedLink from './NormalizedLink';
import OptimizedImage from './OptimizedImage';
import { sortedBlogPosts } from '../blogData';

export default function LatestInsights() {
  const [featured, ...restAll] = sortedBlogPosts;
  const rest = restAll.slice(0, 4); // show total of 5 newest items
  return (
    <section id="latest" className="latest w-full py-16 md:py-20 bg-white">
      <div className="container-wide">
        <div className="flex items-end justify-between mb-12 pb-6 border-b border-gray-100">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-emphasis tracking-tight mb-3">Latest Insights</h2>
            <p className="text-gray-600 text-lg">Fresh perspectives on quiet leadership and burnout recovery.</p>
          </div>
          <NormalizedLink
            to="/blog"
            className="hidden md:flex items-center text-brand-primary font-semibold hover:text-brand-emphasis transition-colors mb-1"
          >
            View All Articles <span className="ml-2 text-xl">&rarr;</span>
          </NormalizedLink>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Featured - Takes up 7 columns on large screens */}
          <div className="lg:col-span-7">
            <article className="group relative flex flex-col h-full">
              <NormalizedLink to={`/blog/${featured.slug}`} className="block w-full overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <OptimizedImage
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    width={1200}
                    height={630}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    usePicture={true}
                    priority={true}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                </div>
              </NormalizedLink>

              <div className="mt-8 flex flex-col flex-grow">
                <div className="flex items-center gap-3 text-sm font-bold text-brand-primary uppercase tracking-wider mb-4">
                  <span>{featured.category || 'Article'}</span>
                  <span className="text-gray-300">&bull;</span>
                  <span className="text-gray-500 font-medium normal-case">{featured.readTime || '5 min read'}</span>
                </div>

                <h3 className="text-3xl md:text-4xl font-bold text-brand-emphasis leading-tight mb-4 group-hover:text-brand-primary transition-colors">
                  <NormalizedLink to={`/blog/${featured.slug}`}>
                    {featured.title}
                  </NormalizedLink>
                </h3>

                <p className="text-lg text-gray-600 leading-relaxed mb-6 line-clamp-3">
                  {featured.description}
                </p>

                <div className="mt-auto pt-2">
                  <NormalizedLink
                    to={`/blog/${featured.slug}`}
                    className="inline-flex items-center font-bold text-brand-emphasis hover:text-brand-primary transition-colors text-lg"
                  >
                    Read Article <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </NormalizedLink>
                </div>
              </div>
            </article>
          </div>

          {/* Side list (right column) - Takes up 5 columns */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {rest.map((p) => (
              <article key={p.slug} className="group flex gap-6 items-start p-4 -mx-4 rounded-2xl hover:bg-brand-secondary/30 transition-colors duration-300">
                <NormalizedLink to={`/blog/${p.slug}`} className="flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 overflow-hidden rounded-xl shadow-sm">
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
                  <div className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">
                    {p.category || 'Blog'}
                  </div>
                  <h4 className="text-xl font-bold text-brand-emphasis leading-snug mb-2 group-hover:text-brand-primary transition-colors line-clamp-3">
                    <NormalizedLink to={`/blog/${p.slug}`}>
                      {p.title}
                    </NormalizedLink>
                  </h4>
                </div>
              </article>
            ))}

            <div className="mt-6 md:hidden text-center">
              <NormalizedLink
                to="/blog"
                className="inline-block w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-full font-bold text-brand-dark shadow-sm hover:border-brand-primary hover:text-brand-primary transition-colors"
              >
                View All Articles
              </NormalizedLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
