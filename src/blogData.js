import BlogPostBurnout from './pages/BlogPostBurnout';
import BlogPostSayingNo from './components/BlogPostSayingNo';
import BlogPostSayingNoWithoutGuilt from './components/BlogPostSayingNoWithoutGuilt';
import BlogPostRelationshipSigns from './pages/BlogPostRelationshipSigns';
import BlogPostSocialBattery from './pages/BlogPostSocialBattery';
import BlogPostIntentionalDating from './pages/BlogPostIntentionalDating';
import BlogPostMeetings from './pages/BlogPostMeetings';
import BlogPostToxicRelationship from './pages/BlogPostToxicRelationship';
import BlogPostSocialMediaOverwhelm from './pages/BlogPostSocialMediaOverwhelm';
import BlogPostNarcissistRecovery from './pages/BlogPostNarcissistRecovery';

export const categories = {
  INTROVERSION_PERSONALITY: 'Introversion & Personality',
  RELATIONSHIPS_DATING: 'Relationships & Dating',
  CAREER_WORKPLACE: 'Career & Workplace',
  SELF_DEVELOPMENT: 'Self-Development',
  WOMENS_WELLNESS: 'Women\'s Wellness',
};

export const blogPosts = [
  {
    slug: 'emotional-manipulation-tactics-narcissist-ex-recovery-12-proven-steps-to-reclaim-your-life-in-2025',
    title: 'Emotional Manipulation Tactics Narcissist Ex Recovery: 12 Proven Steps to Reclaim Your Life in 2025',
    description: 'Learn to identify emotional manipulation tactics used by narcissist ex partners and discover 12 proven recovery steps to reclaim your life, rebuild confidence, and heal from narcissistic abuse in 2025.',
    date: '2025-07-27',
    category: categories.RELATIONSHIPS_DATING,
    component: BlogPostNarcissistRecovery,
    image: '/images/20250727_1641_Triumphant Mountain Sunrise_simple_compose_01k1657wqnedvvh014vmnxfjqv.jpg',
    readTime: '8 min read',
  },
  {
    slug: 'introvert-overwhelmed-by-social-media-8-proven-coping-strategies-that-actually-work-in-2025',
    title: 'Introvert Overwhelmed by Social Media: 8 Proven Coping Strategies That Actually Work in 2025',
    description: 'Are you an introvert overwhelmed by social media? Discover 8 scientifically-backed coping strategies to reduce digital overwhelm and protect your mental energy in 2025.',
    date: '2025-07-26',
    category: categories.INTROVERSION_PERSONALITY,
    component: BlogPostSocialMediaOverwhelm,
    image: '/images/introvert-overwhelmed-by-social-media-sitting-alone-with-multiple-screens-showing-overwhelming-social-feeds.jpg',
    readTime: '6 min read',
  },
  {
    slug: 'how-to-love-yourself-after-a-toxic-relationship-8-proven-steps-that-actually-work-in-2025',
    title: 'How to Love Yourself After a Toxic Relationship: 8 Proven Steps That Actually Work in 2025',
    description: 'Learn how to love yourself after a toxic relationship with expert-backed strategies. Discover 8 proven steps to rebuild self-worth and find inner peace in 2025.',
    date: '2025-07-24',
    category: categories.RELATIONSHIPS_DATING,
    component: BlogPostToxicRelationship,
    image: '/images/woman-embracing-self-love-freedom-toxic-relationship-recovery-mountain-peak-sunrise-new-beginnings-personal-growth.jpg',
    readTime: '8 min read',
  },
  {
    slug: 'how-to-speak-up-in-meetings-introvert-strategies-2025',
    title: 'How to Speak Up in Meetings as an Introvert: 9 Proven Strategies That Actually Work in 2025',
    description: 'Learn how to speak up in meetings as introvert with 9 proven strategies. Discover confidence-building techniques, preparation methods, and communication tips that help introverted professionals thrive in workplace meetings without changing who you are.',
    date: '2025-07-22',
    category: categories.CAREER_WORKPLACE,
    component: BlogPostMeetings,
    image: '/images/confident-introvert-business-meeting.jpg',
    readTime: '15 min read',
  },
  {
    slug: 'intentional-dating-2025-guide',
    title: 'Intentional Dating 2025: How to Date Purposefully (7 Proven Steps)',
    description: 'Learn how to date purposefully in 2025 with our complete guide to intentional dating. Discover 7 proven steps that actually work for meaningful relationships.',
    date: '2025-07-21',
    category: categories.RELATIONSHIPS_DATING,
    component: BlogPostIntentionalDating,
    image: '/images/intentional-dating-coffee-conversation.jpg',
    readTime: '18 min read',
  },
  {
    slug: 'introvert-social-battery-drained-recovery-methods',
    title: 'Introvert Social Battery Drained: 9 Proven Recovery Methods That Actually Work in 2025',
    description: 'Discover 9 proven ways to recharge when your social battery is drained. Expert-backed recovery methods for introverts in 2025. Learn effective strategies now.',
    date: '2025-07-20',
    category: categories.INTROVERSION_PERSONALITY,
    component: BlogPostSocialBattery,
    image: '/images/introvert-social-battery-recovery-tea.jpg',
    readTime: '12 min read',
  },
  {
    slug: 'how-to-know-if-you-deserve-better-relationship-introvert-woman-guide',
    title: 'How to Know if You Deserve Better in Your Relationship: 7 Clear Signs Every Introvert Woman Must Recognize in 2025',
    description: 'Discover 7 proven signs that show you deserve better in your relationship as an introvert woman. Learn to recognize your worth and make empowered decisions in 2025.',
    date: '2025-07-19',
    category: categories.RELATIONSHIPS_DATING,
    component: BlogPostRelationshipSigns,
    image: '/images/thoughtful-woman-relationship-reflection.jpg',
    readTime: '7 min read',
  },
  {
    slug: 'how-to-say-no-without-guilt',
    title: 'How to Say No Without Guilt: Real-Life Scripts for Work, Family & Friends',
    description: 'Learn how to say no without guilt. Real scripts for work, family & friends + emotional aftercare. Free 20 Script PDF.',
    date: '2025-07-18',
    category: categories.RELATIONSHIPS_DATING,
    component: BlogPostSayingNoWithoutGuilt,
    image: '/images/confident-boundary-setting-professional.png',
    readTime: '12 min read',
  },
  {
    slug: 'art-of-saying-no',
    title: 'The Art of Saying No: A Guide for People-Pleasers',
    description: 'Reclaim your time and energy by learning how to set boundaries with grace and confidence.',
    date: '2025-07-14',
    category: categories.SELF_DEVELOPMENT,
    component: BlogPostSayingNo,
    image: '/images/stressed-woman-people-pleasing-burnout.png',
    readTime: '6 min read',
  },
  {
    slug: 'prevent-professional-burnout',
    title: "How to Prevent Professional Burnout: A Woman's Essential Guide",
    description: 'Learn to identify the signs of burnout and build a sustainable, fulfilling career.',
    date: '2025-07-12',
    category: categories.CAREER_WORKPLACE,
    component: BlogPostBurnout,
    image: '/images/overwhelmed-introvert-burnout-signs.png',
    readTime: '8 min read',
  },
];

export const sortedBlogPosts = blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));