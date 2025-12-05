import React from 'react';

const BookCard = ({ imgSrc, title, description, price, ctaText, slug, isExternal, externalLink }) => (
  <div className="bg-white rounded-lg shadow-md flex flex-col hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 w-full max-w-md mx-auto">
    <div>
      <img
        src={imgSrc}
        alt={`Book cover for ${title}`}
        className="w-full h-[500px] object-contain"
        loading="lazy"
        decoding="async"
        width="800"
        height="1200"
      />
      <p className="text-sm text-gray-600 mt-3 text-center italic px-4">Book cover for {title}</p>
    </div>
    <div className="flex flex-col flex-grow p-8">
      <h3 className="text-xl md:text-2xl font-bold text-brand-dark mb-2">{title}</h3>
      <p className="text-brand-primary mb-4 flex-grow leading-relaxed">{description}</p>

      {/* Footer sticks to bottom */}
      <div className="flex items-center justify-between gap-4 mt-auto flex-wrap">
        <span className="text-2xl md:text-3xl font-bold text-brand-dark">{price}</span>
        {isExternal ? (
          <a
            href={externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-emphasis text-white font-semibold w-full sm:w-auto max-w-full py-2 px-4 md:px-6 rounded-full hover:bg-opacity-90 transition duration-300 text-center"
          >
            {ctaText}
          </a>
        ) : (
          <a
            href={`/book-${slug}`}
            className="bg-brand-emphasis text-white font-semibold w-full sm:w-auto max-w-full py-2 px-4 md:px-6 rounded-full hover:bg-opacity-90 transition duration-300 text-center"
          >
            {ctaText}
          </a>
        )}
      </div>
    </div>
  </div>
);

const Books = () => {
  const booksData = [
    {
      imgSrc: "/images/art-of-saying-no-book-cover.webp?v=b008f571",
      title: "The Art of Saying No: A Guide for People-Pleasers on the Brink of Burnout",
      description: "\"The Art of Saying No\" is more than just a guideâ€”it's a compassionate and practical roadmap to reclaiming your life. For too long, the compulsive need for approval has dictated your decisions, drained your energy, and left you feeling resentful and depleted. This book provides the tools to break free from the \"disease to please\" and build a life based on your own terms.",
      price: "$7",
      slug: "art-of-saying-no",
      externalLink: "https://www.amazon.com/dp/B0FHZL4Q5G",
      ctaText: "Buy Now",
      isExternal: true
    },
    {
      imgSrc: "/images/quiet-confidence-blueprint-book-cover.webp?v=b008f571",
      title: "The Quiet Confidence Blueprint: An Introverted Woman's Uncensored Guide to Owning Her Power",
      description: "Are you an introverted woman tired of feeling overlooked, drained by social demands, or battling imposter syndrome? This raw, actionable guide reveals how to transform your quiet nature into an unshakeable source of confidence, set powerful boundaries, and claim your authentic strength without becoming someone you're not. Discover self-esteem for introverts, energy mastery, and thriving as a quiet leader in an extroverted world.",
      price: "$5",
      slug: "quiet-confidence-blueprint",
      externalLink: "https://www.amazon.com/dp/B0FHX2YTVX",
      ctaText: "Buy Now",
      isExternal: true
    },
  ];

  return (
    <section id="books" className="py-24 bg-brand-light">
      <div className="container mx-auto px-6">
        <div className="text-left mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-dark">My Books & Exclusive Resources</h2>
          <p className="text-brand-primary text-lg mt-4 max-w-2xl">
            Dive deeper with these comprehensive e-books, designed to give you the tools and confidence to thrive.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {booksData.map((book, index) => (
            <BookCard key={index} {...book} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Books;
