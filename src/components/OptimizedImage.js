import React, { useState, useRef, useEffect } from 'react';

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsInView(true);
      setIsLoaded(false); // Reset loaded state for immediate loading
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px 0px', // Load images 50px before they come into view
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  // Generate WebP and fallback sources
  const getOptimizedSrc = (originalSrc) => {
    if (!originalSrc) return originalSrc;
    
    // Generate WebP and AVIF sources - fallback gracefully if they don't exist
    const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const avifSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.avif');
    
    return {
      avif: avifSrc,
      webp: webpSrc,
      original: originalSrc
    };
  };

  const sources = getOptimizedSrc(src);
  
  // Generate srcset for responsive images
  const generateSrcSet = (baseSrc) => {
    if (!baseSrc) return '';
    
    // For now, just return the original image without responsive variants
    return baseSrc;
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e) => {
    // Graceful fallback from WebP/AVIF to original format
    if (e.target.src.includes('.avif') || e.target.src.includes('.webp')) {
      e.target.src = sources.original;
    } else {
      // If original also fails, show placeholder
      console.warn('Image failed to load:', e.target.src);
      setIsLoaded(true);
    }
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ 
        aspectRatio: width && height ? `${width}/${height}` : undefined,
        backgroundColor: '#f3f4f6' // placeholder background
      }}
    >
      {/* Placeholder while loading */}
      {!isLoaded && (
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
        </div>
      )}
      
      {/* Optimized picture element with multiple formats */}
      {isInView && (
        <picture>
          {/* AVIF format for maximum compression */}
          <source 
            srcSet={generateSrcSet(sources.avif)} 
            sizes={sizes}
            type="image/avif" 
          />
          
          {/* WebP format for better compression */}
          <source 
            srcSet={generateSrcSet(sources.webp)} 
            sizes={sizes}
            type="image/webp" 
          />
          
          {/* Fallback to original format */}
          <img
            src={sources.original}
            srcSet={generateSrcSet(sources.original)}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} w-full h-full object-cover`}
            {...props}
          />
        </picture>
      )}
    </div>
  );
};

export default OptimizedImage;