import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase';


/**
 * Check if analytics is available
 */
const isAnalyticsAvailable = () => {
  if (!analytics) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('📊 Analytics not initialized - events will not be tracked');
    }
    return false;
  }
  return true;
};

/**
 * Log custom analytics events
 */
export const trackEvent = (eventName, eventParams = {}) => {
  // Skip analytics in development (optional)
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 [DEV] Analytics event: ${eventName}`, eventParams);
    return; // Don't actually send to Firebase in dev
  }

  if (!isAnalyticsAvailable()) return;

  try {
    logEvent(analytics, eventName, eventParams);
  } catch (error) {
    console.error('❌ Error logging analytics event:', error);
  }
};

/**
 * Track page view
 */
export const trackPageView = (pageName, pageTitle) => {
  trackEvent('page_view', {
    page_title: pageTitle,
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_name: pageName
  });
};

/**
 * Track joke view
 */
export const trackJokeView = (jokeId, category, language) => {
  trackEvent('view_joke', {
    joke_id: jokeId,
    category: category,
    language: language
  });
};

/**
 * Track joke like
 */
export const trackJokeLike = (jokeId, category, language) => {
  trackEvent('like_joke', {
    joke_id: jokeId,
    category: category,
    language: language,
    value: 1 // For conversion tracking
  });
};

/**
 * Track joke submission
 */
export const trackJokeSubmit = (category, language, authorType) => {
  trackEvent('submit_joke', {
    category: category,
    language: language,
    author_type: authorType,
    value: 1
  });
};

/**
 * Track language change
 */
export const trackLanguageChange = (oldLanguage, newLanguage) => {
  trackEvent('change_language', {
    old_language: oldLanguage,
    new_language: newLanguage
  });
};

/**
 * Track category browse
 */
export const trackCategoryBrowse = (categorySlug, language) => {
  trackEvent('browse_category', {
    category: categorySlug,
    language: language
  });
};

/**
 * Track spotlight interaction
 */
export const trackSpotlightAction = (action, jokeId = null) => {
  const params = { action };
  if (jokeId) params.joke_id = jokeId;
  
  trackEvent('spotlight_action', params);
};

/**
 * Track feed scroll
 */
export const trackFeedScroll = (jokesLoaded, hasMore) => {
  trackEvent('feed_scroll', {
    jokes_loaded: jokesLoaded,
    has_more: hasMore
  });
};

/**
 * Track search/filter
 */
export const trackFilter = (filterType, filterValue) => {
  trackEvent('apply_filter', {
    filter_type: filterType,
    filter_value: filterValue
  });
};

/**
 * Track user engagement time
 */
export const trackEngagement = (duration, page) => {
  trackEvent('user_engagement', {
    engagement_time_msec: duration,
    page: page
  });
};

/**
 * Track errors
 */
export const trackError = (errorMessage, errorContext) => {
  trackEvent('error', {
    error_message: errorMessage,
    error_context: errorContext
  });
};

/**
 * Track custom conversion
 */
export const trackConversion = (conversionType, value = 1) => {
  trackEvent('conversion', {
    conversion_type: conversionType,
    value: value
  });
};