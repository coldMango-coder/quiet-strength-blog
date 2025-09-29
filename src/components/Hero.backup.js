import React from 'react';
import NormalizedLink from './NormalizedLink';
import { sortedBlogPosts } from '../blogData';
import OptimizedImage from './OptimizedImage';

const Hero = () => {
  return (
    <section id="home" className="relative bg-brand-light text-brand-dark py-32 md:py-48">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col gap-8 items-center max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-tight mb-6">
              Quiet Strength: Self-Help for Introverted Women
            </h1>
            <p className="text-lg md:text-xl lg:text-xl text-brand-primary max-w-2xl mb-8 mx-auto leading-relaxed">
              Your essential guide to building confidence, managing energy, finding purpose, and achieving financial freedom — on your own terms.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 mb-12 justify-center">
              <a
                href="#newsletter"
                className="bg-brand-emphasis text-white font-bold py-4 px-10 rounded-full hover:bg-opacity-90 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg text-center"
              >
                Join the Community
              </a>
              <a
                href="#blog"
                className="text-brand-emphasis font-bold py-4 px-10 rounded-full hover:bg-brand-secondary transition duration-300 ease-in-out transform hover:scale-105 text-center"
              >
                Read the Blog
              </a>
            </div>
          </div>
          <div className="w-full max-w-2xl min-w-0">
            {/* Latest Insights & Articles Section */}
            <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100 min-h-fit min-w-0">
              <div className="flex items-center justify-between mb-4 sm:mb-6 min-w-0">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-dark flex-shrink-0">Latest Insights</h2>
                <NormalizedLink 
                  to="/blog"
                  className="text-brand-emphasis text-xs sm:text-sm font-semibold hover:underline hover:text-brand-dark transition-colors flex-shrink-0 ml-2"
                >
                  View All &rarr;
                </NormalizedLink>
              </div>
              
              <div className="space-y-6 lg:space-y-8">
                {sortedBlogPosts.slice(0, 3).map((post, index) => (
                  <NormalizedLink key={post.slug} to={`/blog/${post.slug}`} className={`flex items-start group cursor-pointer p-2 sm:p-3 lg:p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 min-w-0 ${index === 0 ? 'bg-gradient-to-r from-brand-secondary/30 to-transparent border-l-4 border-brand-emphasis' : ''}`}>
                    <OptimizedImage 
                      src={post.image} 
                      alt={post.title}
                      className={`rounded-lg flex-shrink-0 shadow-sm ${index === 0 ? 'w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48' : 'w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40'}`}
                      width={index === 0 ? 192 : 160}
                      height={index === 0 ? 192 : 160}
                      sizes={index === 0 ? '(max-width: 640px) 96px, (max-width: 768px) 128px, (max-width: 1024px) 160px, 192px' : '(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 128px, 160px'}
                      priority={index === 0} // First image should load immediately
                    />
                    <div className={`flex-1 min-w-0 ${index === 0 ? 'ml-3 sm:ml-4 md:ml-6 lg:ml-8' : 'ml-2 sm:ml-3 md:ml-4 lg:ml-6'}`}>
                      {index === 0 && (
                        <div className="flex items-center mb-2">
                          <span className="bg-brand-emphasis text-white text-xs font-bold px-2 py-1 rounded-full mr-2">
                            LATEST
                          </span>
                        </div>
                      )}
                      <h3 className={`font-bold text-brand-dark group-hover:text-brand-emphasis transition-colors mb-2 leading-tight overflow-wrap-break-word ${index === 0 ? 'text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl' : 'text-xs sm:text-sm md:text-base lg:text-lg'}`}>
                        {post.title}
                      </h3>
                      <p className={`text-brand-primary mb-3 leading-relaxed overflow-wrap-break-word ${index === 0 ? 'text-xs sm:text-sm lg:text-base' : 'text-xs lg:text-sm'}`}>
                        {post.description}
                      </p>
                      <div className="flex items-center justify-between min-w-0">
                        <span className="text-xs text-brand-primary bg-brand-secondary px-1 sm:px-2 lg:px-3 py-1 rounded-full font-medium truncate max-w-20 sm:max-w-32 lg:max-w-40">
                          {post.category}
                        </span>
                        <time className="text-xs text-gray-500 font-medium flex-shrink-0 ml-1 sm:ml-2">
                          {new Date(post.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </time>
                      </div>
                    </div>
                  </NormalizedLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

