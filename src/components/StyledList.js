import React from 'react';

const StyledList = ({ items, ordered = false }) => {
  const ListComponent = ordered ? 'ol' : 'ul';

  return (
    <ListComponent className={`my-8 ${ordered ? 'list-decimal' : 'list-disc'} list-outside space-y-4 pl-5`}>
      {items.map((item, index) => (
        <li key={index} className="text-brand-dark" style={{ fontSize: '21px' }}>
          {item}
        </li>
      ))}
    </ListComponent>
  );
};

export default StyledList;