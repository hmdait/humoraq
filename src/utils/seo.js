// src/utils/seo.js - Enhanced SEO Utilities

/**
 * Update page meta tags for SEO
 */
export const updateSEO = ({ title, description, keywords, canonical, ogImage }) => {
  // Update title
  if (title) {
    document.title = title;
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('name', 'twitter:title', title);
  }

  // Update description
  if (description) {
    updateMetaTag('name', 'description', description);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('name', 'twitter:description', description);
  }

  // Update keywords
  if (keywords) {
    updateMetaTag('name', 'keywords', keywords);
  }

  // Update canonical URL
  if (canonical) {
    updateLinkTag('canonical', canonical);
  }

  // Update OG image
  if (ogImage) {
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('name', 'twitter:image', ogImage);
  }

  // Always update current URL
  updateMetaTag('property', 'og:url', window.location.href);
};

/**
 * Helper to update or create meta tags
 */
const updateMetaTag = (attr, attrValue, content) => {
  let element = document.querySelector(`meta[${attr}="${attrValue}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, attrValue);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

/**
 * Helper to update or create link tags
 */
const updateLinkTag = (rel, href) => {
  let element = document.querySelector(`link[rel="${rel}"]`);
  
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  
  element.setAttribute('href', href);
};

/**
 * Set default SEO for home page
 */
export const setDefaultSEO = () => {
  updateSEO({
    title: 'Funny Jokes in Multiple Languages | Best Jokes 2026',
    description: 'Discover the best funny jokes in English, French, and Arabic. Short jokes, one-liners, dark humor, clean jokes for adults. Browse by category: tech, work, relationships, and more!',
    keywords: 'funny jokes, short funny jokes, one line jokes, funny jokes to tell friends, clean jokes for adults, dark humor jokes, best jokes 2026, funny jokes in english, funny jokes in french, short jokes for social media',
    canonical: 'https://humoraq.com'
  });
};