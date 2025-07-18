import BlogPostBurnout from './pages/BlogPostBurnout';
import BlogPostConfidence from './pages/BlogPostConfidence';
import BlogPostProductivity from './pages/BlogPostProductivity';
import BlogPostSayingNo from './components/BlogPostSayingNo';
import BlogPostSayingNoWithoutGuilt from './components/BlogPostSayingNoWithoutGuilt';

export const categories = {
  INTROVERSION_PERSONALITY: 'Introversion & Personality',
  RELATIONSHIPS_DATING: 'Relationships & Dating',
  CAREER_WORKPLACE: 'Career & Workplace',
  SELF_DEVELOPMENT: 'Self-Development',
  WOMENS_WELLNESS: 'Women\'s Wellness',
};

export const blogPosts = [
  {
    slug: 'how-to-say-no-without-guilt',
    title: 'How to Say No Without Guilt: Real-Life Scripts for Work, Family & Friends',
    description: 'Learn how to say no without guilt. Real scripts for work, family & friends + emotional aftercare. Free 20 Script PDF.',
    date: '2025-07-18',
    category: categories.RELATIONSHIPS_DATING,
    component: BlogPostSayingNoWithoutGuilt,
    image: '/images/sayingNowithoutGuiltimage.png',
    readTime: '12 min read',
  },
  {
    slug: 'art-of-saying-no',
    title: 'The Art of Saying No: A Guide for People-Pleasers',
    description: 'Reclaim your time and energy by learning how to set boundaries with grace and confidence.',
    date: '2025-07-14',
    category: categories.SELF_DEVELOPMENT,
    component: BlogPostSayingNo,
    image: '/images/image4.png',
    readTime: '6 min read',
  },
  {
    slug: 'prevent-professional-burnout',
    title: "How to Prevent Professional Burnout: A Woman's Essential Guide",
    description: 'Learn to identify the signs of burnout and build a sustainable, fulfilling career.',
    date: '2025-07-12',
    category: categories.CAREER_WORKPLACE,
    component: BlogPostBurnout,
    image: '/images/image1.png',
    readTime: '8 min read',
  },
  {
    slug: 'building-quiet-confidence',
    title: "Building Quiet Confidence: An Introvert's Guide",
    description: 'Transform self-doubt into authentic self-esteem and navigate any room with quiet strength.',
    date: '2025-07-10',
    category: categories.INTROVERSION_PERSONALITY,
    component: BlogPostConfidence,
    image: '/images/image1.png',
    readTime: '7 min read',
  },
  {
    slug: 'introvert-friendly-productivity',
    title: 'Introvert-Friendly Productivity',
    description: 'Optimize your workflow by leveraging your natural energy cycles. Achieve more with less stress.',
    date: '2025-07-08',
    category: categories.INTROVERSION_PERSONALITY,
    component: BlogPostProductivity,
    image: '/images/image1.png',
    readTime: '5 min read',
  },
];

export const sortedBlogPosts = blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));