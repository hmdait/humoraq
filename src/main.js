import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './assets/styles.css';

// Initialize theme before mounting app
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-bs-theme', 'dark');
  document.body.classList.add('dark-mode');
} else if (savedTheme === 'light') {
  document.documentElement.setAttribute('data-bs-theme', 'light');
  document.body.classList.add('light-mode');
} else {
  // Check system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light');
  document.body.classList.add(prefersDark ? 'dark-mode' : 'light-mode');
}

const app = createApp(App);
app.use(router);
app.mount('#app');