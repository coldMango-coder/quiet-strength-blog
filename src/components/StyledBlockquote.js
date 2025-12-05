import React from 'react';

const StyledBlockquote = ({ children }) => {
  return (
    <aside className="not-prose my-6 rounded-xl border border-neutral-200/70 bg-neutral-50 p-4 md:p-5">
      {children}
    </aside>
  );
};

export default StyledBlockquote;
