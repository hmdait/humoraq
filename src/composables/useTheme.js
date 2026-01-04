import { ref, watch, onMounted } from 'vue';

const isDark = ref(false);

export function useTheme() {
  const initTheme = () => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      isDark.value = savedTheme === 'dark';
    } else {
      // Check system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    applyTheme();
  };

  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  };

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    applyTheme();
  };

  // Watch for changes
  watch(isDark, () => {
    applyTheme();
  });

  return {
    isDark,
    toggleTheme,
    initTheme
  };
}