import React from 'react';
import NormalizedLink from './NormalizedLink';
import OptimizedImage from './OptimizedImage';
import { sortedBlogPosts } from '../blogData';

export default function LatestInsights() {
  const [featured, ...restAll] = sortedBlogPosts;
  const rest = restAll.slice(0, 4); // show total of 5 newest items
  return (
    <section id="latest" className="latest w-full py-16 md:py-24 bg-white">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-gray-100 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-emphasis tracking-tight mb-3">Latest Insights</h2>
            <p className="text-gray-600 text-lg">Fresh perspectives on quiet leadership and burnout recovery.</p>
          </div>
          <NormalizedLink
            to="/blog"
            className="hidden md:flex items-center px-6 py-3 bg-brand-light text-brand-primary font-bold rounded-full hover:bg-brand-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
          >
            View All Articles <span className="ml-2 text-xl">&rarr;</span>
          </NormalizedLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedBlogPosts.slice(0, 6).map((post) => (
            <article key={post.slug} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <NormalizedLink to={`/blog/${post.slug}`} className="relative block w-full aspect-[16/9] overflow-hidden">
                <OptimizedImage
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  width={600}
                  height={338}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-block px-3 py-1 bg-white/95 text-brand-primary text-xs font-bold uppercase tracking-wider rounded-md shadow-sm backdrop-blur-sm">
                    {post.category || 'Article'}
                  </span>
                </div>
              </NormalizedLink>

              <div className="flex flex-col flex-grow p-6">
                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mb-3">
                  <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                  <span>&bull;</span>
                  <span>{post.readTime || '5 min read'}</span>
                </div>

                <h3 className="text-xl font-bold text-brand-emphasis leading-tight mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">
                  <NormalizedLink to={`/blog/${post.slug}`}>
                    {post.title}
                  </NormalizedLink>
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                  {post.description}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-50">
                  <NormalizedLink
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-sm font-bold text-brand-primary hover:text-brand-dark transition-colors"
                  >
                    Read Article <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </NormalizedLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
