/**
 * Detect if text is primarily RTL (Arabic, Hebrew, etc.)
 */
export const isRTL = (text) => {
  if (!text) return false;
  
  // Arabic Unicode range: U+0600 to U+06FF
  // Hebrew Unicode range: U+0590 to U+05FF
  const rtlRegex = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  
  // Check if text contains RTL characters
  return rtlRegex.test(text);
};

/**
 * Get direction based on text content
 */
export const getTextDirection = (text) => {
  return isRTL(text) ? 'rtl' : 'ltr';
};

/**
 * Get CSS class for text direction
 */
export const getDirectionClass = (text) => {
  return isRTL(text) ? 'rtl-text' : 'ltr-text';
};

/**
 * Detect language from text (simplified)
 */
export const detectLanguage = (text) => {
  if (!text) return 'en';
  
  // Arabic detection
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  
  // French detection (common French characters)
  if (/[àâäæçéèêëïîôùûüÿœÀÂÄÆÇÉÈÊËÏÎÔÙÛÜŸŒ]/.test(text)) return 'fr';
  
  // Default to English
  return 'en';
};