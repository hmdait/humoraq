import { trackLanguageChange } from '../../services/analyticsService'; 

const state = {
  language: localStorage.getItem('selectedLanguage') || 'en',
  theme: localStorage.getItem('theme') || 'light'
};

const getters = {
  selectedLanguage: (state) => state.language,
  selectedTheme: (state) => state.theme,
  isLanguageSelected: (state) => (lang) => state.language === lang
};

const mutations = {
  SET_LANGUAGE(state, language) {
    const oldLanguage = state.language; // ADD THIS
    state.language = language;
    localStorage.setItem('selectedLanguage', language);
    
    //Track language change
    if (oldLanguage !== language) {
      trackLanguageChange(oldLanguage, language);
    }
  },
  
  SET_THEME(state, theme) {
    state.theme = theme;
    localStorage.setItem('theme', theme);
  }
};

const actions = {
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language);
  },
  
  setTheme({ commit }, theme) {
    commit('SET_THEME', theme);
  },
  
  initializePreferences({ commit }) {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedLanguage) {
      commit('SET_LANGUAGE', savedLanguage);
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