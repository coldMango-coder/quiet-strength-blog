import React from 'react';
import { Helmet } from 'react-helmet-async';

const Seo = ({ title, description, type = 'website', path, article, book, person }) => {
  const siteName = 'Quiet Strength';
  const url = `https://yourdomain.com${path}`;

  const schema = {
    '@context': 'https://schema.org',
  };

  if (type === 'article' && article) {
    schema['@type'] = 'Article';
    schema.headline = article.title;
    schema.author = {
      '@type': 'Person',
      name: article.authorName,
    };
    schema.datePublished = article.datePublished;
    schema.image = `https://yourdomain.com${article.image}`;
    schema.description = description;
  } else if (type === 'book' && book) {
    schema['@type'] = 'Book';
    schema.name = book.title;
    schema.author = {
      '@type': 'Person',
      name: book.authorName,
    };
    schema.description = description;
    if (book.isbn) schema.isbn = book.isbn;
  } else if (type === 'person' && person) {
    schema['@type'] = 'Person';
    schema.name = person.name;
    schema.url = url;
    if (person.jobTitle) schema.jobTitle = person.jobTitle;
    if (person.image) schema.image = `https://yourdomain.com${person.image}`;
  } else {
    schema['@type'] = 'WebSite';
    schema.name = siteName;
    schema.url = url;
  }

  return (
    <Helmet>
      <title>{`${title} | ${siteName}`}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={`${title} | ${siteName}`} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      {article && <meta property="og:image" content={`https://yourdomain.com${article.image}`} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | ${siteName}`} />
      <meta name="twitter:description" content={description} />
      {article && <meta name="twitter:image" content={`https://yourdomain.com${article.image}`} />}

      {/* JSON-LD Schema */}
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default Seo;