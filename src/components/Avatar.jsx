import React from 'react';

// Minimal, CLS-safe avatar img with circular crop and object-cover
export default function Avatar({ src, alt = '', size = 96, className = '', ...rest }) {
  const px = Number(size) || 96;
  const dims = { width: px, height: px };
  const classes = [
    'qs-avatar',
    'rounded-full',
    'overflow-hidden',
    'object-cover',
    'block',
    'select-none',
    className,
  ].filter(Boolean).join(' ');
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      {...dims}
      className={classes}
      style={{ ...(rest?.style || {}), aspectRatio: '1 / 1' }}
      {...rest}
    />
  );
}
