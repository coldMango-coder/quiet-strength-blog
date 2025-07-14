import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20 md:py-32">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
          Quiet Strength: Thrive as an Introverted Woman
        </h1>
        <p className="text-lg md:text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
          Your essential guide to building confidence, managing energy, finding purpose, and achieving financial freedom – on your own terms.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="#newsletter"
            className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full hover:bg-indigo-100 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
          >
            Join the Community
          </a>
          <a
            href="#blog"
            className="text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-indigo-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Read the Blog
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;