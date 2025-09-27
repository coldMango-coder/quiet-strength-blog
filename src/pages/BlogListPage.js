import React, { useState } from 'react';
import NormalizedLink from '../components/NormalizedLink';
import { Helmet } from 'react-helmet-async';
import { sortedBlogPosts, categories, categorySlugMap } from '../blogData';
import BlogCard from '../components/BlogCard';
import Seo from '../components/Seo';

const BlogListPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    window.scrollTo(0, 0);
  };

  const filteredPosts = selectedCategory
   ? sortedBlogPosts.filter(p => p.category === selectedCategory)
   : sortedBlogPosts;

  return (
    <>
      <div className="bg-white">
        <Seo
          title={selectedCategory ? `${selectedCategory} Articles` : 'Blog'}
          description={`Read all blog posts${selectedCategory ? ` in the ${selectedCategory} category` : ''}.`}
          path={selectedCategory ? `/blog?category=${categorySlugMap[selectedCategory] || selectedCategory}` : '/blog'}
          breadcrumbs={[
            { name: 'Home', item: '/' },
            { name: 'Blog', item: '/blog' },
            ...(selectedCategory ? [{ name: selectedCategory, item: `/blog?category=${categorySlugMap[selectedCategory] || selectedCategory}` }] : []),
          ]}
        />
        <div className="container mx-auto px-6 py-12">
          <NormalizedLink to="/" className="text-indigo-600 hover:text-indigo-800 font-semibold mb-8 inline-block">&larr; Back to Home</NormalizedLink>
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-800">{selectedCategory || 'From the Blog'}</h2>
          
          {/* Category Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                !selectedCategory 
                  ? 'bg-brand-dark text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Articles
            </button>
            {Object.values(categories).map((categoryName) => (
              <button
                key={categoryName}
                onClick={() => handleCategoryChange(categoryName)}
                className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                  selectedCategory === categoryName 
                    ? 'bg-brand-dark text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {categoryName}
              </button>
            ))}
          </div>
          
          {!selectedCategory && (
            <section className="mb-16">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Latest Post</h3>
              <div className="flex justify-center">
                <BlogCard
                  post={sortedBlogPosts[0]}
                  linkTo={`/blog/${sortedBlogPosts[0].slug}`}
                />
              </div>
            </section>
          )}

          <section>
            <h3 className="text-2xl font-bold text-slate-800 mb-6">{selectedCategory ? 'Posts' : 'All Posts'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogCard
                  key={post.slug}
                  post={post}
                  linkTo={`/blog/${post.slug}`}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default BlogListPage;
