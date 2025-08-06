import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { sortedBlogPosts, categories, slugToCategoryMap, categorySlugMap } from '../blogData';
import BlogCard from '../components/BlogCard';
import Seo from '../components/Seo';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const displayName = slugToCategoryMap[categoryName] || decodeURIComponent(categoryName);
  
  const filteredPosts = sortedBlogPosts.filter(post => post.category === displayName);

  const getCategoryDescription = (category) => {
    const descriptions = {
      'Introversion & Personality': 'Discover insights about introversion, personality types, and how to leverage your natural strengths as an introverted woman.',
      'Relationships & Dating': 'Navigate relationships and dating with confidence, from setting boundaries to communicating effectively.',
      'Career & Workplace': 'Advance your career while staying true to your introverted nature, prevent burnout, and create workplace success.',
      'Self-Development': 'Build confidence, develop new skills, and create the life you want through intentional self-improvement.',
      'Women\'s Wellness': 'Prioritize your mental, physical, and emotional well-being with practical wellness strategies for women.'
    };
    return descriptions[category] || 'Explore articles in this category to enhance your personal growth journey.';
  };
  return (
    <>
    <div className="bg-white min-h-screen">
      <Seo
        title={`${displayName} - Blog Category`}
        description={`Explore all articles in the ${displayName} category. ${getCategoryDescription(displayName)}`}
        path={`/category/${categoryName}`}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Categories', item: '/categories' },
          { name: displayName, item: `/category/${categoryName}` },
        ]}
      />
      
      <div className="container mx-auto px-6 py-12">
        <Link to="/" className="text-brand-emphasis hover:text-brand-dark font-semibold mb-8 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Home
        </Link>
        
        {/* Category Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">{displayName}</h1>
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
        ) : (
          <div className="text-center py-16">
            <div className="bg-brand-light rounded-lg p-12">
              <h3 className="text-2xl font-bold text-brand-dark mb-4">No Articles Yet</h3>
              <p className="text-brand-primary mb-6">
                We're working on adding more content to this category. Check back soon!
              </p>
              <Link 
                to="/blog"
                className="bg-brand-emphasis text-white font-semibold py-3 px-6 rounded-full hover:bg-opacity-90 transition-colors inline-block"
              >
                Browse All Articles
              </Link>
            </div>
          </div>
        )}

        {/* Other Categories */}
        <div className="mt-20 pt-12 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-brand-dark mb-8 text-center">Explore Other Categories</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.values(categories).filter(cat => cat !== displayName).map((otherCategory) => (
              <Link
                key={otherCategory}
                to={`/category/${categorySlugMap[otherCategory]}`}
                className="px-6 py-3 rounded-full font-semibold bg-gray-100 text-brand-dark hover:bg-brand-light hover:text-brand-emphasis transition-colors inline-block"
              >
                {otherCategory}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CategoryPage;