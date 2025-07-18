import React from 'react';

const StyledList = ({ items, ordered = false }) => {
  const ListComponent = ordered ? 'ol' : 'ul';

  return (
    <ListComponent className={`my-8 ${ordered ? 'list-decimal' : 'list-disc'} list-outside space-y-4 pl-5`}>
      {items.map((item, index) => (
        <li key={index} className="text-lg text-brand-dark">
          {item}
        </li>
      ))}
    </ListComponent>
  );
};

export default StyledList;