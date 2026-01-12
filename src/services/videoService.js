// src/services/videoService.js

import { db } from './firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

/**
 * Fetch all videos from Firestore
 * @returns {Promise<Array>} Array of video objects
 */
export async function fetchVideos() {
  try {
    const videosRef = collection(db, 'videos');
    const q = query(videosRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const videos = [];
    snapshot.forEach((doc) => {
      videos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return videos;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
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