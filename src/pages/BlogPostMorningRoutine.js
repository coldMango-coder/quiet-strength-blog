import React from 'react';
import NormalizedLink from '../components/NormalizedLink';
import StyledBlockquote from '../components/StyledBlockquote';
import KeyTakeawayBox from '../components/KeyTakeawayBox';
import StyledList from '../components/StyledList';
import { sortedBlogPosts } from '../blogData';
import AuthorBio from '../components/AuthorBio';

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
            <p className="text-brand-primary text-lg">By Marica Å61inko - Founder of Quiet Strength, Women's Empowerment Coach</p>
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
              <li><a href="#sample-routine" className="text-brand-emphasis hover:underline">3. Sample 45‑Minute Routine</a></li>
              <li><a href="#customize" className="text-brand-emphasis hover:underline">4. How to Customize It</a></li>
              <li><a href="#challenges" className="text-brand-emphasis hover:underline">5. Overcoming Common Challenges</a></li>
              <li><a href="#faq" className="text-brand-emphasis hover:underline">FAQ</a></li>
            </ul>
          </section>

          <section className="mb-16">
            <p>
              Most people underestimate how much the first 60 minutes shape the rest of their day. Studies show that early self‑regulation habits preserve willpower and boost afternoon performance. A morning routine for confidence and productivity creates momentum, clarity, and self‑belief.
            </p>
          </section>

          {/* Hero image (with placeholder via OptimizedImage) */}
          <div className="my-8">
            <img
              src="/images/woman-journaling-self-reflection.webp?v=b008f571"
              alt="woman-journaling-self-reflection"
              className="rounded-lg shadow-md w-full h-auto"
              loading="lazy"
              width="1200"
              height="800"
            />
            <p className="text-sm text-gray-600 mt-3 text-center italic">woman-journaling-self-reflection</p>
          </div>

          <section id="why-mornings" className="mb-16 scroll-mt-24">
            <h2>1. Why a Morning Routine Builds Confidence and Productivity</h2>
            <h3 className="mt-6">Builds Identity Through Action</h3>
            <p>Confidence grows from evidence. Completing small wins (hydration, journaling) gives daily proof: “I do what I say I’ll do.” Over weeks, identity reshapes toward capability and self‑trust.</p>
            <h3 className="mt-6">Conserves Mental Energy</h3>
            <p>Systematizing mornings reduces decision fatigue so you can save cognitive energy for deep work.</p>
            <h3 className="mt-6">Neurochemical Advantage</h3>
            <StyledList items={[
              'Serotonin rises with morning light exposure → better mood',
              'Dopamine spikes from completed tasks → motivation',
              'Endorphins from movement → stress relief and confidence'
            ]} />
            <h3 className="mt-6">Productivity Anchoring</h3>
            <p>With structure, you anchor focus to what matters instead of reacting to email and social feeds.</p>
          </section>

          <section id="five-pillars" className="mb-16 scroll-mt-24">
            <h2>2. The 5 Pillars of a Confidence‑Driven Morning</h2>
            <h3>1) Consistent Wake‑Up and Light Exposure</h3>
            <StyledList items={[
              'Wake at a fixed time (±30 minutes) to regulate circadian rhythm',
              'Get 10 minutes of sunlight or use a dawn‑simulation lamp'
            ]} />
            <h3 className="mt-6">2) Hydration and Nutrition</h3>
            <StyledList items={[
              'Drink 300–500 ml of water on waking',
              'Protein + fiber breakfast (optional) to stabilize energy'
            ]} />
            <h3 className="mt-6">3) Movement for Energy</h3>
            <p>5–10 minutes of yoga, stretching, or a brisk walk boosts circulation and focus.</p>
            <div className="my-8">
              <img
                src="/images/woman-exercising-yoga-meditation-fitness-routine-physical-transformation-wellness-journey-peaceful-natural-setting.webp?v=b008f571"
                alt="woman-exercising-yoga-meditation-fitness-routine-physical-transformation-wellness-journey-peaceful-natural-setting"
                className="rounded-lg shadow-md w-full h-auto"
                loading="lazy"
                width="1200"
                height="800"
              />
              <p className="text-sm text-gray-600 mt-3 text-center italic">woman-exercising-yoga-meditation-fitness-routine-physical-transformation-wellness-journey-peaceful-natural-setting</p>
            </div>
            <h3 className="mt-6">4) Mindset and Self‑Talk</h3>
            <StyledList items={[
              'Gratitude journaling (3 items)',
              'Affirmations: “I am focused, calm, and capable.”',
              'Cognitive reframing when negative thoughts appear'
            ]} />
            <h3 className="mt-6">5) Focus and Planning</h3>
            <StyledList items={[
              'Identify 1–3 outcomes for the day',
              'Time‑block deep work early',
              'Avoid inbox/social until the routine is complete'
            ]} />
          </section>

          <section id="sample-routine" className="mb-16 scroll-mt-24">
            <h2>3. Sample Morning Routine (45 Minutes)</h2>
            <StyledList items={[
              '6:30 – Wake + sunlight exposure',
              '6:32 – Hydrate (water with lemon)',
              '6:35 – 10 min yoga / stretching',
              '6:45 – Gratitude + affirmations (5 min)',
              '6:50 – Write top 3 priorities + visualize success',
              '7:00 – Shower / get ready',
              '7:20 – Start deep work (“eat the frog”)'
            ]} />
            <KeyTakeawayBox title="Only 10 minutes?">
              <p>Hydrate, move, and set one clear priority. Small consistent wins compound.</p>
            </KeyTakeawayBox>
            <div className="my-8">
              <img
                src="/images/social-battery-recharging-visual.webp?v=b008f571"
                alt="social-battery-recharging-visual"
                className="rounded-lg shadow-md w-full h-auto"
                loading="lazy"
                width="1200"
                height="800"
              />
              <p className="text-sm text-gray-600 mt-3 text-center italic">social-battery-recharging-visual</p>
            </div>
          </section>

          <section id="customize" className="mb-16 scroll-mt-24">
            <h2>4. How to Customize Your Routine</h2>
            <StyledList items={[
              'Night owls: shift later — consistency matters most',
              'Busy pros: “micro routine” (water + affirmation + priority in < 5 minutes)',
              'Students: add 5‑minute review before leaving',
              'Parents: anchor before kids wake; keep flexible',
              'Creatives: extend journaling or add meditation/sketching'
            ]} />
          </section>

          <section id="challenges" className="mb-16 scroll-mt-24">
            <h2>5. Overcoming Common Challenges</h2>
            <StyledList items={[
              '“I don’t have time.” → shrink the process to 3 minutes',
              '“I forget.” → habit stack with teeth brushing or coffee',
              '“I can’t stay consistent.” → use a habit tracker and reward streaks',
              '“I check my phone first.” → charge it outside the bedroom',
              '“I wake unmotivated.” → prep clothes, water, and journal the night before'
            ]} />
            <StyledBlockquote>
              “How you wake up each day and your morning routine dramatically impacts your levels of success in every area of your life.” — Hal Elrod
            </StyledBlockquote>
          </section>

          <section id="faq" className="mb-16 scroll-mt-24">
            <h2>Frequently Asked Questions</h2>
            <h3 className="mt-4">What is a morning routine for confidence and productivity?</h3>
            <p>A structured sequence of habits — hydration, movement, mindset, and planning — that primes your brain and body for confidence and focused work.</p>
            <h3 className="mt-4">How long should it last?</h3>
            <p>Anywhere from 5–60 minutes. Consistency matters more than duration.</p>
            <h3 className="mt-4">Do I need to wake up early?</h3>
            <p>No. The routine works at any time if you’re consistent.</p>
            <h3 className="mt-4">How long until I see results?</h3>
            <p>Most people notice improved focus in 1–2 weeks; confidence shifts after 3–4 weeks of steady practice.</p>
            <h3 className="mt-4">What if I miss a day?</h3>
            <p>Don’t quit. Reset the next morning. Aim for progress, not perfection.</p>
          </section>

          <section className="mb-16">
            <KeyTakeawayBox title="Final Thoughts">
              <p>
                A well‑designed morning routine is a multiplier. Start small, add one pillar this week, then layer another. Within a month, you’ll feel more productive and walk into each day with quiet confidence.
              </p>
            </KeyTakeawayBox>
          </section>

          <AuthorBio />
        </article>
      </div>
    </div>
  );
};

export default BlogPostMorningRoutine;
