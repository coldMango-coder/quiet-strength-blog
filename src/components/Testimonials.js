import React from 'react';

const testimonialsData = [
  {
    quote: "Quiet Strength completely changed how I view my introversion. I used to see it as a weakness, but now I see it as my greatest asset. The articles are so insightful and relatable.",
    author: "Jessica M.",
    title: "Software Developer"
  },
  {
    quote: "I was on the verge of burnout before I found this blog. The advice on energy management and setting boundaries has been a lifesaver. I feel more in control of my life than ever before.",
    author: "Sarah L.",
    title: "Graphic Designer"
  },
  {
    quote: "Finally, a space that understands! The content is not just empowering; it's practical. I've applied so many tips to my daily life with amazing results.",
    author: "Emily R.",
    title: "Librarian"
  }
];

const TestimonialCard = ({ quote, author, title }) => (
  <div className="bg-white p-8 rounded-lg shadow-md">
    <p className="text-slate-600 italic mb-6">"{quote}"</p>
    <div className="text-right">
      <p className="font-bold text-slate-800">{author}</p>
      <p className="text-sm text-slate-500">{title}</p>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">What Our Readers Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;