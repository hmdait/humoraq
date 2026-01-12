// src/store/index.js

import { createStore } from 'vuex';
import jokes from './modules/jokes';
import preferences from './modules/preferences';
import videos from './modules/videos';

export default createStore({
  modules: {
    jokes,
    preferences,
    videos
  },
  strict: process.env.NODE_ENV !== 'production'
});