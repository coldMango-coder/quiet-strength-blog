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
  formats = ['avif', 'webp'],
  responsiveWidths = null,
  imgClassName = 'object-cover',
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Generate responsive srcset helpers (attempt AVIF first, then WebP)
  const generateResponsiveSrcSet = (originalSrc, ext) => {
    if (!originalSrc) return '';
    const [path, query] = originalSrc.split('?');
    const baseName = path.replace(/\.[^/.]+$/, '');
    const suffix = query ? `?${query}` : '';
    // If explicit responsive widths provided, build a width-based srcset using -{w}w naming
    if (Array.isArray(responsiveWidths) && responsiveWidths.length > 0) {
      const entries = responsiveWidths.map((w) => `${baseName}-${w}w.${ext}${suffix} ${w}w`);
      return entries.join(', ');
    }
    // Default: provide a simple 1x/2x width-based set if width given
    const url = `${baseName}.${ext}${suffix}`;
    if (width && height) {
      const w1x = Math.round(width);
      const w2x = Math.round(width * 2);
      return `${url} ${w1x}w, ${url} ${w2x}w`;
    }
    return url;
  };
  const generateResponsiveWebpSrcSet = (originalSrc) => {
    if (!originalSrc) return '';
    const [path, query] = originalSrc.split('?');
    const baseName = path.replace(/\.[^/.]+$/, '');
    const extension = '.webp';
    const suffix = query ? `?${query}` : '';
    const url = `${baseName}${extension}${suffix}`;
    if (width && height) {
      const w1x = Math.round(width);
      const w2x = Math.round(width * 2);
      return `${url} ${w1x}w, ${url} ${w2x}w`;
    }
    return url;
  };

  const handleLoad = () => setLoaded(true);
  const handleError = () => setError(true);

  if (error || !src) {
    return (
      <div 
        className={`relative overflow-hidden bg-gray-200 ${className}`}
        style={{ 
          aspectRatio: width && height ? `${width}/${height}` : '16 / 9'
        }}
        aria-hidden="true"
      />
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
          className="absolute inset-0 bg-gray-200 animate-pulse"
          aria-hidden="true"
        />
      )}
      
      <picture>
        {/* Prefer AVIF/WebP when available; can be disabled via formats=[] */}
        {formats.includes('avif') && (
          <source
            srcSet={generateResponsiveSrcSet(src, 'avif')}
            type="image/avif"
            sizes={sizes}
          />
        )}
        {formats.includes('webp') && (
          <source
            srcSet={generateResponsiveSrcSet(src, 'webp')}
            type="image/webp"
            sizes={sizes}
          />
        )}
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
          className={`w-full h-full ${imgClassName} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
          {...props}
        />
      </picture>
    </div>
  );

};

export default OptimizedImage;
