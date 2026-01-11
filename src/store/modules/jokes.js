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
    const selectedLanguages = rootState.preferences.languages;
    return state.jokes.filter(joke => selectedLanguages.includes(joke.language));
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
  async fetchRandomJoke({ commit, state, rootState }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    try {
      // Get selected languages from preferences
      const languages = rootState.preferences.languages;
      
      console.log('Fetching random joke for languages:', languages);
      
      // Fetch jokes for all selected languages
      let allJokes = [];
      
      for (const language of languages) {
        const filters = {
          language: language,
          category: state.category || undefined
        };
        
        console.log('Fetching with filters:', filters);
        
        const joke = await getRandomJoke(filters);
        if (joke) {
          allJokes.push(joke);
        }
      }
      
      console.log('Total jokes fetched:', allJokes.length);
      
      // Pick a random joke from all fetched jokes
      if (allJokes.length > 0) {
        const randomJoke = allJokes[Math.floor(Math.random() * allJokes.length)];
        commit('SET_CURRENT_JOKE', randomJoke);
      } else {
        commit('SET_CURRENT_JOKE', null);
        console.warn('No jokes found for selected languages');
      }
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
      // Get selected languages from preferences
      const languages = rootState.preferences.languages;
      
      console.log('Fetching jokes for category:', category, 'languages:', languages);
      
      // Fetch jokes for all selected languages
      let allJokes = [];
      
      for (const language of languages) {
        const jokes = await getJokesByCategory(category, language);
        allJokes = [...allJokes, ...jokes];
      }
      
      console.log('Total jokes fetched for category:', allJokes.length);
      
      // Sort by creation date (newest first)
      allJokes.sort((a, b) => {
        const aTime = a.createdAt && typeof a.createdAt.toMillis === 'function' 
          ? a.createdAt.toMillis() 
          : 0;
        const bTime = b.createdAt && typeof b.createdAt.toMillis === 'function' 
          ? b.createdAt.toMillis() 
          : 0;
        return bTime - aTime;
      });
      
      commit('SET_JOKES', allJokes);
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