﻿import React from 'react';
// avatar import removed (using optimized public/images variants)

export default function AuthorBio() {
  return (
    <section className="mt-16 border-t pt-12 flex flex-col md:flex-row items-start gap-8">
      {/* fixedâ€‘size portrait box */}
      <div className="modern-logo w-[209px] h-[294px] lg:w-[260px] lg:h-[366px] overflow-hidden shrink-0 rounded-lg">
        <img
          loading="lazy"
          decoding="async"
          src="/images/marica-sinko-author-photo.avif"
          alt="Marica Šinko — Author portrait"
          width="260"
          height="366"\n          sizes="260px"
          className="w-full h-full object-cover"
        />
      </div>

      {/* text */}
      <div className="flex-1">
        <h4 className="text-xl font-bold text-brand-dark mb-2">About Maricaâ€¯Å inko</h4>
        <p className="text-brand-primary">
          Maricaâ€¯Å inko is a certified coach specializing in sustainable professional
          growth for introverted women and the founder of Quiet Strength. Having
          personally overcome career burnout and peopleâ€‘pleasing patterns, she is
          dedicated to empowering women with the tools to build fulfilling,
          resilient careers without sacrificing their wellâ€‘being.
        </p>
      </div>
    </section>
  );
}

