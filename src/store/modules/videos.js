// src/store/modules/videos.js

import { fetchVideos } from '@/services/videoService';

const state = {
  videos: [],
  loading: false,
  error: null
};

const getters = {
  allVideos: (state) => state.videos,
  isLoading: (state) => state.loading,
  hasError: (state) => state.error !== null,
  errorMessage: (state) => state.error,
  videosCount: (state) => state.videos.length
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
  }
};

const actions = {
  async fetchVideos({ commit }) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    try {
      const videos = await fetchVideos();
      commit('SET_VIDEOS', videos);
    } catch (error) {
      commit('SET_ERROR', error.message || 'Failed to load videos');
      console.error('Error in fetchVideos action:', error);
    } finally {
      commit('SET_LOADING', false);
    }
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