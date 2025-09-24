import React from 'react';
import NormalizedLink from './NormalizedLink';
import OptimizedImage from './OptimizedImage';

const BlogCard = ({ post, onReadMore, linkTo }) => {
  const { title, description, category, image, datePublished, readingTime, slug } = post;

  return (
    <article className="w-full max-w-full rounded-lg border border-gray-200 shadow-md bg-white flex flex-col overflow-hidden transform hover:-translate-y-1 transition-transform duration-300" itemScope itemType="https://schema.org/BlogPosting">
      <div className="overflow-hidden">
        <OptimizedImage 
          className="w-full aspect-[16/9] object-cover transform hover:scale-105 transition-transform duration-300" 
          src={image} 
          alt={`${title} - Self-help article for introverted women`}
          width={640}
          height={360}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          itemProp="image"
        />
      </div>
      <div className="p-4 sm:p-6 flex flex-col flex-grow min-w-0 max-w-full">
        <span className="text-sm font-semibold text-brand-emphasis mb-2 break-words" itemProp="articleSection">{category}</span>
        <h3 className="text-lg sm:text-xl font-bold text-brand-dark mb-2 leading-tight break-words max-w-full" itemProp="headline">
          {title}
        </h3>
        <p className="text-gray-600 text-sm sm:text-base mb-4 flex-grow leading-relaxed break-words max-w-full" itemProp="description">
          {description}
        </p>
        
        {/* Article metadata */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs sm:text-sm text-gray-500 mb-4 gap-1 sm:gap-2 min-w-0">
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
          <meta itemProp="url" content={`https://www.trueallyguide.com/blog/${slug}`} />
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
