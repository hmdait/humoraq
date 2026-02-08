/**
 * Update SEO metadata dynamically
 * Specifically designed for multi-language SPA
 */
export const updateDynamicSEO = ({ 
  title, 
  description, 
  keywords, 
  lang = 'en',
  ogLocale = 'en_US',
  canonical 
}) => {
  // Update document title
  if (title) {
    document.title = title;
  }

  // Update HTML lang attribute
  if (lang) {
    document.documentElement.lang = lang;
  }

  // Update meta tags
  updateOrCreateMetaTag('name', 'description', description);
  updateOrCreateMetaTag('name', 'keywords', keywords);
  
  // Open Graph tags
  updateOrCreateMetaTag('property', 'og:title', title);
  updateOrCreateMetaTag('property', 'og:description', description);
  updateOrCreateMetaTag('property', 'og:locale', ogLocale);
  updateOrCreateMetaTag('property', 'og:url', window.location.href);

  // Twitter tags
  updateOrCreateMetaTag('name', 'twitter:title', title);
  updateOrCreateMetaTag('name', 'twitter:description', description);

  // Canonical URL
  if (canonical) {
    updateOrCreateLinkTag('canonical', canonical);
  }
};

/**
 * Helper: Update or create meta tag
 */
const updateOrCreateMetaTag = (attr, attrValue, content) => {
  if (!content) return;

  let element = document.querySelector(`meta[${attr}="${attrValue}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, attrValue);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

/**
 * Helper: Update or create link tag
 */
const updateOrCreateLinkTag = (rel, href) => {
  if (!href) return;

  let element = document.querySelector(`link[rel="${rel}"]`);
  
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  
  element.setAttribute('href', href);
};