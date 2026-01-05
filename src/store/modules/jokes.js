import { 
  getJokeById, 
  getRandomJoke, 
  getJokesByCategory 
} from '@/services/jokeService';

const state = {
  currentJoke: null,
  jokes: [],
  loading: false,
  error: null,
  category: ''
};

const getters = {
  currentJoke: (state) => state.currentJoke,
  jokes: (state) => state.jokes,
  loading: (state) => state.loading,
  error: (state) => state.error,
  currentCategory: (state) => state.category,
  jokesCount: (state) => state.jokes.length,
  
  jokesByLanguage: (state, getters, rootState) => {
    const selectedLanguage = rootState.preferences.language;
    return state.jokes.filter(joke => joke.language === selectedLanguage);
  },
  
  getJokePreview: (state) => (joke, maxLength = 100) => {
    if (!joke || !joke.text) return '';
    
    if (joke.text.length <= maxLength) return joke.text;
    
    const truncated = joke.text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + '...';
    }
    
    return truncated + '...';
  }
};

const mutations = {
  SET_CURRENT_JOKE(state, joke) {
    state.currentJoke = joke;
  },
  
  SET_JOKES(state, jokes) {
    state.jokes = jokes;
  },
  
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  
  SET_ERROR(state, error) {
    state.error = error;
  },
  
  SET_CATEGORY(state, category) {
    state.category = category;
  },
  
  CLEAR_JOKES(state) {
    state.jokes = [];
    state.currentJoke = null;
  }
};

const actions = {
  // FIXED: Properly access state.category
  async fetchRandomJoke({ commit, state, rootState }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    try {
      // CRITICAL: Get language from Vuex preferences module
      const language = rootState.preferences.language;
      
      // CRITICAL: Get category from local state
      const category = state.category;
      
      const filters = {
        language: language,
        category: category || undefined
      };

      const joke = await getRandomJoke(filters);
      
      commit('SET_CURRENT_JOKE', joke);
    } catch (error) {
      commit('SET_ERROR', error.message);
      console.error('Error fetching random joke:', error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  async fetchJokeById({ commit }, jokeId) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    try {
      const joke = await getJokeById(jokeId);
      commit('SET_CURRENT_JOKE', joke);
    } catch (error) {
      commit('SET_ERROR', error.message);
      console.error('Error fetching joke:', error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  async fetchJokesByCategory({ commit, rootState }, category) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    commit('SET_CATEGORY', category);
    
    try {
      // CRITICAL: Get language from Vuex preferences module
      const language = rootState.preferences.language;
          
      const jokes = await getJokesByCategory(category, language);
      commit('SET_JOKES', jokes);
    } catch (error) {
      commit('SET_ERROR', error.message);
      console.error('Error fetching jokes by category:', error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  setCategory({ commit }, category) {
    commit('SET_CATEGORY', category);
  },
  
  clearJokes({ commit }) {
    commit('CLEAR_JOKES');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};