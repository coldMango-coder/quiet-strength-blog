import React from 'react';
import Seo from './Seo';
import OptimizedImage from './OptimizedImage';

const About = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-white overflow-hidden scroll-mt-24">
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
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

      {/* Decorative background elements */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

      <div className="container-wide">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/3 text-center">
            {/* Modernized Avatar Container with Glassmorphism effect */}
            <div className="relative mx-auto w-48 h-48 md:w-64 md:h-64">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-100 to-white blur-lg opacity-50 animate-pulse"></div>
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl ring-1 ring-gray-100">
                <OptimizedImage
                  src="/images/marica-sinko-author-photo.avif"
                  alt="Marica Šinko — Author portrait"
                  width={256}
                  height={256}
                  className="w-full h-full"
                  style={{ objectFit: 'cover', objectPosition: 'top' }}
                  priority={false}
                />
              </div>
            </div>
          </div>
          <div className="md:w-2/3 text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-emphasis mb-6 tracking-tight">
              My Story: <span className="text-brand-primary">From Burnout to Quiet Strength</span>
            </h2>
            <div className="prose prose-lg text-gray-600 leading-relaxed">
              <p className="mb-4">
                I’m an <strong>introvert-women burnout coach</strong> who helps high-achieving introverts rebuild confidence. For years, I tried to be someone I wasn't. I chased the extroverted ideal of success, believing that to be seen, I had to be loud. The result? I was left feeling drained, inauthentic, and completely burnt out.
              </p>
              <p className="mb-4">
                It was in hitting that wall that I discovered my true strength wasn't in changing who I am, but in embracing my introversion. I created Quiet Strength to be the resource I wish I'd had—a place that honors our need for depth, reflection, and a calmer path to success.
              </p>
              <p className="mb-8">
                My mission is to give you the tools to stop fighting your nature and start using it as your greatest asset. I'm a Certified Mental Wellness Coach (ICF) dedicated to helping introverted women build sustainable success.
              </p>

              <div className="bg-brand-secondary/30 rounded-2xl p-6 md:p-8 border border-orange-100">
                <h3 className="text-xl font-bold text-brand-emphasis mb-4">The 3 breakthroughs I deliver:</h3>
                <ol className="list-decimal list-inside space-y-3 marker:font-bold marker:text-brand-primary">
                  <li className="pl-2"><span className="font-medium text-brand-dark">Root Cause Resolution:</span> We find the source of your burnout and create a personalized recovery plan.</li>
                  <li className="pl-2"><span className="font-medium text-brand-dark">Authentic Confidence:</span> Build unshakeable self-belief that honors your introverted nature.</li>
                  <li className="pl-2"><span className="font-medium text-brand-dark">Sustainable Success:</span> Learn to manage energy and set boundaries for a fulfilling life.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
