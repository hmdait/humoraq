// src/store/index.js

import { createStore } from 'vuex';
import jokes from './modules/jokes';
import preferences from './modules/preferences';
import videos from './modules/videos';
import categories from './modules/categories';

export default createStore({
  modules: {
    jokes,
    preferences,
    videos,
    categories
  },
  strict: process.env.NODE_ENV !== 'production'
});