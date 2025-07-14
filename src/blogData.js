import BlogPostBurnout from './pages/BlogPostBurnout';
import BlogPostConfidence from './pages/BlogPostConfidence';
import BlogPostProductivity from './pages/BlogPostProductivity';
import BlogPostSayingNo from './components/BlogPostSayingNo';

export const categories = {
  CONFIDENCE: 'Building Quiet Confidence',
  PRODUCTIVITY: 'Introvert-Friendly Productivity',
  WELLBEING: 'Burnout Prevention & Well-being',
  ASSERTIVENESS: 'Graceful Assertiveness',
  WEALTH: 'Wealth Building for Introverts',
  CONNECTIONS: 'Meaningful Connections',
};

export const blogPosts = [
  {
    slug: 'art-of-saying-no',
    title: 'The Art of Saying No: A Guide for People-Pleasers',
    description: 'Reclaim your time and energy by learning how to set boundaries with grace and confidence.',
    date: '2025-07-14',
    category: categories.ASSERTIVENESS,
    component: BlogPostSayingNo,
    image: '/images/image1.png',
  },
  {
    slug: 'prevent-professional-burnout',
    title: "How to Prevent Professional Burnout: A Woman's Essential Guide",
    description: 'Learn to identify the signs of burnout and build a sustainable, fulfilling career.',
    date: '2025-07-12',
    category: categories.WELLBEING,
    component: BlogPostBurnout,
    image: '/images/image1.png',
  },
  {
    slug: 'building-quiet-confidence',
    title: "Building Quiet Confidence: An Introvert's Guide",
    description: 'Transform self-doubt into authentic self-esteem and navigate any room with quiet strength.',
    date: '2025-07-10',
    category: categories.CONFIDENCE,
    component: BlogPostConfidence,
    image: '/images/image1.png',
  },
  {
    slug: 'introvert-friendly-productivity',
    title: 'Introvert-Friendly Productivity',
    description: 'Optimize your workflow by leveraging your natural energy cycles. Achieve more with less stress.',
    date: '2025-07-08',
    category: categories.PRODUCTIVITY,
    component: BlogPostProductivity,
    image: '/images/image1.png',
  },
];

export const sortedBlogPosts = blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));