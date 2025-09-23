import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { getCanonicalUrl } from '../lib/seo/getCanonicalUrl';
import { useDynamicSEO } from '../hooks/useDynamicSEO';

const Seo = ({ title, description, type = 'website', path, article, book, person, breadcrumbs }) => {
  const location = useLocation();
  const siteName = 'Quiet Strength';
  const baseUrl = process.env.REACT_APP_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  
  // Use dynamic SEO hook for client-side updates
  useDynamicSEO();
  
  // Use the provided path or automatically detect from current location
  const currentPath = path || location.pathname + location.search;
  const canonicalUrl = getCanonicalUrl(currentPath);
  const url = canonicalUrl;

  const schema = [];

  const baseSchema = {
    '@context': 'https://schema.org',
  };

  if (type === 'article' && article) {
    schema.push({
      ...baseSchema,
      '@type': 'BlogPosting',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl
      },
      headline: article.title,
      description: description,
      image: article.image ? [`${baseUrl}${article.image}`] : [`${baseUrl}/images/logo.png`],
      author: {
        '@type': 'Person',
        name: article.authorName || 'Marica Šinko',
        url: `${baseUrl}/author/marica-sinko`,
      },
      publisher: {
        '@type': 'Organization',
        name: siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/images/logo.png`
        }
      },
      datePublished: article.datePublished,
      dateModified: article.dateModified || article.datePublished,
      ...(article.readTime && { timeRequired: article.readTime }),
      ...(article.keywords && { keywords: Array.isArray(article.keywords) ? article.keywords : article.keywords.split(',').map(k => k.trim()) }),
      ...(article.category && { articleSection: article.category })
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
    if (currentPath === '/') {
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

  // Let React Helmet handle deduplication automatically

  return (
    <Helmet>
      <title>{title ? `${title} | ${siteName}` : siteName}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={article?.ogTitle || `${title} | ${siteName}`} />
      <meta property="og:description" content={article?.ogDescription || description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      {(article?.ogImage || article?.image) && (
        <>
          <meta property="og:image" content={`${baseUrl}${article.ogImage || article.image}`} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={article?.ogTitle || title} />
        </>
      )}
      {type === 'article' && article && (
        <>
          <meta property="article:published_time" content={article.datePublished} />
          {article.dateModified && <meta property="article:modified_time" content={article.dateModified} />}
          <meta property="article:author" content={article.authorName || 'Marica Šinko'} />
          {article.category && <meta property="article:section" content={article.category} />}
          {article.keywords && article.keywords.map((tag, index) => 
            <meta key={index} property="article:tag" content={tag.trim()} />
          )}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@QuietStrengthGuide" />
      <meta name="twitter:creator" content="@MaricaSinko" />
      <meta name="twitter:title" content={article?.twitterTitle || article?.ogTitle || `${title} | ${siteName}`} />
      <meta name="twitter:description" content={article?.twitterDescription || article?.ogDescription || description} />
      <meta name="twitter:url" content={url} />
      {(article?.twitterImage || article?.ogImage || article?.image) && (
        <>
          <meta name="twitter:image" content={`${baseUrl}${article.twitterImage || article.ogImage || article.image}`} />
          <meta name="twitter:image:alt" content={article?.twitterTitle || article?.ogTitle || title} />
        </>
      )}

      {/* JSON-LD Schema */}
      <script type="application/ld+json">{JSON.stringify(schema.length > 1 ? schema : schema[0])}</script>
    
      {type === 'article' && article?.image && (
        <link rel="preload" as="image" href={`${baseUrl}${article.image}`} fetchpriority="high" data-preload-article-image />
      )}
    </Helmet>
  );
};

export default Seo;
