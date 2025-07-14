import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <img
              src="/images/logo.png"
              alt="Marica Šinko, founder of Quiet Strength"
              className="w-40 h-40 rounded-full mx-auto shadow-lg"
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">My Story: From Burnout to Quiet Strength</h2>
          <p className="text-slate-600 text-lg mb-4">
            For years, I tried to be someone I wasn't. I chased the extroverted ideal of success, believing that to be seen, I had to be loud. The result? I was left feeling drained, inauthentic, and completely burnt out. It was in hitting that wall that I discovered my true strength wasn't in changing who I am, but in embracing my introversion.
          </p>
          <p className="text-slate-600 text-lg">
            I created Quiet Strength to be the resource I wish I'd had—a place that honors our need for depth, reflection, and a calmer path to success. My mission is to give you the tools to stop fighting your nature and start using it as your greatest asset. Together, we'll build unshakeable confidence, master our energy, and create lives that are not just successful, but sustainable and deeply fulfilling.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;