import React from 'react';
import avatar from '../assets/marica-sinko-author-photo.jpg';
import OptimizedImage from './OptimizedImage';

export default function AuthorBio() {
  return (
    <section className="mt-16 border-t pt-12 flex flex-col md:flex-row items-start gap-8">
      {/* fixed-size portrait box */}
      <div className="modern-logo w-[209px] h-[294px] lg:w-[260px] lg:h-[366px] overflow-hidden shrink-0 rounded-lg">
        <OptimizedImage
          src={avatar}
          alt="Marica Šinko — Author"
          width={260}
          height={366}
          loading="lazy"
          sizes="(max-width: 1024px) 209px, 260px"
          className="w-full h-full object-cover"
          formats={[]}
        />
      </div>

      {/* text */}
      <div className="flex-1">
        <h4 className="text-xl font-bold text-brand-dark mb-2">About Marica Šinko</h4>
        <p className="text-brand-primary">
          Marica Šinko is a certified coach specializing in sustainable professional
          growth for introverted women and the founder of Quiet Strength. Having
          personally overcome career burnout and people-pleasing patterns, she is
          dedicated to empowering women with the tools to build fulfilling,
          resilient careers without sacrificing their well-being.
        </p>
      </div>
    </section>
  );
}

