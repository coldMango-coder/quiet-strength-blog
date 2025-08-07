import React from 'react';
import NormalizedLink from '../../components/NormalizedLink';
import Seo from '../../components/Seo';

const QuietConfidenceBook = () => {
  return (
    <>
      <Seo
        title="Quiet Confidence: The Book"
        description="A deep dive into building authentic self-esteem for introverted women."
        type="book"
        book={{
          title: "Quiet Confidence: The Book",
          authorName: "Marica Šinko",
        }}
      />
      <div className="bg-white">
        <div className="container mx-auto px-6 py-12">
          <NormalizedLink to="/" className="text-indigo-600 hover:text-indigo-800 font-semibold mb-8">&larr; Back to Home</NormalizedLink>
          <h1 className="text-4xl font-bold text-center mb-12 text-slate-800">Quiet Confidence: The Book</h1>
          <p className="text-center text-lg text-slate-600 max-w-3xl mx-auto">
            This is the dedicated sales page for the "Quiet Confidence" book. You can add a detailed description, chapter breakdowns, testimonials, and a "Buy Now" button here.
          </p>
        </div>
      </div>
    </>
  );
};

export default QuietConfidenceBook;