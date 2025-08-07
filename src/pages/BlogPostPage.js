import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { sortedBlogPosts } from '../blogData';
import Seo from '../components/Seo';
import NotFoundPage from './NotFoundPage';

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = sortedBlogPosts.find(p => p.slug === slug);

  if (!post) {
    return <NotFoundPage />;
  }

  const PostComponent = post.component;

  return (
    <>
      <Seo
        title={post.title}
        description={post.description}
        type="article"
        article={{
          title: post.title,
          authorName: 'Marica Šinko',
          datePublished: `${post.date}T00:00:00+00:00`,
          image: post.image,
        }}
      />
      <Suspense 
        fallback={
          <div className="flex justify-center items-center py-24">
            <div className="text-brand-primary animate-pulse">Loading article...</div>
          </div>
        }
      >
        <PostComponent />
      </Suspense>
    </>
  );
};

export default BlogPostPage;