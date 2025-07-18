import React from 'react';

const BlogCard = ({ post, onReadMore }) => {
  const { title, description, category, image, datePublished, readingTime, slug } = post;

  return (
    <article className="w-full rounded-lg border border-gray-200 shadow-md bg-white flex flex-col overflow-hidden transform hover:-translate-y-1 transition-transform duration-300" itemScope itemType="https://schema.org/BlogPosting">
      <div className="overflow-hidden">
        <img 
          className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300" 
          src={image} 
          alt={`${title} - Self-help article for introverted women`}
          width="400"
          height="192"
          loading="lazy"
          itemProp="image"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-sm font-semibold text-brand-emphasis mb-2" itemProp="articleSection">{category}</span>
        <h3 className="text-xl font-bold text-brand-dark mb-2 leading-tight" itemProp="headline">
          {title}
        </h3>
        <p className="text-gray-600 text-base mb-4 flex-grow leading-relaxed" itemProp="description">
          {description}
        </p>
        
        {/* Article metadata */}
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          {datePublished && (
            <time dateTime={datePublished} itemProp="datePublished">
              {new Date(datePublished).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </time>
          )}
          {readingTime && (
            <span className="text-brand-primary">
              {readingTime} min read
            </span>
          )}
        </div>
        
        <button
          onClick={onReadMore}
          className="font-semibold text-brand-emphasis hover:underline text-left self-start mt-auto"
          aria-label={`Read full article: ${title}`}
        >
          Read More &rarr;
        </button>
        
        {/* Hidden schema markup */}
        <div className="sr-only">
          <span itemProp="author" itemScope itemType="https://schema.org/Person">
            <span itemProp="name">Marica Šinko</span>
          </span>
          <meta itemProp="url" content={`https://quietstrength.com/blog/${slug}`} />
        </div>
      </div>
    </article>
  );
};

export default BlogCard;