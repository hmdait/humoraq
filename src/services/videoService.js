// src/services/videoService.js

import { db } from './firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

/**
 * Fetch all videos from Firestore with optional filters
 * @param {Object} filters - Optional filters { languages, category }
 * @returns {Promise<Array>} Array of video objects
 */
export async function fetchVideos(filters = {}) {
  try {
    const videosRef = collection(db, 'videos');
    
    // Simplified query - fetch all and filter client-side
    // This avoids the need for composite index during development
    const q = query(videosRef);
    
    const snapshot = await getDocs(q);
    
    let videos = [];
    snapshot.forEach((doc) => {
      videos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Apply language filter client-side
    if (filters.languages && filters.languages.length > 0) {
      videos = videos.filter(video => filters.languages.includes(video.language));
    }
    
    // Apply category filter client-side
    if (filters.category && filters.category !== 'all') {
      videos = videos.filter(video => video.category === filters.category);
    }
    
    // Sort by createdAt (newest first) - client-side
    videos.sort((a, b) => {
      const aTime = a.createdAt && typeof a.createdAt.toMillis === 'function' 
        ? a.createdAt.toMillis() 
        : 0;
      const bTime = b.createdAt && typeof b.createdAt.toMillis === 'function' 
        ? b.createdAt.toMillis() 
        : 0;
      return bTime - aTime;
    });
    
    console.log(`✅ Fetched ${videos.length} videos with filters:`, filters);
    return videos;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
}

/**
 * Get unique categories from videos
 * @returns {Array} Array of category objects
 */
export function getVideoCategories() {
  // Predefined categories matching your joke categories
  return [
    { slug: 'all', name: 'All Categories', icon: '📺' },
    { slug: 'general', name: 'General', icon: '😄' },
    { slug: 'tech', name: 'Tech', icon: '💻' },
    { slug: 'work', name: 'Work', icon: '💼' },
    { slug: 'animals', name: 'Animals', icon: '🐶' },
    { slug: 'food', name: 'Food', icon: '🍕' }
  ];
}

/**
 * Get YouTube embed URL
 * @param {string} videoId - YouTube video ID
 * @returns {string} Embed URL
 */
export function getYouTubeEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}

/**
 * Get direct YouTube link
 * @param {string} videoId - YouTube video ID
 * @returns {string} Direct URL
 */
export function getYouTubeUrl(videoId) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * Get YouTube thumbnail URL
 * @param {string} videoId - YouTube video ID
 * @param {string} quality - Thumbnail quality (default, mqdefault, hqdefault, sddefault, maxresdefault)
 * @returns {string} Thumbnail URL
 */
export function getYouTubeThumbnail(videoId, quality = 'hqdefault') {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}