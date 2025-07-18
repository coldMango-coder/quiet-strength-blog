import React from 'react';
import { Helmet } from 'react-helmet-async';

const Seo = ({ title, description, type = 'website', path, article, book, person, breadcrumbs }) => {
  const siteName = 'Quiet Strength';
  const baseUrl = 'https://quietstrength.com'; // Replace with your actual domain
  const url = `${baseUrl}${path}`;

  const schema = [];

  const baseSchema = {
    '@context': 'https://schema.org',
  };

  if (type === 'article' && article) {
    schema.push({
      ...baseSchema,
      '@type': 'Article',
      headline: article.title,
      author: {
        '@type': 'Person',
        name: article.authorName,
      },
      datePublished: article.datePublished,
      image: `${baseUrl}${article.image}`,
      description: description,
    });
  } else if (type === 'book' && book) {
    schema.push({
      ...baseSchema,
      '@type': 'Book',
      name: book.title,
      author: {
        '@type': 'Person',
        name: book.authorName,
      },
      description: description,
      ...(book.isbn && { isbn: book.isbn }),
    });
  } else if (type === 'person' && person) {
    schema.push({
      ...baseSchema,
      '@type': 'Person',
      name: person.name,
      url: url,
      ...(person.jobTitle && { jobTitle: person.jobTitle }),
      ...(person.image && { image: `${baseUrl}${person.image}` }),
    });
  } else {
    schema.push({
      ...baseSchema,
      '@type': 'WebSite',
      name: siteName,
      url: url,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    });
    
    // Add Organization schema for homepage
    if (path === '/') {
      schema.push({
        ...baseSchema,
        '@type': 'Organization',
        name: siteName,
        url: baseUrl,
        logo: `${baseUrl}/images/logo.png`,
        description: 'Self-help and productivity blog for introverted women',
        sameAs: [
          // Add your social media URLs here
          // 'https://twitter.com/yourhandle',
          // 'https://facebook.com/yourpage',
          // 'https://instagram.com/yourhandle'
        ]
      });
    }
  }

  if (breadcrumbs) {
    schema.push({
      ...baseSchema,
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: `${baseUrl}${crumb.item}`,
      })),
    });
  }

  return (
    <Helmet>
      <title>{title ? `${title} | ${siteName}` : siteName}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={`${title} | ${siteName}`} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      {article && <meta property="og:image" content={`${baseUrl}${article.image}`} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | ${siteName}`} />
      <meta name="twitter:description" content={description} />
      {article && <meta name="twitter:image" content={`${baseUrl}${article.image}`} />}

      {/* JSON-LD Schema */}
      <script type="application/ld+json">{JSON.stringify(schema.length > 1 ? schema : schema[0])}</script>
    </Helmet>
  );
};

export default Seo;