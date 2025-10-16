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
  // Short SEO titles for <title> only (keep H1 content unchanged)
  const seoTitleMap = {
    'how-to-know-if-you-deserve-better-relationship-introvert-woman-guide': 'Do You Deserve Better? 7 Clear Signs for Introvert Women',
    'how-to-stop-attracting-narcissists-9-proven-strategies': 'How to Stop Attracting Narcissists: 9 Proven Strategies',
    'how-to-be-confident-as-an-introvert-woman-guide': 'How to Be Confident as an Introvert Woman',
    'how-to-speak-up-in-meetings-introvert-strategies-2025': 'How to Speak Up in Meetings as an Introvert',
    'introvert-social-battery-drained-recovery-methods': 'Introvert Social Battery Drained? 9 Ways to Recharge',
    'morning-routine-for-confidence-and-productivity-2025': 'Morning Routine for Confidence and Productivity',
    'post-breakup-glow-up-transformation-guide-10-proven-steps-to-become-your-best-self-in-2025': 'Post-Breakup Glow Up: 10 Steps',
  };
  const seoTitle = seoTitleMap[post.slug] || post.title;

  return (
    <>
      <Seo
        title={seoTitle}
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