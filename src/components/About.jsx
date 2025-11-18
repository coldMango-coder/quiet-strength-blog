import React from 'react';
import Seo from './Seo';
import Avatar from './Avatar';

// Fix: About page uses correct diacritic in title and person name; About photo centers face with zero CLS
const About = () => {
  const authorImageSrc = '/images/marica-sinko-author-photo.webp?v=1762037948136';
  return (
    <section id="about" className="qs-about py-32 bg-white">
      <Seo
        type="person"
        title="About Marica Šinko"
        description="Marica Šinko is an introvert-women burnout coach who helps high-achieving introverts rebuild confidence."
        path="/about"
        person={{
          name: 'Marica Šinko',
          alternateName: 'Quiet Strength Coach',
          jobTitle: 'Mental Wellness Coach',
          knowsAbout: ['burnout recovery', 'introvert confidence'],
          url: 'https://quietstrength.com/about',
          image: '/images/logo.webp?v=b008f571',
        }}
      />
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/3 text-center">
            <div className="mx-auto hero-about-card author-photo">
              <img
                className="author-avatar"
                src={authorImageSrc}
                alt={"Marica \u0160inko"}
                width="144"
                height="144"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <div className="md:w-2/3 text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">My Story: From Burnout to Quiet Strength</h2>
            <div className="prose prose-xl max-w-none text-brand-primary">
              <p className="mb-6">
                I am an <strong>introvert-women burnout coach</strong> who helps high-achieving introverts rebuild confidence. For years, I tried to be someone I wasn't. I chased the extroverted ideal of success, believing that to be seen, I had to be loud. The result? I was left feeling drained, inauthentic, and completely burnt out.
              </p>
              <p className="mb-6">
                It was in hitting that wall that I discovered my true strength wasn't in changing who I am, but in embracing my introversion. I created Quiet Strength to be the resource I wish I'd hadâ€”a place that honors our need for depth, reflection, and a calmer path to success.
              </p>
              <p className="mb-6">
                My mission is to give you the tools to stop fighting your nature and start using it as your greatest asset. I'm a Certified Mental Wellness Coach (ICF) dedicated to helping introverted women build sustainable success.
              </p>
              {/* removed per spec: 3 breakthroughs block */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
















