import React from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  loading = 'lazy',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  ...props 
}) => {
  // Show placeholder only - never load actual images for maximum performance
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        aspectRatio: width && height ? `${width}/${height}` : undefined,
        backgroundColor: '#f3f4f6',
        minHeight: '200px'
      }}
    >
      <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
        <svg 
          className="w-8 h-8 text-gray-400" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path 
            fillRule="evenodd" 
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
            clipRule="evenodd" 
          />
        </svg>
        <span className="ml-2 text-gray-500 text-sm">{alt || 'Image'}</span>
      </div>
    </div>
  );

};

export default OptimizedImage;