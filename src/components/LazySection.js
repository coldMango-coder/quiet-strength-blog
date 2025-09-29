import React, { useEffect, useRef, useState } from 'react';

// LazySection mounts its children only when it is near the viewport.
// Use with React.lazy components to reduce unused JS on initial load.
export default function LazySection({ children, rootMargin = '600px 0px', minHeight = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return; // Already visible
    const el = ref.current;
    if (!el) return;

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      }, { root: null, rootMargin, threshold: 0.01 });
      io.observe(el);
      return () => io.disconnect();
    } else {
      // Fallback: load immediately
      setVisible(true);
    }
  }, [visible, rootMargin]);

  return (
    <div ref={ref} style={minHeight ? { minHeight } : undefined}>
      {visible ? children : null}
    </div>
  );
}

