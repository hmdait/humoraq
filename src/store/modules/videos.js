// src/store/modules/videos.js

import { fetchVideos } from '@/services/videoService';

const state = {
  videos: [],
  loading: false,
  error: null,
  selectedCategories: [] // Multi-select: empty array = show all
};

const getters = {
  allVideos: (state) => state.videos,
  isLoading: (state) => state.loading,
  hasError: (state) => state.error !== null,
  errorMessage: (state) => state.error,
  videosCount: (state) => state.videos.length,
  selectedCategories: (state) => state.selectedCategories,
  
  // Check if a category is selected
  isCategorySelected: (state) => (categorySlug) => {
    return state.selectedCategories.includes(categorySlug);
  },
  
  // Computed filtered videos (client-side filtering)
  filteredVideos: (state, getters, rootState) => {
    let filtered = state.videos;
    
    // Filter by selected languages from preferences
    const selectedLanguages = rootState.preferences.languages;
    if (selectedLanguages && selectedLanguages.length > 0) {
      filtered = filtered.filter(video => selectedLanguages.includes(video.language));
    }
    
    // Filter by selected categories (multi-select)
    // If no categories selected, show all videos
    if (state.selectedCategories.length > 0) {
      filtered = filtered.filter(video => 
        state.selectedCategories.includes(video.category)
      );
    }
    
    return filtered;
  }
};

const mutations = {
  SET_VIDEOS(state, videos) {
    state.videos = videos;
  },
  
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  
  SET_ERROR(state, error) {
    state.error = error;
  },
  
  CLEAR_ERROR(state) {
    state.error = null;
  },
  
  SET_CATEGORIES(state, categories) {
    state.selectedCategories = categories;
  },
  
  TOGGLE_CATEGORY(state, categorySlug) {
    const index = state.selectedCategories.indexOf(categorySlug);
    if (index > -1) {
      // Remove category
      state.selectedCategories.splice(index, 1);
    } else {
      // Add category
      state.selectedCategories.push(categorySlug);
    }
  },
  
  CLEAR_CATEGORIES(state) {
    state.selectedCategories = [];
  }
};

const actions = {
  /**
   * Fetch videos with language filter only
   * Category filtering happens client-side via computed property
   */
  async fetchVideos({ commit, rootState }) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    try {
      // Get selected languages from preferences
      const languages = rootState.preferences.languages;
      
      console.log('Fetching videos for languages:', languages);
      
      // Fetch from Firestore (language filter only)
      const videos = await fetchVideos({ languages });
      
      commit('SET_VIDEOS', videos);
      console.log(`✅ Fetched ${videos.length} videos`);
    } catch (error) {
      commit('SET_ERROR', error.message || 'Failed to load videos');
      console.error('Error in fetchVideos action:', error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  /**
   * Toggle a category on/off
   * No need to refetch - filtering happens via computed property
   */
  toggleCategory({ commit }, categorySlug) {
    commit('TOGGLE_CATEGORY', categorySlug);
  },
  
  /**
   * Set multiple categories at once
   */
  setCategories({ commit }, categories) {
    commit('SET_CATEGORIES', categories);
  },
  
  /**
   * Clear all category selections (show all)
   */
  clearCategories({ commit }) {
    commit('CLEAR_CATEGORIES');
  },
  
  clearVideos({ commit }) {
    commit('SET_VIDEOS', []);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};