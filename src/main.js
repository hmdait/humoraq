import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './assets/styles.css';

// CRITICAL: Initialize preferences BEFORE creating app
const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
const savedTheme = localStorage.getItem('theme') || 'light';

// Apply theme immediately
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-bs-theme', 'dark');
  document.body.classList.add('dark-mode');
} else {
  document.documentElement.setAttribute('data-bs-theme', 'light');
  document.body.classList.add('light-mode');
}

const app = createApp(App);

// Register store and router
app.use(store);
app.use(router);

// Initialize preferences after store is registered
store.dispatch('preferences/initializePreferences');

app.mount('#app');