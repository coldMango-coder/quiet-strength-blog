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
  usePicture = true,
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Generate responsive srcset (webp only to avoid avif 404s when variant doesn't exist)
  const generateResponsiveWebpSrcSet = (originalSrc) => {
    if (!originalSrc) return '';
    const [path, query] = originalSrc.split('?');
    const baseName = path.replace(/\.[^/.]+$/, '');
    const extension = '.webp';
    const suffix = query ? `?${query}` : '';
    if (width && height) {
      // Create width-based variants: w, 1.5w, 2w
      const w1 = Math.max(120, Math.round(width));
      const w15 = Math.round(w1 * 1.5);
      const w2 = Math.round(w1 * 2);
      const entries = [w1, w15, w2]
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .map((w) => `${baseName}-${w}w${extension}${suffix} ${w}w`);
      return entries.join(', ');
    }
    // Fallback to base URL
    return `${baseName}${extension}${suffix}`;
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
          {/* Prefer AVIF when available (same basename) */}
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
