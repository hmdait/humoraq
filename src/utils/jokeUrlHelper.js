// src/utils/jokeUrlHelper.js
// Helper function to generate SEO-friendly joke URLs

import { valueToSlug } from '@/config/categories';

/**
 * Generate SEO-friendly URL for a joke
 * Format: /joke-about-{category}/{id}
 * 
 * @param {Object} joke - The joke object
 * @returns {string} - The SEO-friendly URL path
 */
export const getJokeUrl = (joke) => {
  if (!joke || !joke.id) {
    console.warn('Invalid joke object provided to getJokeUrl');
    return '/';
  }

  // Get category slug
  let categorySlug = 'general';
  
  if (Array.isArray(joke.categories) && joke.categories.length > 0) {
    categorySlug = valueToSlug(joke.categories[0]) || 'general';
  } else if (joke.category) {
    categorySlug = valueToSlug(joke.category) || 'general';
  }

  return `/joke-about-${categorySlug}/${joke.id}`;
};

/**
 * Navigate to joke page with SEO-friendly URL
 * 
 * @param {Object} router - Vue Router instance
 * @param {Object} joke - The joke object
 */
export const navigateToJoke = (router, joke) => {
  if (!joke || !joke.id) {
    console.warn('Invalid joke object provided to navigateToJoke');
    return;
  }

  const url = getJokeUrl(joke);
  router.push(url);
};