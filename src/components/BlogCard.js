import React from 'react';

const BlogCard = ({ post, onReadMore }) => {
  const { title, description, category, image } = post;

  return (
    <div className="w-full max-w-sm rounded-lg border border-gray-200 shadow-md bg-white flex flex-col overflow-hidden">
      <img className="w-full h-48 object-cover" src={image} alt={title} />
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-sm font-semibold text-indigo-600 mb-2">{category}</p>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-base mb-4 flex-grow">
          {description}
        </p>
        <button
          onClick={onReadMore}
          className="font-semibold text-indigo-600 hover:text-indigo-800 text-left self-start mt-auto"
        >
          Read More &rarr;
        </button>
      </div>
    </div>
  );
};

export default BlogCard;