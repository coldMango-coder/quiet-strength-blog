import React from 'react';

// Circular avatar with upward bias crop and intrinsic sizing
export default function Avatar({ src, alt = 'Author photo', size = 96 }) {
  const s = typeof size === 'number' ? `${size}px` : size;
  return (
    <div className="rounded-full overflow-hidden shadow-md" style={{ width: s, height: s }}>
      <img
        src={src}
        alt={alt}
        width={parseInt(size, 10) || 96}
        height={parseInt(size, 10) || 96}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
        style={{ objectPosition: '50% 35%' }}
      />
    </div>
  );
}

