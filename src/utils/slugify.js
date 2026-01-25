// src/utils/slugify.js
// Utility to convert text to URL-friendly slugs

/**
 * Convert text to URL-friendly slug
 * Handles English, French, and Arabic text
 * 
 * @param {string} text - Text to slugify
 * @param {number} maxLength - Maximum slug length (default: 60)
 * @returns {string} - URL-friendly slug
 */
export const slugify = (text, maxLength = 60) => {
  if (!text) return 'untitled';

  let slug = text
    .toString()
    .toLowerCase()
    .trim();

  // Replace Arabic characters with transliteration (optional)
  const arabicToLatin = {
    'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j',
    'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r',
    'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd',
    'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f',
    'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
    'ه': 'h', 'و': 'w', 'ي': 'y', 'ة': 'h', 'ى': 'a',
    'ء': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'a', 'ؤ': 'o',
    'ئ': 'e'
  };

  // Replace French accented characters
  const frenchToLatin = {
    'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
    'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
    'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
    'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
    'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
    'ý': 'y', 'ÿ': 'y',
    'ñ': 'n', 'ç': 'c',
    'œ': 'oe', 'æ': 'ae'
  };

  // Replace special characters
  Object.keys(arabicToLatin).forEach(char => {
    slug = slug.replace(new RegExp(char, 'g'), arabicToLatin[char]);
  });

  Object.keys(frenchToLatin).forEach(char => {
    slug = slug.replace(new RegExp(char, 'g'), frenchToLatin[char]);
  });

  // Remove emojis and special Unicode characters
  slug = slug.replace(/[\u{1F600}-\u{1F64F}]/gu, ''); // Emoticons
  slug = slug.replace(/[\u{1F300}-\u{1F5FF}]/gu, ''); // Symbols & Pictographs
  slug = slug.replace(/[\u{1F680}-\u{1F6FF}]/gu, ''); // Transport & Map
  slug = slug.replace(/[\u{2600}-\u{26FF}]/gu, '');   // Miscellaneous Symbols
  slug = slug.replace(/[\u{2700}-\u{27BF}]/gu, '');   // Dingbats

  // Replace special characters with spaces
  slug = slug.replace(/[^\w\s-]/g, ' ');

  // Replace multiple spaces/hyphens with single hyphen
  slug = slug.replace(/[\s_-]+/g, '-');

  // Remove leading/trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '');

  // Truncate to max length at word boundary
  if (slug.length > maxLength) {
    slug = slug.substring(0, maxLength);
    const lastHyphen = slug.lastIndexOf('-');
    if (lastHyphen > maxLength * 0.7) {
      slug = slug.substring(0, lastHyphen);
    }
  }

  // Remove trailing hyphens after truncation
  slug = slug.replace(/-+$/g, '');

  // Return slug or fallback
  return slug || 'untitled';
};

/**
 * Generate slug from joke title or text
 * Falls back to text preview if no title
 * 
 * @param {Object} joke - Joke object
 * @returns {string} - Generated slug
 */
export const generateJokeSlug = (joke) => {
  if (!joke) return 'untitled';

  // Use title if available
  if (joke.title && joke.title.trim()) {
    return slugify(joke.title);
  }

  // Fallback to first 60 characters of joke text
  if (joke.text && joke.text.trim()) {
    const preview = joke.text.substring(0, 80).trim();
    return slugify(preview);
  }

  return 'untitled';
};

/**
 * Extract ID from slug-based URL
 * Handles format: /category-jokes/title-slug-{id}
 * 
 * @param {string} url - URL or slug
 * @returns {string|null} - Extracted ID or null
 */
export const extractIdFromSlug = (url) => {
  if (!url) return null;

  // Extract the last segment after the last hyphen
  const segments = url.split('/');
  const lastSegment = segments[segments.length - 1];
  
  // ID is after the last hyphen
  const parts = lastSegment.split('-');
  if (parts.length > 0) {
    return parts[parts.length - 1];
  }

  return null;
};