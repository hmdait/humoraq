import { createStore } from 'vuex';
import jokes from './modules/jokes';
import preferences from './modules/preferences';

export default createStore({
  modules: {
    jokes,
    preferences
  },
  strict: process.env.NODE_ENV !== 'production'
});