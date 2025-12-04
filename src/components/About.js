import React from 'react';
import Seo from './Seo';
import OptimizedImage from './OptimizedImage';

const About = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-white">
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
      <div className="container-wide">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/3 text-center">
            <div className="modern-logo w-48 h-48 md:w-56 md:h-56 mx-auto shadow-xl border-4 border-white rounded-full overflow-hidden ring-1 ring-gray-100">
              <OptimizedImage
                src="/images/marica-sinko-author-photo.avif"
                alt="Marica Šinko — Author portrait"
                width={224}
                height={224}
                className="w-full h-full object-cover object-top"
                priority={false}
              />
            </div>
          </div>
          <div className="md:w-2/3 text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-emphasis mb-6">My Story: From Burnout to Quiet Strength</h2>
            <div className="prose prose-lg text-gray-600">
              <p className="mb-4">
                I’m an <strong>introvert-women burnout coach</strong> who helps high-achieving introverts rebuild confidence. For years, I tried to be someone I wasn't. I chased the extroverted ideal of success, believing that to be seen, I had to be loud. The result? I was left feeling drained, inauthentic, and completely burnt out.
              </p>
              <p className="mb-4">
                It was in hitting that wall that I discovered my true strength wasn't in changing who I am, but in embracing my introversion. I created Quiet Strength to be the resource I wish I'd had—a place that honors our need for depth, reflection, and a calmer path to success.
              </p>
              <p className="mb-6">
                My mission is to give you the tools to stop fighting your nature and start using it as your greatest asset. I'm a Certified Mental Wellness Coach (ICF) dedicated to helping introverted women build sustainable success.
              </p>
              <h3 className="text-xl font-bold text-brand-emphasis mt-6 mb-3">The 3 breakthroughs I deliver:</h3>
              <ol className="list-decimal list-inside space-y-2 mb-6 marker:font-bold marker:text-brand-primary">
                <li>We will find the root cause of your burnout and create a personalized plan for burnout recovery for introverted women.</li>
                <li>We will work together to build unshakeable confidence that feels authentic to you.</li>
                <li>You will learn to manage your energy, set boundaries, and create a life that is not just successful, but sustainable and deeply fulfilling.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
