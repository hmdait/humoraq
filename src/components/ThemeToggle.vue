<template>
  <button 
    @click="toggleTheme"
    class="btn btn-theme-toggle"
    :class="{ 'dark': isDark }"
    aria-label="Toggle theme"
    title="Toggle dark/light mode"
  >
    <span class="theme-icon">
      {{ isDark ? '☀️' : '🌙' }}
    </span>
  </button>
</template>

<script setup>
import { useTheme } from '../composables/useTheme';

const { isDark, toggleTheme } = useTheme();
</script>

<style scoped>
.btn-theme-toggle {
  border: none;
  background: transparent;
  font-size: 1.5rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  transition: transform 0.3s ease, opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-theme-toggle:hover {
  transform: scale(1.1);
  opacity: 0.8;
}

.btn-theme-toggle:active {
  transform: scale(0.95);
}

.theme-icon {
  display: inline-block;
  transition: transform 0.5s ease;
}

.btn-theme-toggle:hover .theme-icon {
  transform: rotate(20deg);
}

@media (max-width: 576px) {
  .btn-theme-toggle {
    font-size: 1.25rem;
  }
}
</style>