import React from 'react';
import NormalizedLink from './NormalizedLink';
import OptimizedImage from './OptimizedImage';
import sanitizeText from '../lib/content/sanitizeText';

const BlogCard = ({ post, onReadMore, linkTo, priority = false }) => {
  const { title, description, category, image, datePublished, readingTime, slug } = post;

  return (
    <article className=\"post-card h-full flex flex-col rounded-2xl border border-neutral-200/60 bg-white shadow-sm hover:shadow-md transition-shadow w-full max-w-full sm:min-w-[300px] md:min-w-[320px] lg:min-w-[340px] overflow-hidden" itemScope itemType="https://schema.org/BlogPosting">
      <div className="card-thumb aspect-[16/9] overflow-hidden">
        <OptimizedImage 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300" 
          src={image} 
          alt={`${title} - Self-help article for introverted women`}
          width={360}
          height={240}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
          sizes="(max-width: 640px) 300px, (max-width: 1024px) 320px, 360px"
          usePicture={true}
          itemProp="image"
        />
      </div>
      <div className="flex-1 p-6 sm:p-8 flex flex-col min-w-0 max-w-full">
        <span className="text-sm font-semibold text-brand-emphasis mb-2 break-normal hyphens-none" itemProp="articleSection">{sanitizeText(category)}</span>
        <h3 className="card-title cat-title text-brand-dark mb-3 max-w-full leading-snug text-lg sm:text-xl md:text-2xl clamp-3 md:clamp-4 lg:clamp-5 text-balance whitespace-normal break-words hyphens-none" itemProp="headline">
          {title}
        </h3>
        <p className="card-excerpt text-gray-700 mb-5 flex-grow break-normal whitespace-normal hyphens-none max-w-full leading-6 text-sm md:text-base" itemProp="description">
          {sanitizeText(description)}
        </p>
        
        {/* Article metadata */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs sm:text-sm text-gray-500 mb-5 gap-1 sm:gap-2 min-w-0">
          {datePublished && (
            <time dateTime={datePublished} itemProp="datePublished" className="flex-shrink-0">
              {new Date(datePublished).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </time>
          )}
          {readingTime && (
            <span className="text-brand-primary flex-shrink-0">
              {readingTime} min read
            </span>
          )}
        </div>
        
        {linkTo ? (
          <NormalizedLink
            to={linkTo}
            className="font-semibold text-brand-emphasis hover:underline text-left self-start mt-auto"
            aria-label={`Read full article: ${title}`}
          >
            Read More &rarr;
          </NormalizedLink>
        ) : (
          <button
            onClick={onReadMore}
            className="font-semibold text-brand-emphasis hover:underline text-left self-start mt-auto"
            aria-label={`Read full article: ${title}`}
          >
            Read More &rarr;
          </button>
        )}
        
        {/* Hidden schema markup */}
        <div className="sr-only">
          <span itemProp="author" itemScope itemType="https://schema.org/Person">
            <span itemProp="name">Marica Šinko</span>
          </span>
          <meta itemProp="url" content={`https://trueallyguide.com/blog/${slug}`} />
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
