// src/i18n/index.js
// Main i18n entry point with modular structure

import { ref, watch } from 'vue';
import store from '@/store';

// Import translation modules
import nav from './locales/nav';
import feed from './locales/feed';
import categories from './locales/categories';
import category from './locales/category';
import categoryNames from './locales/categoryNames';
import spotlight from './locales/spotlight';
import videos from './locales/videos';
import blog from './locales/blog';
import submit from './locales/submit';
import about from './locales/about';
import legal from './locales/legal';
import common from './locales/common';
import seo from './locales/seo';

// Available languages
export const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' }
];

// Current language (reactive) - synced with Vuex store
export const currentLanguage = ref('en');

// Initialize from Vuex store (content language)
const initLanguage = () => {
  const contentLanguages = store.getters['preferences/selectedLanguages'];
  if (contentLanguages && contentLanguages.length > 0) {
    const lang = contentLanguages[0];
    if (AVAILABLE_LANGUAGES.some(l => l.code === lang)) {
      currentLanguage.value = lang;
    }
  }
};

// Watch Vuex store for content language changes
store.watch(
  (state, getters) => getters['preferences/selectedLanguages'],
  (newLanguages) => {
    if (newLanguages && newLanguages.length > 0) {
      const lang = newLanguages[0];
      if (AVAILABLE_LANGUAGES.some(l => l.code === lang)) {
        currentLanguage.value = lang;
        // Update HTML lang attribute
        document.documentElement.lang = lang;
      }
    }
  }
);

// Initialize on module load
initLanguage();

// Update HTML lang attribute when currentLanguage changes
watch(currentLanguage, (newLang) => {
  document.documentElement.lang = newLang;
});

// Combine all translation modules
const translations = {
  en: {
    nav: nav.en,
    feed: feed.en,
    categories: categories.en,
    category: category.en,
    categoryNames: categoryNames.en,
    spotlight: spotlight.en,
    videos: videos.en,
    blog: blog.en,
    submit: submit.en,
    about: about.en,
    legal: legal.en,
    common: common.en,
    seo: seo.en
  },
  fr: {
    nav: nav.fr,
    feed: feed.fr,
    categories: categories.fr,
    category: category.fr,
    categoryNames: categoryNames.fr,
    spotlight: spotlight.fr,
    videos: videos.fr,
    blog: blog.fr,
    submit: submit.fr,
    about: about.fr,
    legal: legal.fr,
    common: common.fr,
    seo: seo.fr
  },
  es: {
    nav: nav.es,
    feed: feed.es,
    categories: categories.es,
    category: category.es,
    categoryNames: categoryNames.es,
    spotlight: spotlight.es,
    videos: videos.es,
    blog: blog.es,
    submit: submit.es,
    about: about.es,
    legal: legal.es,
    common: common.es,
    seo: seo.es
  },
  ar: {
    nav: nav.ar,
    feed: feed.ar,
    categories: categories.ar,
    category: category.ar,
    categoryNames: categoryNames.ar,
    spotlight: spotlight.ar,
    videos: videos.ar,
    blog: blog.ar,
    submit: submit.ar,
    about: about.ar,
    legal: legal.ar,
    common: common.ar,
    seo: seo.ar
  }
};

// Translation function
export const t = (key, lang = currentLanguage.value) => {
  const keys = key.split('.');
  let value = translations[lang];
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      // Fallback to English
      value = translations['en'];
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object') {
          value = value[fallbackKey];
        } else {
          return key; // Return key if not found
        }
      }
      break;
    }
  }
  
  return value || key;
};

export default translations;