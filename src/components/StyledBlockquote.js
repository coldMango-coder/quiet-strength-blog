import React from 'react';

const StyledBlockquote = ({ children }) => {
  return (
    <blockquote className="callout">
      {children}
    </blockquote>
  );
};

export default StyledBlockquote;