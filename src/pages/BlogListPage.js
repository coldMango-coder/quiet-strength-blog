import React, { useState } from 'react';
import NormalizedLink from '../components/NormalizedLink';
import { sortedBlogPosts, categories, categorySlugMap } from '../blogData';
import BlogCard from '../components/BlogCardFixed.jsx';
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
      <div className="bg-brand-light min-h-screen">
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

        {/* Header */}
        <div className="bg-brand-secondary/30 py-16 md:py-24 mb-12">
          <div className="container-wide text-center">
            <NormalizedLink to="/" className="inline-flex items-center text-brand-primary font-semibold mb-6 hover:text-brand-emphasis transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Home
            </NormalizedLink>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-emphasis mb-6 tracking-tight">
              {selectedCategory || 'From the Blog'}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Insights, strategies, and stories for the quiet strength within you.
            </p>
          </div>
        </div>

        <div className="container-wide pb-24">
          {/* Category Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${!selectedCategory
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-primary hover:text-brand-primary'
                }`}
            >
              All Articles
            </button>
            {Object.values(categories).map((categoryName) => (
              <button
                key={categoryName}
                onClick={() => handleCategoryChange(categoryName)}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${selectedCategory === categoryName
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-primary hover:text-brand-primary'
                  }`}
              >
                {categoryName}
              </button>
            ))}
          </div>

          {!selectedCategory && (
            <section className="mb-20">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-brand-emphasis">Latest Article</h3>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="md:flex">
                  <div className="md:w-1/2 lg:w-7/12 relative min-h-[300px]">
                    <img
                      src={sortedBlogPosts[0].image}
                      alt={sortedBlogPosts[0].title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 md:w-1/2 lg:w-5/12 flex flex-col justify-center">
                    <div className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-3">
                      {sortedBlogPosts[0].category}
                    </div>
                    <h2 className="text-3xl font-bold text-brand-emphasis mb-4 leading-tight">
                      <NormalizedLink to={`/blog/${sortedBlogPosts[0].slug}`} className="hover:text-brand-primary transition-colors">
                        {sortedBlogPosts[0].title}
                      </NormalizedLink>
                    </h2>
                    <p className="text-gray-600 mb-6 line-clamp-3 text-lg">
                      {sortedBlogPosts[0].description}
                    </p>
                    <NormalizedLink
                      to={`/blog/${sortedBlogPosts[0].slug}`}
                      className="inline-flex items-center font-bold text-brand-emphasis hover:text-brand-primary transition-colors"
                    >
                      Read Article <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </NormalizedLink>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section>
            <h3 className="text-2xl font-bold text-brand-emphasis mb-8">{selectedCategory ? 'Articles' : 'More Articles'}</h3>
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
