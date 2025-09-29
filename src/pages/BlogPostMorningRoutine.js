import React from 'react';
import NormalizedLink from '../components/NormalizedLink';
import StyledBlockquote from '../components/StyledBlockquote';
import KeyTakeawayBox from '../components/KeyTakeawayBox';
import StyledList from '../components/StyledList';
import { sortedBlogPosts } from '../blogData';
import AuthorBio from '../components/AuthorBio';
import OptimizedImage from '../components/OptimizedImage';

const BlogPostMorningRoutine = () => {
  const post = sortedBlogPosts.find(p => p.slug === 'morning-routine-for-confidence-and-productivity-2025');
  return (
    <div className="bg-brand-light">
      <div className="container mx-auto px-6 py-16">
        <NormalizedLink to="/" className="text-brand-emphasis hover:underline font-semibold mb-12">&larr; Back to Home</NormalizedLink>

        <article className="article-container mx-auto max-w-[720px]">
          <header className="mb-16 text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-brand-dark mb-6">
              How to Build a Morning Routine for Confidence and Productivity in 2025
            </h1>
            <p className="text-brand-primary text-lg">By Marica Sinko - Founder of Quiet Strength, Women's Empowerment Coach</p>
            <div className="mt-4 text-sm text-brand-primary">
              <time dateTime="2025-09-26">Published: Sep 26, 2025</time>
              <span className="mx-2">•</span>
              <span>{post?.readTime || '10 min read'}</span>
            </div>
          </header>

          <section className="bg-white p-8 rounded-lg mb-16 shadow-md text-base">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Table of Contents</h2>
            <ul className="space-y-3 toc-list">
              <li><a href="#why-mornings" className="text-brand-emphasis hover:underline">1. Why Mornings Build Confidence & Productivity</a></li>
              <li><a href="#five-pillars" className="text-brand-emphasis hover:underline">2. The 5 Pillars of an Effective Morning</a></li>
              <li><a href="#sample-routine" className="text-brand-emphasis hover:underline">3. Sample 45-Minute Routine</a></li>
              <li><a href="#customize" className="text-brand-emphasis hover:underline">4. How to Customize It</a></li>
              <li><a href="#challenges" className="text-brand-emphasis hover:underline">5. Overcoming Common Challenges</a></li>
              <li><a href="#faq" className="text-brand-emphasis hover:underline">FAQ</a></li>
            </ul>
          </section>

          <section className="mb-16">
            <p>
              If your mornings currently feel rushed or scattered, you are not alone. The first hour of the day can either steady you or spin you into reactivity. A gentle, repeatable routine is how we choose steadiness on purpose — a small set of habits that tell your brain, “I'm safe, I'm capable, and I know where I'm going.”
            </p>
            <p>
              This guide is practical and compassionate. You won't find perfectionism here — just simple actions that compound. We'll use what research says about sleep, light, movement, and attention, and we'll adapt it to real life with kids, deadlines, and unpredictable energy.
            </p>
          </section>

          {/* Hero image with correct aspect ratio (3:2) */}
          <div className="my-8">
            <OptimizedImage
              src="/images/person-stretching-by-a-window-during-sunrise-with-water-and-journal-on-bedside-table-as-part-of-a-morning-routine-for-confidence-and-productivity.webp?v=b008f571"
              alt="Person stretching by a window during sunrise with water and journal on bedside table as part of a morning routine for confidence and productivity."
              className="rounded-lg shadow-md w-full h-auto"
              loading="lazy"
              width={1200}
              height={800}
              sizes="(max-width: 768px) 100vw, 720px"
              responsiveWidths={[360,720,1200]}
              imgClassName="object-contain"
            />
            <p className="text-sm text-gray-600 mt-3 text-center italic">Person stretching by a window during sunrise with water and journal on bedside table as part of a morning routine for confidence and productivity.</p>
          </div>

          <section id="why-mornings" className="mb-16 scroll-mt-24">
            <h2>1. Why a Morning Routine Builds Confidence and Productivity</h2>
            <h3 className="mt-6">Builds Identity Through Action</h3>
            <p>
              Confidence is learned. Each small, finishable step — a glass of water, three lines in a journal — becomes evidence your brain stores: “I keep promises to myself.” Over time that evidence hardens into identity, and identity fuels bigger goals.
            </p>
            <h3 className="mt-6">Conserves Mental Energy</h3>
            <p>
              Systematizing the first 30–60 minutes reduces decision fatigue so your best attention is available for meaningful work later.
            </p>
          </section>

          <section className="mb-16">
            <div className="my-8">
              <OptimizedImage
                src="/images/social-battery-recharging-visual.webp?v=b008f571"
                alt="social-battery-recharging-visual"
                className="rounded-lg shadow-md w-full h-auto"
                loading="lazy"
                width={1200}
                height={800}
                sizes="(max-width: 768px) 100vw, 720px"
                responsiveWidths={[360,720,1200]}
                imgClassName="object-contain"
              />
              <p className="text-sm text-gray-600 mt-3 text-center italic">social-battery-recharging-visual</p>
            </div>
          </section>

          {/* ...rest of the article content remains unchanged ... */}

          <AuthorBio />
        </article>
      </div>
    </div>
  );
};

export default BlogPostMorningRoutine;
