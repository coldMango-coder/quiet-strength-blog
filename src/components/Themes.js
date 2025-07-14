import React from 'react';

import { categories } from '../blogData';

const themeIcons = {
  [categories.CONFIDENCE]: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  [categories.PRODUCTIVITY]: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />,
  [categories.WELLBEING]: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
  [categories.ASSERTIVENESS]: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.148-6.348a1.76 1.76 0 011.15-2.15l6.348-2.148a1.76 1.76 0 012.15 1.15z" />,
  [categories.WEALTH]: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />,
  [categories.CONNECTIONS]: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
};

const themeDescriptions = {
    [categories.CONFIDENCE]: "Discover actionable strategies to transform self-doubt into authentic self-esteem and navigate any room with quiet strength.",
    [categories.PRODUCTIVITY]: "Optimize your workflow by leveraging your natural energy cycles. Achieve more with less stress and avoid productivity-related burnout.",
    [categories.WELLBEING]: "Master the art of stress management with techniques designed for introverts, ensuring your long-term well-being and inner peace.",
    [categories.ASSERTIVENESS]: "Learn to set firm, healthy boundaries and communicate your needs effectively, all without sacrificing your calm and empathetic nature.",
    [categories.WEALTH]: "Explore financial strategies that play to your strengths in analysis and long-term thinking to build sustainable wealth and independence.",
    [categories.CONNECTIONS]: "Cultivate deep, authentic relationships that respect your need for solitude and enrich your life without draining your social energy."
}

const ThemeCard = ({ icon, title, description, onNavigate }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col text-center items-center">
    <div className="mb-4 text-indigo-500">
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">{icon}</svg>
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600 flex-grow">{description}</p>
    <button onClick={onNavigate} className="mt-4 text-indigo-600 hover:text-indigo-800 font-semibold">Explore More &rarr;</button>
  </div>
);

const Themes = ({ onNavigate }) => {
  return (
    <section id="themes" className="py-20 bg-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Our Core Self-Help Themes for Introverted Women</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.values(categories).map((category, index) => (
            <ThemeCard
              key={index}
              icon={themeIcons[category]}
              title={category}
              description={themeDescriptions[category]}
              onNavigate={() => onNavigate('blog', category)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Themes;