import React, { useState, useEffect } from 'react';

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    const updateScrollProgress = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      
      if (scrollHeight) {
        setProgress(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
      }
    };
    
    window.addEventListener('scroll', updateScrollProgress);
    
    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full h-1 bg-brand-emphasis z-50 origin-left transition-transform duration-150 ease-out"
      style={{
        transform: `scaleX(${progress}%)`,
        transformOrigin: 'left'
      }}
      aria-hidden="true"
    />
  );
};

export default ReadingProgress;