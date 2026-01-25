// src/utils/jokeUrlHelper.js
// Helper function to generate SEO-friendly joke URLs with title slugs
// Format: /{category}-jokes/{title-slug}-{id}

import { valueToSlug } from '@/config/categories';
import { generateJokeSlug } from './slugify';

/**
 * Generate SEO-friendly URL for a joke
 * Format: /{category}-jokes/{title-slug}-{id}
 * 
 * Examples:
 *  - /tech-jokes/why-programmers-prefer-dark-mode-abc123
 *  - /dad-jokes/what-do-you-call-a-fake-noodle-xyz789
 *  - /relationships-jokes/my-wife-said-i-never-listen-def456
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

  // Generate title slug
  const titleSlug = generateJokeSlug(joke);

  // Format: /{category}-jokes/{title-slug}-{id}
  return `/${categorySlug}-jokes/${titleSlug}-${joke.id}`;
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

/**
 * Get full URL for sharing (with domain)
 * 
 * @param {Object} joke - The joke object
 * @param {string} baseUrl - Base URL (default: window.location.origin)
 * @returns {string} - Complete URL for sharing
 */
export const getJokeShareUrl = (joke, baseUrl = null) => {
  const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://humoraq.com');
  return `${origin}${getJokeUrl(joke)}`;
};

/**
 * Extract joke ID from URL path
 * Handles format: /{category}-jokes/{title-slug}-{id}
 * 
 * @param {string} path - URL path
 * @returns {string|null} - Extracted ID or null
 */
export const extractJokeIdFromPath = (path) => {
  if (!path) return null;

  // Extract the last segment
  const segments = path.split('/');
  const lastSegment = segments[segments.length - 1];
  
  // ID is after the last hyphen
  const parts = lastSegment.split('-');
  if (parts.length > 0) {
    return parts[parts.length - 1];
  }

  return null;
};