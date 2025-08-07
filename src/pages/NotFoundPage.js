import React from 'react';
import NormalizedLink from '../components/NormalizedLink';
import { Helmet } from 'react-helmet-async';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - Quiet Strength</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <p className="text-xl text-gray-600 mt-4">Page not found</p>
          <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
          <NormalizedLink 
            to="/" 
            className="mt-6 inline-block bg-brand-dark text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition duration-300"
          >
            Go back home
          </NormalizedLink>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;