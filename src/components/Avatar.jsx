import React from 'react';

// Circular avatar with upward bias crop and intrinsic sizing (zero CLS)
export default function Avatar({ src, alt = 'Author photo', size = 96 }) {
  const px = typeof size === 'number' ? size : parseInt(size, 10) || 96;
  const s = `${px}px`;
  return (
    <div
      className="avatar--contain aspect-square rounded-full overflow-hidden border-4 border-white shadow"
      style={{ width: s, height: s }}
    >
      <img
        src={src}
        alt={alt}
        width={px}
        height={px}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
        style={{ objectPosition: '50% 30%' }}
      />
    </div>
  );
}
