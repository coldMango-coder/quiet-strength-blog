import React, { lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import LazySection from '../components/LazySection';
import Seo from '../components/Seo';

// Defer below-the-fold sections to cut initial JS and DOM
const About = lazy(() => import('../components/About'));
const Blog = lazy(() => import('../components/Blog'));
const Themes = lazy(() => import('../components/Themes'));
const Books = lazy(() => import('../components/Books'));
const Newsletter = lazy(() => import('../components/Newsletter'));
const Testimonials = lazy(() => import('../components/Testimonials'));

const HomePage = () => {
  const location = useLocation();
  const eagerNewsletter = location.hash === '#newsletter';
  return (
    <>
      <Seo
        title="Quiet Strength - Self-Help & Productivity for Introverted Women"
        description="Actionable articles, e-books, and courses that help introverted women build confidence, prevent burnout, and thrive on their own terms."
      />
      <div className="space-y-24">
        <Hero />
        <Suspense fallback={null}>
          <LazySection rootMargin="800px 0px" minHeight={0}>
            <About />
          </LazySection>
          <LazySection rootMargin="800px 0px">
            <Blog />
          </LazySection>
          <LazySection rootMargin="800px 0px">
            <Themes />
          </LazySection>
          <LazySection rootMargin="800px 0px">
            <Books />
          </LazySection>
          {eagerNewsletter ? (
            <Newsletter />
          ) : (
            <LazySection rootMargin="1400px 0px">
              <Newsletter />
            </LazySection>
          )}
          <LazySection rootMargin="800px 0px">
            <Testimonials />
          </LazySection>
        </Suspense>
      </div>
    </>
  );
};

export default HomePage;
