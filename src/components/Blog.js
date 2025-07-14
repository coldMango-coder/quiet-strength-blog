import React from 'react';

import { sortedBlogPosts } from '../blogData';
import BlogCard from './BlogCard';

const Blog = ({ onNavigate }) => {
  const latestPost = sortedBlogPosts[0];
  const recentPosts = sortedBlogPosts.slice(1, 4);

  return (
    <section id="blog" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Latest Insights & Articles</h2>
        </div>

        {/* Featured Article */}
        <div className="bg-gray-100 rounded-lg shadow-lg p-8 mb-12 flex flex-col md:flex-row items-center">
          <div className="md:w-1/3 mb-8 md:mb-0 md:pr-8">
            <img src={latestPost.image} alt={latestPost.title} className="rounded-lg shadow-md"/>
          </div>
          <div className="md:w-2/3">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">{latestPost.title}</h3>
            <p className="text-slate-600 mb-6">{latestPost.description}</p>
            <button onClick={() => onNavigate('blog', null, latestPost.slug)} className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-full hover:bg-indigo-700 transition duration-300">
              Read the Full Article
            </button>
          </div>
        </div>

        {/* Recent Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {recentPosts.map((post) => (
            <BlogCard
              key={post.slug}
              post={post}
              onReadMore={() => onNavigate('blog', null, post.slug)}
            />
          ))}
        </div>

        <div className="text-center">
          <button onClick={() => onNavigate('blog')} className="bg-slate-800 text-white font-bold py-3 px-8 rounded-full hover:bg-slate-900 transition duration-300">
            View All Articles
          </button>
        </div>
      </div>
    </section>
  );
};

export default Blog;