import React from 'react';
import Avatar from './Avatar';
import sanitizeText from '../lib/content/sanitizeText';

// Clean UTF-8 AuthorBio component consuming Avatar + sanitizer
export default function AuthorBio({
  name = 'Marica Šinko',
  title = 'Founder of Quiet Strength',
  bio = 'Empowering introverted women to build quiet confidence without burnout.',
  avatarSrc = '/images/marica-sinko-author-photo.avif',
  avatarAlt = 'Portrait of Marica Šinko',
  size = 112,
}) {
  const safeName = sanitizeText(name);
  const safeTitle = sanitizeText(title);
  const safeBio = sanitizeText(bio);

  return (
    <aside
      className="mt-10 flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
    >
      <Avatar src={avatarSrc} alt={avatarAlt} size={size} />
      <div className="min-w-0">
        <h3 className="text-lg font-semibold leading-tight text-balance">{safeName}</h3>
        <p className="text-sm text-neutral-600">{safeTitle}</p>
        <p className="mt-2 text-sm leading-6 text-neutral-700">{safeBio}</p>
      </div>
    </aside>
  );
}

