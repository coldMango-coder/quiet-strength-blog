import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'generate_lead',
        'lead_type': 'homepage_guide'
      });
      console.log(`Email submitted: ${email}`);
      setMessage(`Thank you for subscribing!`);
      setEmail('');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Please enter a valid email address.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <section id="newsletter" className="py-32 bg-brand-dark">
      <div className="container mx-auto px-6 text-center text-white">
        <h2 className="text-5xl md:text-6xl font-bold mb-6">Get Your Free Guide to Setting Boundaries</h2>
        <p className="text-brand-secondary text-xl max-w-3xl mx-auto mb-12">
          Enter your email to receive your free copy of "The 5-Minute Guide to Setting Boundaries" and join the Quiet Strength community for weekly, introvert-friendly self-help tips.
        </p>
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-6 py-4 rounded-full text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-emphasis"
              required
            />
            <button
              type="submit"
              className="bg-brand-emphasis text-white font-bold py-4 px-10 rounded-full hover:bg-opacity-90 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Send Me The Guide
            </button>
          </div>
          {message && <p className="mt-6 text-white">{message}</p>}
        </form>
      </div>
    </section>
  );
};

export default Newsletter;