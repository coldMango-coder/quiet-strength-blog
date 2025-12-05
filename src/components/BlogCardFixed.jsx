import React from 'react';
import NormalizedLink from './NormalizedLink';
import OptimizedImage from './OptimizedImage';

const BlogCard = ({ post, linkTo }) => {
  return (
    <article className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      <NormalizedLink to={linkTo} className="relative aspect-[16/10] overflow-hidden block">
        <OptimizedImage
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
          width={400}
          height={250}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-4 left-4">
          <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-brand-primary uppercase tracking-wider rounded-full shadow-sm">
            {post.category || 'Article'}
          </span>
        </div>
      </NormalizedLink>

      <div className="flex flex-col flex-grow p-6 md:p-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-3">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </time>
          <span>&bull;</span>
          <span>{post.readTime || '5 min read'}</span>
        </div>

        <h3 className="text-xl font-bold text-brand-emphasis mb-3 leading-snug group-hover:text-brand-primary transition-colors line-clamp-2">
          <NormalizedLink to={linkTo}>
            {post.title}
          </NormalizedLink>
        </h3>

        <p className="text-gray-600 text-base leading-relaxed mb-6 line-clamp-3 flex-grow">
          {post.description}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <NormalizedLink
            to={linkTo}
            className="text-sm font-bold text-brand-primary hover:text-brand-emphasis transition-colors inline-flex items-center"
          >
            Read Article
            <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NormalizedLink>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
