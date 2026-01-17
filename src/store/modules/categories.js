// src/store/modules/categories.js
// High-performance category management with caching

import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/services/firebase';

const state = {
  // Cache structure: { "en,fr,ar": { General: 10, Tech: 5, ... } }
  countsCache: {},
  
  // Cache structure: { "Tech-en,fr": [...jokes], "Work-en": [...jokes] }
  jokesCache: {},
  
  // Current category being viewed
  currentCategory: null,
  
  // Loading state
  loading: false,
  error: null,
  
  // Cache expiration (5 minutes)
  cacheExpiry: 5 * 60 * 1000,
  cacheTimestamps: {}
};

const getters = {
  /**
   * Get cached counts for specific languages
   */
  counts: (state) => {
    const key = Object.keys(state.countsCache)[0] || '';
    return state.countsCache[key] || {};
  },
  
  /**
   * Check if counts are cached and still valid
   */
  hasCachedCounts: (state) => (languagesKey) => {
    const hasCache = !!state.countsCache[languagesKey];
    
    if (!hasCache) return false;
    
    // Check if cache is expired
    const timestamp = state.cacheTimestamps[`counts-${languagesKey}`];
    if (!timestamp) return false;
    
    const isExpired = Date.now() - timestamp > state.cacheExpiry;
    return !isExpired;
  },
  
  /**
   * Get jokes for current category
   */
  currentCategoryJokes: (state) => {
    if (!state.currentCategory) return [];
    
    const keys = Object.keys(state.jokesCache);
    const matchingKey = keys.find(key => key.startsWith(`${state.currentCategory}-`));
    
    return matchingKey ? state.jokesCache[matchingKey] : [];
  },
  
  /**
   * Check if jokes are cached for a specific category+languages combo
   */
  hasCachedJokes: (state) => (cacheKey) => {
    const hasCache = !!state.jokesCache[cacheKey];
    
    if (!hasCache) return false;
    
    // Check if cache is expired
    const timestamp = state.cacheTimestamps[`jokes-${cacheKey}`];
    if (!timestamp) return false;
    
    const isExpired = Date.now() - timestamp > state.cacheExpiry;
    return !isExpired;
  },
  
  loading: (state) => state.loading,
  error: (state) => state.error
};

const mutations = {
  SET_COUNTS_CACHE(state, { languagesKey, counts }) {
    state.countsCache = { [languagesKey]: counts };
    state.cacheTimestamps[`counts-${languagesKey}`] = Date.now();
  },
  
  SET_JOKES_CACHE(state, { cacheKey, jokes }) {
    state.jokesCache[cacheKey] = jokes;
    state.cacheTimestamps[`jokes-${cacheKey}`] = Date.now();
  },
  
  SET_CURRENT_CATEGORY(state, category) {
    state.currentCategory = category;
  },
  
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  
  SET_ERROR(state, error) {
    state.error = error;
  },
  
  CLEAR_CACHE(state) {
    state.countsCache = {};
    state.jokesCache = {};
    state.cacheTimestamps = {};
  }
};

const actions = {
  /**
   * OPTIMIZATION: Fetch all category counts in parallel
   */
  async fetchCounts({ commit, state }, { languages, categories }) {
    const languagesKey = languages.join(',');
    
    // Return if valid cache exists
    if (state.countsCache[languagesKey]) {
      const timestamp = state.cacheTimestamps[`counts-${languagesKey}`];
      const isExpired = !timestamp || (Date.now() - timestamp > state.cacheExpiry);
      
      if (!isExpired) {
        console.log('✅ Using cached counts');
        return;
      }
    }
    
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    try {
      const counts = {};
      
      // OPTIMIZATION: Create all query promises first
      const queryPromises = [];
      const queryMeta = [];
      
      for (const category of categories) {
        for (const language of languages) {
          const q = query(
            collection(db, 'jokes'),
            where('status', '==', 'published'),
            where('language', '==', language),
            where('categories', 'array-contains', category.value)
          );
          
          queryPromises.push(getDocs(q));
          queryMeta.push({ category: category.value, language });
        }
      }
      
      console.log(`🚀 Fetching ${queryPromises.length} queries in parallel...`);
      const startTime = performance.now();
      
      // OPTIMIZATION: Execute all queries in parallel
      const results = await Promise.all(queryPromises);
      
      const endTime = performance.now();
      console.log(`✅ All queries completed in ${(endTime - startTime).toFixed(0)}ms`);
      
      // Process results
      results.forEach((snapshot, index) => {
        const { category } = queryMeta[index];
        counts[category] = (counts[category] || 0) + snapshot.size;
      });
      
      // Cache the results
      commit('SET_COUNTS_CACHE', { languagesKey, counts });
      
    } catch (error) {
      console.error('Error fetching counts:', error);
      commit('SET_ERROR', error.message);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  /**
   * OPTIMIZATION: Fetch jokes for a category with parallel queries
   */
  async fetchCategoryJokes({ commit, state }, { category, languages }) {
    const cacheKey = `${category}-${languages.join(',')}`;
    
    // Return if valid cache exists
    if (state.jokesCache[cacheKey]) {
      const timestamp = state.cacheTimestamps[`jokes-${cacheKey}`];
      const isExpired = !timestamp || (Date.now() - timestamp > state.cacheExpiry);
      
      if (!isExpired) {
        console.log('✅ Using cached jokes');
        commit('SET_CURRENT_CATEGORY', category);
        return;
      }
    }
    
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    commit('SET_CURRENT_CATEGORY', category);
    
    try {
      // OPTIMIZATION: Fetch all languages in parallel
      const queryPromises = languages.map(language => {
        const q = query(
          collection(db, 'jokes'),
          where('status', '==', 'published'),
          where('language', '==', language),
          where('categories', 'array-contains', category)
        );
        return getDocs(q);
      });
      
      console.log(`🚀 Fetching jokes for ${category} in ${languages.length} languages...`);
      const startTime = performance.now();
      
      const results = await Promise.all(queryPromises);
      
      const endTime = performance.now();
      console.log(`✅ Jokes fetched in ${(endTime - startTime).toFixed(0)}ms`);
      
      // Combine and sort results
      let allJokes = [];
      results.forEach(snapshot => {
        const jokes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        allJokes = [...allJokes, ...jokes];
      });
      
      // Sort by createdAt
      allJokes.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });
      
      // Cache the results
      commit('SET_JOKES_CACHE', { cacheKey, jokes: allJokes });
      
    } catch (error) {
      console.error('Error fetching category jokes:', error);
      commit('SET_ERROR', error.message);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  /**
   * Clear all caches (useful when data is stale)
   */
  clearCache({ commit }) {
    commit('CLEAR_CACHE');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};