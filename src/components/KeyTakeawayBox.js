import React from 'react';

const KeyTakeawayBox = ({ title = 'Key Takeaway', children }) => {
  return (
    <div className="bg-brand-secondary p-6 my-8 rounded-lg border border-brand-emphasis">
      <h3 className="text-xl font-bold text-brand-dark mb-4">{title}</h3>
      <div className="text-brand-dark">
        {children}
      </div>
    </div>
  );
};

export default KeyTakeawayBox;