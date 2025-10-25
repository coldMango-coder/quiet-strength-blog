import React from 'react';

export default function SafeAvatar({ src, alt, size=96, containFallback=true, objectPosition='center' }){
  const style = { width: size, height: size };
  return (
    <div className="rounded-full overflow-hidden shadow-md" style={style} aria-hidden="true">
      <img
        src={src}
        alt={alt}
        className={containFallback ? 'w-full h-full object-contain bg-white' : 'w-full h-full object-cover'}
        style={{ objectPosition }}
        loading="lazy"
        width={size}
        height={size}
        decoding="async"
      />
    </div>
  );
}

