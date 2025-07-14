import React from 'react';

const booksData = [
  {
    imgSrc: "https://placehold.co/300x450/a78bfa/ffffff?text=Quiet+Confidence",
    title: "Quiet Confidence: Navigating an Extroverted World",
    description: "A step-by-step guide to building authentic self-esteem and thriving in any social or professional setting.",
    price: "$9.99",
    link: "#"
  },
  {
    imgSrc: "https://placehold.co/300x450/818cf8/ffffff?text=Financial+Freedom",
    title: "Financial Freedom for the Introverted Woman",
    description: "Learn to manage, invest, and grow your wealth in a way that aligns with your personality and values.",
    price: "$12.99",
    link: "#"
  },
  {
    imgSrc: "https://placehold.co/300x450/c084fc/ffffff?text=Recharge+Playbook",
    title: "The Introvert's Recharge Playbook",
    description: "Discover personalized strategies to manage your energy, prevent burnout, and create a balanced life.",
    price: "$7.99",
    link: "#"
  }
];

const BookCard = ({ imgSrc, title, description, price, onNavigate, ctaText }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
    <img src={imgSrc} alt={`Book cover for ${title}`} className="w-full h-64 object-cover" />
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 mb-4 flex-grow">{description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-2xl font-bold text-indigo-600">{price}</span>
        <button onClick={onNavigate} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-full hover:bg-indigo-700 transition duration-300">
          {ctaText}
        </button>
      </div>
    </div>
  </div>
);

const Books = ({ onNavigate }) => {
  const booksData = [
    {
      imgSrc: "https://placehold.co/300x450/a78bfa/ffffff?text=Quiet+Confidence",
      title: "Quiet Confidence: Navigating an Extroverted World",
      description: "A step-by-step guide to building authentic self-esteem and thriving in any social or professional setting.",
      price: "$9.99",
      onNavigate: () => onNavigate('book-quiet-confidence'),
      ctaText: "Find My Strength"
    },
    {
      imgSrc: "https://placehold.co/300x450/818cf8/ffffff?text=Financial+Freedom",
      title: "Financial Freedom for the Introverted Woman",
      description: "Learn to manage, invest, and grow your wealth in a way that aligns with your personality and values.",
      price: "$12.99",
      onNavigate: () => {}, // Placeholder for future book page
      ctaText: "Take Control"
    },
    {
      imgSrc: "https://placehold.co/300x450/c084fc/ffffff?text=Recharge+Playbook",
      title: "The Introvert's Recharge Playbook",
      description: "Discover personalized strategies to manage your energy, prevent burnout, and create a balanced life.",
      price: "$7.99",
      onNavigate: () => {}, // Placeholder for future book page
      ctaText: "Reclaim My Energy"
    }
  ];

  return (
    <section id="books" className="py-20 bg-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">My Books & Exclusive Resources</h2>
          <p className="text-slate-600 text-lg mt-4 max-w-2xl mx-auto">
            Dive deeper with these comprehensive e-books, designed to give you the tools and confidence to thrive.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {booksData.map((book, index) => (
            <BookCard key={index} {...book} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Books;