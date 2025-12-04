import React from 'react';
import NormalizedLink from './NormalizedLink';
import { categories, categorySlugMap } from '../blogData';

const themeIcons = {
  [categories.INTROVERSION_PERSONALITY]: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  ),
  [categories.RELATIONSHIPS_DATING]: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  ),
  [categories.CAREER_WORKPLACE]: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  ),
  [categories.SELF_DEVELOPMENT]: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
      d="M13 10V3L4 14h7v7l9-11h-7z" />
  ),
  [categories.WOMENS_WELLNESS]: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z M8 12h.01M12 12h.01M16 12h.01" />
  ),
};

const themeDescriptions = {
  [categories.INTROVERSION_PERSONALITY]: "Discover actionable strategies to transform self-doubt into authentic self-esteem and navigate any room with quiet strength.",
  [categories.RELATIONSHIPS_DATING]: "Cultivate deep, authentic relationships that respect your need for solitude and enrich your life without draining your energy.",
  [categories.CAREER_WORKPLACE]: "Master your professional journey with strategies designed for introverts to thrive in the workplace without burnout.",
  [categories.SELF_DEVELOPMENT]: "Unlock your full potential with personalized growth strategies that honor your introverted nature and amplify your strengths.",
  [categories.WOMENS_WELLNESS]: "Comprehensive wellness approaches tailored for introverted women, focusing on mental health, self-care, and energy balance."
}


const ThemeCard = ({ icon, title, description, categoryName }) => (
  <article
    className="group relative flex flex-col h-full bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1"
  >
    <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-orange-50 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">{icon}</svg>
    </div>

    <h3 className="text-xl font-bold text-brand-emphasis mb-3 tracking-tight group-hover:text-brand-primary transition-colors">
      {title}
    </h3>

    <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
      {description}
    </p>

    <div className="mt-auto pt-4 border-t border-gray-50">
      <NormalizedLink
        to={`/category/${categorySlugMap[categoryName]}`}
        className="inline-flex items-center text-sm font-semibold text-brand-primary hover:text-brand-emphasis transition-colors group/link"
      >
        Explore Articles
        <svg className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </NormalizedLink>
    </div>
  </article>
);

const Themes = () => {
  return (
    <section id="themes" className="py-16 bg-brand-secondary/30">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-emphasis mb-4 tracking-tight">
            Our Core Self-Help Themes
          </h2>
          <p className="text-lg text-gray-600">
            Curated resources designed specifically for the unique strengths and challenges of introverted women.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.values(categories).map((category, index) => (
            <ThemeCard
              key={index}
              icon={themeIcons[category]}
              title={category}
              description={themeDescriptions[category]}
              categoryName={category}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Themes;
