import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
      <Helmet>
        <link rel="canonical" href={`https://trueallyguide.com/blog/${post.slug}`} />
      </Helmet>
      <Seo
        title={post.title}
        description={post.description}
        type="article"
        path={`/blog/${post.slug}`}
        article={{
          title: post.title,
          authorName: 'Marica Šinko',
          datePublished: post.date,
          image: post.image,
        }}
      />
      <PostComponent />
    </>
  );
};

export default BlogPostPage;