// utils/languageDetection.js

const SUPPORTED_LANGUAGES = ['en', 'fr', 'ar'];
const STORAGE_KEY = 'humoraq_languages';

/**
 * Detect browser languages and map to supported languages
 * @returns {string[]} Array of detected supported languages
 */
export function detectBrowserLanguages() {
  const browserLanguages = navigator.languages || [navigator.language || 'en'];
  const detected = new Set();

  for (const lang of browserLanguages) {
    // Extract language code (e.g., 'fr-FR' -> 'fr')
    const langCode = lang.split('-')[0].toLowerCase();
    
    if (SUPPORTED_LANGUAGES.includes(langCode)) {
      detected.add(langCode);
    }
  }

  // Fallback to English if no supported language detected
  return detected.size > 0 ? Array.from(detected) : ['en'];
}

/**
 * Get languages from localStorage
 * @returns {string[] | null} Stored languages or null if not found
 */
export function getStoredLanguages() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
    }
  } catch (error) {
    console.warn('Failed to parse stored languages:', error);
  }
  return null;
}

/**
 * Save languages to localStorage
 * @param {string[]} languages - Array of language codes
 */
export function saveLanguages(languages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(languages));
  } catch (error) {
    console.error('Failed to save languages:', error);
  }
}

/**
 * Initialize languages on app startup
 * Priority: localStorage > browser detection > default ['en']
 * @returns {{ languages: string[], wasAutoDetected: boolean }}
 */
export function initializeLanguages() {
  // 1. Check localStorage first
  const stored = getStoredLanguages();
  if (stored) {
    return { languages: stored, wasAutoDetected: false };
  }

  // 2. Detect from browser
  const detected = detectBrowserLanguages();
  
  // 3. Save detected languages
  saveLanguages(detected);
  
  return { languages: detected, wasAutoDetected: true };
}