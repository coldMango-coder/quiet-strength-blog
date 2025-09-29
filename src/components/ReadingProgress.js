import React, { useState, useEffect, useRef } from 'react';

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const totalHeightRef = { current: 1 };
    const measureTotal = () => {
      totalHeightRef.current = Math.max(1, document.documentElement.scrollHeight - document.documentElement.clientHeight);
    };

    // Initial measure after paint
    requestAnimationFrame(measureTotal);

    let resizeTick = false;
    const onResize = () => {
      if (resizeTick) return;
      resizeTick = true;
      requestAnimationFrame(() => {
        measureTotal();
        resizeTick = false;
      });
    };
    window.addEventListener('resize', onResize, { passive: true });

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setProgress(Number(((y / totalHeightRef.current) * 100).toFixed(2)));
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
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
