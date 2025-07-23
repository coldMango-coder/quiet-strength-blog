import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Blog from '../components/Blog';
import Themes from '../components/Themes';
import Books from '../components/Books';
import Newsletter from '../components/Newsletter';
import Testimonials from '../components/Testimonials';
import Seo from '../components/Seo';

const HomePage = () => {
  return (
    <>
      <Seo
        title="Quiet Strength – Self-Help & Productivity for Introverted Women"
        description="Actionable articles, e-books, and courses that help introverted women build confidence, prevent burnout, and thrive on their own terms."
        path="/"
      />
      <div className="space-y-24">
        <Hero />
        <About />
        <Blog />
        <Themes />
        <Books />
        <Newsletter />
        <Testimonials />
      </div>
    </>
  );
};

export default HomePage;