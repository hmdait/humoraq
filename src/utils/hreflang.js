// src/utils/hreflang.js
// Utility for managing hreflang tags for multilingual SEO

/**
 * Add hreflang tags to the current page
 * Tells Google that this page is available in multiple languages
 * 
 * @param {string} currentPath - Current page path (e.g., '/category/tech-jokes')
 */
export const addHreflangTags = (currentPath) => {
  // Remove any existing hreflang tags to avoid duplicates
  const existingTags = document.querySelectorAll('link[rel="alternate"][hreflang]');
  existingTags.forEach(tag => tag.remove());

  // Base URL (change this to your production domain)
  const baseUrl = 'https://humoraq.com';
  const fullUrl = `${baseUrl}${currentPath}`;
  
  // All supported languages
  const languages = ['en', 'fr', 'es', 'ar'];

  console.log(`🌍 Adding hreflang tags for: ${fullUrl}`);

  // Add hreflang for each language
  languages.forEach(lang => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = lang;
    link.href = fullUrl; // Same URL, content changes based on language selector
    document.head.appendChild(link);
    
    console.log(`  ✅ Added hreflang="${lang}" href="${fullUrl}"`);
  });

  // Add x-default fallback (for users with unsupported languages)
  const defaultLink = document.createElement('link');
  defaultLink.rel = 'alternate';
  defaultLink.hreflang = 'x-default';
  defaultLink.href = fullUrl;
  document.head.appendChild(defaultLink);
  
  console.log(`  ✅ Added hreflang="x-default" href="${fullUrl}"`);
};

/**
 * Update HTML lang attribute based on current language
 * 
 * @param {string} lang - Language code ('en', 'fr', 'es', 'ar')
 */
export const updateHtmlLang = (lang) => {
  document.documentElement.setAttribute('lang', lang);
  
  // Set text direction (RTL for Arabic, LTR for others)
  const direction = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', direction);
  
  console.log(`🌐 Updated HTML lang="${lang}" dir="${direction}"`);
};

/**
 * Get current page path for hreflang
 * Removes query parameters and hash
 * 
 * @returns {string} Clean path
 */
export const getCurrentPath = () => {
  return window.location.pathname;
};