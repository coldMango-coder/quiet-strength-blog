import React from 'react';
import NormalizedLink from './NormalizedLink';
import { sortedBlogPosts } from '../blogData';
import BlogCard from './BlogCard';

const Blog = () => {
  const latestPost = sortedBlogPosts[0];
  const recentPosts = sortedBlogPosts.slice(1, 4);

  return (
    <section id="blog" className="py-24 bg-brand-light">
      <div className="container mx-auto px-6">
        <div className="text-left mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-brand-dark">Latest Insights & Articles</h2>
        </div>

        {/* Featured Article */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-16 flex flex-col lg:flex-row items-stretch min-w-0 max-w-full overflow-hidden">
          <div className="lg:w-1/2 xl:w-7/12 mb-6 lg:mb-0 lg:pr-6 xl:pr-12 flex-shrink-0 min-w-0">
            <div className="w-full aspect-[16/9] rounded-xl overflow-hidden">
              <picture>
                <source srcSet={`${latestPost.image.replace(/\.[^/.]+$/, '')}.avif`} type="image/avif" />
                <source srcSet={`${latestPost.image.replace(/\.[^/.]+$/, '')}.webp`} type="image/webp" />
                <img
                  src={latestPost.image}
                  alt={`Featured article: ${latestPost.title} - self-help guide for introverted women`}
                  width="960"
                  height="540"
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                  className="w-full h-full object-cover"
                />
              </picture>
            </div>
          </div>
          <div className="lg:w-1/2 xl:w-5/12 flex flex-col justify-center min-w-0 max-w-full">
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-brand-dark mb-4 leading-tight break-words max-w-full">
              {latestPost.title}
            </h3>
            <p className="text-brand-primary mb-6 text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed break-words max-w-full">
              {latestPost.description}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6 min-w-0">
              <span className="text-xs sm:text-sm text-brand-primary font-medium flex-shrink-0">
                {latestPost.readTime}
              </span>
              <span className="text-xs sm:text-sm text-brand-primary break-words">
                {latestPost.category}
              </span>
            </div>
            <NormalizedLink 
              to={`/blog/${latestPost.slug}`}
              className="text-brand-emphasis font-semibold hover:underline text-sm sm:text-base lg:text-lg self-start break-words"
            >
              Read the Full Article &rarr;
            </NormalizedLink>
          </div>
        </div>

        {/* Recent Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 mb-16">
          {recentPosts.map((post, idx) => (
            <BlogCard
              key={post.slug}
              post={post}
              linkTo={`/blog/${post.slug}`}
              priority={idx === 0}
            />
          ))}
        </div>


        <div className="text-center">
          <NormalizedLink to="/blog" className="bg-brand-dark text-white font-bold py-4 px-10 rounded-full hover:bg-opacity-90 transition duration-300 transform hover:scale-105 inline-block">
            View All Articles
          </NormalizedLink>
        </div>
      </div>
    </section>
  );
};

export default Blog;
