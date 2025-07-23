import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories } from '../blogData';

const themeIcons = {
  [categories.INTROVERSION_PERSONALITY]: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  ),
  [categories.RELATIONSHIPS_DATING]: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  ),
  [categories.CAREER_WORKPLACE]: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  ),
  [categories.SELF_DEVELOPMENT]: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          d="M13 10V3L4 14h7v7l9-11h-7z" />
  ),
  [categories.WOMENS_WELLNESS]: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z M8 12h.01M12 12h.01M16 12h.01" />
  ),
};

const themeDescriptions = {
    [categories.INTROVERSION_PERSONALITY]: "Discover actionable strategies to transform self-doubt into authentic self-esteem and navigate any room with quiet strength as an introvert.",
    [categories.RELATIONSHIPS_DATING]: "Cultivate deep, authentic relationships that respect your need for solitude and enrich your life without draining your social energy.",
    [categories.CAREER_WORKPLACE]: "Master your professional journey with strategies designed for introverts to thrive in the workplace without burnout.",
    [categories.SELF_DEVELOPMENT]: "Unlock your full potential with personalized growth strategies that honor your introverted nature and amplify your unique strengths.",
    [categories.WOMENS_WELLNESS]: "Comprehensive wellness approaches tailored for introverted women, focusing on mental health, self-care, and maintaining energy balance."
}


const ThemeCard = ({ icon, title, description, categoryName }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ y: -5, scale: 1.05 }}
    className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col text-center items-center"
  >
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="mb-6 text-brand-emphasis bg-brand-secondary/20 p-4 rounded-full"
    >
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">{icon}</svg>
    </motion.div>
    <h3 className="text-xl font-bold text-brand-dark mb-2" aria-label={title}>{title}</h3>
    <p className="text-slate-600 flex-grow">{description}</p>
    <Link to={`/category/${encodeURIComponent(categoryName)}`} className="mt-4 text-brand-emphasis hover:underline font-semibold">Explore More &rarr;</Link>
  </motion.div>
);

const Themes = () => {
  return (
    <section id="themes" className="py-24 bg-brand-light">
      <div className="container mx-auto px-6">
        <div className="text-left mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-dark">Our Core Self-Help Themes for Introverted Women</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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