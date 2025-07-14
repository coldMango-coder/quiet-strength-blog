import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
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
    <section id="newsletter" className="py-20 bg-gradient-to-r from-purple-600 to-indigo-500">
      <div className="container mx-auto px-6 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Your Free Guide to Setting Boundaries</h2>
        <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
          Enter your email to receive your free copy of "The 5-Minute Guide to Setting Boundaries" and join the Quiet Strength community for weekly, introvert-friendly self-help tips.
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 rounded-full text-slate-800 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="bg-white text-purple-600 font-bold py-3 px-8 rounded-full hover:bg-indigo-100 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Send Me The Guide
            </button>
          </div>
          {message && <p className="mt-4 text-white">{message}</p>}
        </form>
      </div>
    </section>
  );
};

export default Newsletter;