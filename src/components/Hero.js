import React from 'react';
import NormalizedLink from './NormalizedLink';
import LatestInsights from './LatestInsights';

const Hero = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-orange-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-[20%] -left-[10%] w-[30%] h-[30%] bg-brand-secondary/30 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="container-wide relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-orange-50 text-brand-primary text-xs md:text-sm font-bold uppercase tracking-widest mb-6">
            Quiet Strength Coaching
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-emphasis tracking-tight leading-[1.1] mb-4">
            Success Without the <span className="text-brand-primary relative inline-block">
              Burnout
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-orange-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
            Empowering introverted women to build sustainable careers and authentic confidence. Stop fighting your nature—start using it.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NormalizedLink
              to="/blog"
              className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white font-bold rounded-full shadow-lg hover:bg-brand-emphasis hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Start Reading
            </NormalizedLink>
            <a
              href="/#about"
              className="w-full sm:w-auto px-8 py-4 bg-white text-brand-emphasis font-bold rounded-full border border-gray-200 hover:border-brand-primary hover:text-brand-primary transition-all duration-300"
            >
              About Marica
            </a>
          </div>
        </div>

        {/* Latest Insights Preview */}
        <LatestInsights />
      </div>
    </section>
  );
};

export default Hero;
