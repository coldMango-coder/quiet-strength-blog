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
  // Default to plain <img loading="lazy" decoding="async"> to avoid broken variants when resized assets don't exist
  usePicture = false,
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Generate responsive srcset (return base image only when variants are not available)
  const generateResponsiveWebpSrcSet = (originalSrc) => {
    if (!originalSrc) return '';
    const [path, query] = originalSrc.split('?');
    const baseName = path.replace(/\.[^/.]+$/, '');
    const extension = '.webp';
    const suffix = query ? `?${query}` : '';
    // Return base image only to avoid 404s for non-existent variants
    return `${baseName}${extension}${suffix} 1x`;
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

      {usePicture ? (
        <picture>
          {/* Prefer AVIF/WebP when available. Using base image only in srcset to avoid 404s. */}
          <source srcSet={generateResponsiveWebpSrcSet(src).replace(/\.webp/g, '.avif')} type="image/avif" sizes={sizes} />
          <source srcSet={generateResponsiveWebpSrcSet(src)} type="image/webp" sizes={sizes} />
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : loading}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding={priority ? 'sync' : 'async'}
            sizes={sizes}
            onLoad={handleLoad}
            onError={handleError}
            className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
            {...props}
          />
        </picture>
      ) : (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
          {...props}
        />
      )}
    </div>
  );

};

export default OptimizedImage;
