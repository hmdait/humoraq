const state = {
  languages: JSON.parse(localStorage.getItem('selectedLanguages') || '["en", "fr", "ar"]'), // Default: all languages
  theme: localStorage.getItem('theme') || 'light'
};

const getters = {
  selectedLanguages: (state) => state.languages,
  selectedTheme: (state) => state.theme,
  
  // Helper to check if a language is selected
  isLanguageSelected: (state) => (lang) => state.languages.includes(lang),
  
  // Check if all languages are selected
  allLanguagesSelected: (state) => state.languages.length === 3,
  
  // For backward compatibility (returns first selected language)
  selectedLanguage: (state) => state.languages[0] || 'en'
};

const mutations = {
  SET_LANGUAGES(state, languages) {
    // Ensure at least one language is always selected
    if (languages.length === 0) {
      languages = ['en'];
    }
    state.languages = languages;
    localStorage.setItem('selectedLanguages', JSON.stringify(languages));
  },
  
  TOGGLE_LANGUAGE(state, language) {
    const index = state.languages.indexOf(language);
    if (index > -1) {
      // Remove language if already selected (but keep at least one)
      if (state.languages.length > 1) {
        state.languages.splice(index, 1);
      }
    } else {
      // Add language
      state.languages.push(language);
    }
    localStorage.setItem('selectedLanguages', JSON.stringify(state.languages));
  },
  
  SET_THEME(state, theme) {
    state.theme = theme;
    localStorage.setItem('theme', theme);
  }
};

const actions = {
  setLanguages({ commit }, languages) {
    commit('SET_LANGUAGES', languages);
  },
  
  toggleLanguage({ commit }, language) {
    commit('TOGGLE_LANGUAGE', language);
  },
  
  setTheme({ commit }, theme) {
    commit('SET_THEME', theme);
  },
  
  initializePreferences({ commit }) {
    const savedLanguages = localStorage.getItem('selectedLanguages');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedLanguages) {
      commit('SET_LANGUAGES', JSON.parse(savedLanguages));
    }
    if (savedTheme) {
      commit('SET_THEME', savedTheme);
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};