const reportWebVitals = onPerfEntry => {
  // Only load web-vitals in development to reduce production bundle size
  if (process.env.NODE_ENV === 'development' && onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    }).catch(() => {
      // Silently fail if web-vitals can't be loaded
    });
  }
};

export default reportWebVitals;
