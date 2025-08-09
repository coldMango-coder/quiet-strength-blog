import React, { useState } from 'react';

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
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Generate responsive srcset for different formats
  const generateResponsiveSrcSet = (originalSrc, format) => {
    if (!originalSrc) return '';
    const baseName = originalSrc.replace(/\.[^/.]+$/, '');
    const extension = format === 'avif' ? '.avif' : format === 'webp' ? '.webp' : originalSrc.match(/\.[^/.]+$/)?.[0] || '.jpg';
    
    // Generate multiple sizes for responsive images
    if (width && height) {
      const w1x = Math.round(width);
      const w2x = Math.round(width * 2);
      return `${baseName}${extension} ${w1x}w, ${baseName}${extension} ${w2x}w`;
    }
    return `${baseName}${extension}`;
  };

  const handleLoad = () => setLoaded(true);
  const handleError = () => setError(true);

  if (error || !src) {
    return (
      <div 
        className={`relative overflow-hidden bg-gray-200 ${className}`}
        style={{ 
          aspectRatio: width && height ? `${width}/${height}` : '16/9',
          minHeight: '200px'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        aspectRatio: width && height ? `${width}/${height}` : undefined,
      }}
    >
      {!loaded && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ minHeight: '200px' }}
        >
          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      
      <picture>
        <source 
          srcSet={generateResponsiveSrcSet(src, 'avif')} 
          type="image/avif" 
          sizes={sizes}
        />
        <source 
          srcSet={generateResponsiveSrcSet(src, 'webp')} 
          type="image/webp" 
          sizes={sizes}
        />
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          fetchPriority={priority ? 'high' : 'auto'}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
          {...props}
        />
      </picture>
    </div>
  );

};

export default OptimizedImage;