import React from 'react';
import { useParams } from 'react-router-dom';
import NormalizedLink from '../components/NormalizedLink';
import { sortedBlogPosts, categories, slugToCategoryMap, categorySlugMap } from '../blogData';
import BlogCard from '../components/BlogCard';
import Seo from '../components/Seo';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const displayName = slugToCategoryMap[categoryName] || decodeURIComponent(categoryName);
  
  const filteredPosts = sortedBlogPosts.filter(post => post.category === displayName);

  const getCategoryDescription = (category) => {
    const descriptions = {
      'Introversion & Personality': 'Insights on introversion and personality types with practical ways to leverage your strengths as an introverted woman.',
      'Relationships & Dating': 'Explore articles on relationships and dating with confidence—boundaries, healthy communication, and intentional choices for introverted women.',
      'Career & Workplace': 'Advance your career without burnout. Practical advice for introverted women on boundaries, focus, and sustainable success.',
      'Self-Development': 'Personal growth strategies and practical self-improvement for introverted women—build confidence with small steps.',
      'Women\'s Wellness': 'Holistic wellness focused on mental health, energy management, and self-care for introverted women.'
    };
    return descriptions[category] || 'Explore articles in this category to enhance your personal growth journey.';
  };
  return (
    <>
    <div className="bg-white min-h-screen">
      <Seo
        title={`${displayName} - Blog Category`}
        description={`Explore all articles in the ${displayName} category. ${getCategoryDescription(displayName)}`}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Categories', item: '/categories' },
          { name: displayName, item: `/category/${categoryName}` },
        ]}
      />
      
      <div className="container mx-auto px-6 py-12">
        <NormalizedLink to="/" className="text-brand-emphasis hover:text-brand-dark font-semibold mb-8 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Home
        </NormalizedLink>
        
        {/* Category Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6 text-balance whitespace-normal break-words hyphens-none tracking-tight leading-tight">{displayName}</h1>
          <p className="text-xl text-brand-primary max-w-3xl mx-auto leading-relaxed">
            {getCategoryDescription(displayName)}
          </p>
          <div className="mt-8 flex justify-center">
            <div className="bg-brand-light px-6 py-3 rounded-full">
              <span className="text-brand-emphasis font-semibold">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'Article' : 'Articles'}
              </span>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {filteredPosts.length > 0 ? (
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <BlogCard
                  key={post.slug}
                  post={post}
                  linkTo={`/blog/${post.slug}`}
                />
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-16">
            <div className="bg-brand-light rounded-lg p-12">
              <h3 className="text-2xl font-bold text-brand-dark mb-4">No Articles Yet</h3>
              <p className="text-brand-primary mb-6">
                We're working on adding more content to this category. Check back soon!
              </p>
              <NormalizedLink 
                to="/blog"
                className="bg-brand-emphasis text-white font-semibold py-3 px-6 rounded-full hover:bg-opacity-90 transition-colors inline-block"
              >
                Browse All Articles
              </NormalizedLink>
            </div>
          </div>
        )}

        {/* Other Categories */}
        <div className="mt-20 pt-12 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-brand-dark mb-8 text-center text-balance">Explore Other Categories</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.values(categories).filter(cat => cat !== displayName).map((otherCategory) => (
              <NormalizedLink
                key={otherCategory}
                to={`/category/${categorySlugMap[otherCategory]}`}
                className="px-6 py-3 rounded-full font-semibold bg-gray-100 text-brand-dark hover:bg-brand-light hover:text-brand-emphasis transition-colors inline-block"
              >
                {otherCategory}
              </NormalizedLink>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CategoryPage;
