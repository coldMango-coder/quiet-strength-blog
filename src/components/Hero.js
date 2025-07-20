import React from 'react';
import { sortedBlogPosts } from '../blogData';

const Hero = ({ onNavigate }) => {
  return (
    <section id="home" className="relative bg-brand-light text-brand-dark py-32 md:py-48">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col gap-8 items-center max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold mb-8">
              Quiet Strength: Self-Help for Introverted Women
            </h1>
            <p className="text-lg md:text-xl lg:text-xl text-brand-primary max-w-2xl mb-8 mx-auto">
              Your essential guide to building confidence, managing energy, finding purpose, and achieving financial freedom – on your own terms.
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
          <div className="w-full max-w-2xl">
            {/* Latest Insights & Articles Section */}
            <div className="bg-white rounded-xl shadow-xl p-6 lg:p-8 border border-gray-100 min-h-fit">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl lg:text-2xl font-bold text-brand-dark">Latest Insights</h3>
                <button 
                  onClick={() => onNavigate('blog')}
                  className="text-brand-emphasis text-sm font-semibold hover:underline hover:text-brand-dark transition-colors"
                >
                  View All →
                </button>
              </div>
              
              <div className="space-y-6 lg:space-y-8">
                {sortedBlogPosts.slice(0, 3).map((post, index) => (
                  <div key={post.slug} className={`flex items-start group cursor-pointer p-3 lg:p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 min-w-0 ${index === 0 ? 'bg-gradient-to-r from-brand-secondary/30 to-transparent border-l-4 border-brand-emphasis' : ''}`} onClick={() => onNavigate('blog', null, post.slug)}>
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className={`rounded-lg object-cover flex-shrink-0 shadow-sm ${index === 0 ? 'w-40 h-40 lg:w-48 lg:h-48' : 'w-32 h-32 lg:w-40 lg:h-40'}`}
                    />
                    <div className={`flex-1 min-w-0 ${index === 0 ? 'ml-6 lg:ml-8' : 'ml-4 lg:ml-6'}`}>
                      {index === 0 && (
                        <div className="flex items-center mb-2">
                          <span className="bg-brand-emphasis text-white text-xs font-bold px-2 py-1 rounded-full mr-2">
                            LATEST
                          </span>
                        </div>
                      )}
                      <h4 className={`font-bold text-brand-dark group-hover:text-brand-emphasis transition-colors mb-2 leading-tight overflow-wrap-break-word ${index === 0 ? 'text-lg lg:text-xl xl:text-2xl' : 'text-base lg:text-lg'}`}>
                        {post.title}
                      </h4>
                      <p className={`text-brand-primary mb-3 leading-relaxed overflow-wrap-break-word ${index === 0 ? 'text-sm lg:text-base' : 'text-xs lg:text-sm'}`}>
                        {post.description}
                      </p>
                      <div className="flex items-center justify-between min-w-0">
                        <span className="text-xs text-brand-primary bg-brand-secondary px-2 lg:px-3 py-1 rounded-full font-medium truncate max-w-32 lg:max-w-40">
                          {post.category}
                        </span>
                        <time className="text-xs text-gray-500 font-medium flex-shrink-0 ml-2">
                          {new Date(post.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </time>
                      </div>
                    </div>
                  </div>
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