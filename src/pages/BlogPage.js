import React, { useState } from 'react';
import { sortedBlogPosts } from '../blogData';
import BlogCard from '../components/BlogCard';
import Seo from '../components/Seo';

const BlogPage = ({ onBack, category, slug }) => {
  const [selectedPostSlug, setSelectedPostSlug] = useState(slug);

  const handleReadMore = (slug) => {
    setSelectedPostSlug(slug);
    window.scrollTo(0, 0);
  };

  const handleBackToList = () => {
    setSelectedPostSlug(null);
    window.scrollTo(0, 0);
  };

  const postToRender = sortedBlogPosts.find(p => p.slug === selectedPostSlug);

  if (postToRender) {
    const PostComponent = postToRender.component;
    return (
      <>
        <Seo
          title={postToRender.title}
          description={postToRender.description}
          type="article"
          path={`/blog/${postToRender.slug}`}
          article={{
            title: postToRender.title,
            authorName: 'Marica Šinko',
            datePublished: postToRender.date,
            image: postToRender.image,
          }}
        />
        <PostComponent onBack={onBack} />
      </>
    );
  }

  const filteredPosts = category ? sortedBlogPosts.filter(p => p.category === category) : sortedBlogPosts;

  return (
    <div className="bg-white">
      <Seo
        title={category || 'Blog'}
        description={`Read all blog posts${category ? ` in the ${category} category` : ''}.`}
        path={category ? `/blog/${category}` : '/blog'}
      />
      <div className="container mx-auto px-6 py-12">
        <button onClick={onBack} className="text-indigo-600 hover:text-indigo-800 font-semibold mb-8">&larr; Back to Home</button>
        <h2 className="text-4xl font-bold text-center mb-12 text-slate-800">{category || 'From the Blog'}</h2>
        
        {!category && (
          <section className="mb-16">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Latest Post</h3>
            <div className="flex justify-center">
              <BlogCard
                post={sortedBlogPosts[0]}
                onReadMore={() => handleReadMore(sortedBlogPosts[0].slug)}
              />
            </div>
          </section>
        )}

        <section>
          <h3 className="text-2xl font-bold text-slate-800 mb-6">{category ? 'Posts' : 'All Posts'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard
                key={post.slug}
                post={post}
                onReadMore={() => handleReadMore(post.slug)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPage;