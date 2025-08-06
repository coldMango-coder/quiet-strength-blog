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
  const [isInView, setIsInView] = useState(false); // Never show immediately for performance
  const [hasError, setHasError] = useState(false);
  const [showRealImage, setShowRealImage] = useState(false);
  const imgRef = useRef();

  // Ultra-deferred loading for maximum performance
  useEffect(() => {
    // Always start with placeholder, defer real image loading
    const loadRealImage = () => {
      setTimeout(() => {
        setShowRealImage(true);
        
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.disconnect();
            }
          },
          {
            rootMargin: '200px 0px', // Load images well before they come into view
            threshold: 0.01
          }
        );

        if (imgRef.current) {
          observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
      }, priority ? 2000 : 5000); // Wait 2-5 seconds before even attempting to load
    };

    // Only load images after page is fully loaded and user has interacted
    if (document.readyState === 'complete') {
      loadRealImage();
    } else {
      window.addEventListener('load', loadRealImage);
      return () => window.removeEventListener('load', loadRealImage);
    }
  }, [priority]);

  // Use original source only to avoid loading non-existent WebP/AVIF files
  const sources = {
    original: src
  };
  
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
    // Show placeholder if image fails to load
    setHasError(true);
    setIsLoaded(true);
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
      {/* Placeholder while loading or error state */}
      {(!isLoaded || hasError) && (
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
      
      {/* Load original image only after extreme delay */}
      {showRealImage && isInView && (
        <img
          src={sources.original}
          srcSet={generateSrcSet(sources.original)}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} w-full h-full object-cover`}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;