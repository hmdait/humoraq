<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom fixed-top">
    <div class="container">
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <img src="@/assets/logo.png" alt="Humoraq Logo" class="navbar-logo me-2" />
        <span class="brand-name">Humoraq</span>
      </router-link>

      <div class="d-flex align-items-center order-lg-2">
        <!-- Language Selector Dropdown -->
        <div class="dropdown me-2">
          <button class="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center" type="button"
            id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-translate me-1"></i>
            <span class="d-none d-sm-inline">
              {{ languageButtonText }}
            </span>
            <span class="badge bg-primary ms-1">{{ selectedLanguages.length }}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end language-menu px-3" aria-labelledby="languageDropdown">
            <li class="dropdown-header">Select Languages</li>
            <li>
              <div class="form-check px-3 py-2">
                <input class="form-check-input" type="checkbox" id="lang-en" :checked="isLanguageSelected('en')"
                  @change="toggleLanguage('en')">
                <label class="form-check-label" for="lang-en">
                  English
                </label>
              </div>
            </li>
            <li>
              <div class="form-check px-3 py-2">
                <input class="form-check-input" type="checkbox" id="lang-fr" :checked="isLanguageSelected('fr')"
                  @change="toggleLanguage('fr')">
                <label class="form-check-label" for="lang-fr">
                  Français
                </label>
              </div>
            </li>
            <li>
              <div class="form-check px-3 py-2">
                <input class="form-check-input" type="checkbox" id="lang-ar" :checked="isLanguageSelected('ar')"
                  @change="toggleLanguage('ar')">
                <label class="form-check-label" for="lang-ar">
                  العربية
                </label>
              </div>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li class="px-3 py-2">
              <small class="text-muted">
                Selected: {{ selectedLanguagesText }}
              </small>
            </li>
          </ul>
        </div>

        <ThemeToggle class="me-2" />

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

      <div class="collapse navbar-collapse order-lg-1" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Feed</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/spotlight" class="nav-link">Spotlight</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/videos" class="nav-link">Videos</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/categories" class="nav-link">Categories</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/submit" class="nav-link">Submit</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link">About</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  import ThemeToggle from './ThemeToggle.vue';

  const store = useStore();

  // Get selected languages from Vuex
  const selectedLanguages = computed(() => store.getters['preferences/selectedLanguages']);

  // Check if a language is selected
  const isLanguageSelected = (lang) => {
    return store.getters['preferences/isLanguageSelected'](lang);
  };

  // Toggle language selection
  const toggleLanguage = (lang) => {
    store.dispatch('preferences/toggleLanguage', lang);
  };

  // Button text showing selected languages
  const languageButtonText = computed(() => {
    const langs = selectedLanguages.value;
    if (langs.length === 3) return 'All';
    if (langs.length === 1) {
      const names = { en: 'EN', fr: 'FR', ar: 'AR' };
      return names[langs[0]] || 'Lang';
    }
    return langs.map(l => l.toUpperCase()).join(', ');
  });

  // Text showing selected languages in dropdown footer
  const selectedLanguagesText = computed(() => {
    const names = { en: 'English', fr: 'Français', ar: 'العربية' };
    return selectedLanguages.value.map(l => names[l]).join(', ');
  });
</script>

<style scoped>
  /* Fixed header */
  .navbar.fixed-top {
    z-index: 1030;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }

  .navbar-logo {
    height: 40px;
    width: auto;
    object-fit: contain;
  }

  .brand-name {
    font-weight: bold;
    font-size: 1.25rem;
  }

  /* Language Dropdown Container */
  .dropdown {
    position: relative;
  }

  /* Language Button */
  .dropdown-toggle {
    font-size: 0.9rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .dropdown-toggle:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .dropdown-toggle .badge {
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
    border-radius: 10px;
  }

  /* ENHANCED: Language Dropdown Menu */
  .language-menu {
    min-width: 260px;
    max-height: 400px;
    overflow-y: auto;
    position: absolute !important;
    top: calc(100% + 8px) !important;
    right: 0 !important;
    left: auto !important;
    z-index: 1050 !important;
    margin: 0;
    padding: 0.5rem 0;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(0, 0, 0, 0.1);

    /* Animation */
    animation: dropdownSlideIn 0.2s ease-out;
    transform-origin: top right;
  }

  @keyframes dropdownSlideIn {
    from {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Dropdown Header */
  .language-menu .dropdown-header {
    padding: 0.75rem 1rem;
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #6c757d;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    margin-bottom: 0.25rem;
  }

  /* FIXED: Checkbox Item Alignment */
  .language-menu .form-check {
    cursor: pointer;
    transition: all 0.2s ease;
    margin: 0;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    /* Space between checkbox and label */
  }

  .language-menu .form-check:hover {
    background-color: rgba(13, 110, 253, 0.08);
    padding-left: 1.25rem;
  }

  /* Checkbox Input */
  .language-menu .form-check-input {
    cursor: pointer;
    width: 18px;
    height: 18px;
    margin: 0;
    flex-shrink: 0;
    border-radius: 4px;
    border: 2px solid #dee2e6;
    transition: all 0.2s ease;
  }

  .language-menu .form-check-input:checked {
    background-color: #0d6efd;
    border-color: #0d6efd;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
  }

  .language-menu .form-check-input:hover {
    border-color: #0d6efd;
  }

  /* Label with Flag */
  .language-menu .form-check-label {
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    font-weight: 500;
    margin: 0;
    flex-grow: 1;
    line-height: 1;
  }

  /* Divider */
  .language-menu .dropdown-divider {
    margin: 0.5rem 0;
    border-color: rgba(0, 0, 0, 0.08);
  }

  /* Footer Text */
  .language-menu li:last-child {
    padding: 0.75rem 1rem;
    background-color: rgba(0, 0, 0, 0.02);
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    margin-top: 0.25rem;
  }

  .language-menu li:last-child small {
    font-size: 0.8rem;
    color: #6c757d;
    font-weight: 500;
  }

  /* Scrollbar Styling */
  .language-menu::-webkit-scrollbar {
    width: 6px;
  }

  .language-menu::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
  }

  .language-menu::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }

  .language-menu::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  /* Dark Mode Adjustments */
  .dark-mode .dropdown-toggle {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .dark-mode .language-menu {
    background-color: #2c3034;
    border-color: #495057;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  .dark-mode .language-menu .dropdown-header {
    color: #adb5bd;
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  .dark-mode .language-menu .form-check:hover {
    background-color: rgba(13, 110, 253, 0.15);
  }

  .dark-mode .language-menu .form-check-input {
    background-color: #495057;
    border-color: #6c757d;
  }

  .dark-mode .language-menu .form-check-input:checked {
    background-color: #0d6efd;
    border-color: #0d6efd;
  }

  .dark-mode .language-menu .form-check-label {
    color: #f8f9fa;
  }

  .dark-mode .language-menu .dropdown-divider {
    border-color: rgba(255, 255, 255, 0.1);
  }

  .dark-mode .language-menu li:last-child {
    background-color: rgba(255, 255, 255, 0.05);
    border-top-color: rgba(255, 255, 255, 0.1);
  }

  .dark-mode .language-menu li:last-child small {
    color: #adb5bd;
  }

  .dark-mode .language-menu::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  .dark-mode .language-menu::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
  }

  .dark-mode .language-menu::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  /* Active link styling */
  .nav-link {
    position: relative;
    transition: color 0.2s ease;
  }

  .nav-link:hover {
    color: var(--primary-color) !important;
  }

  .nav-link.router-link-active {
    color: var(--primary-color) !important;
    font-weight: 500;
  }

  .nav-link.router-link-active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 2px;
    background-color: var(--primary-color);
  }

  /* Dark mode navbar */
  .dark-mode .navbar {
    background-color: var(--card-bg) !important;
    border-bottom-color: var(--border-color) !important;
  }

  .dark-mode .navbar-brand,
  .dark-mode .nav-link {
    color: var(--text-color) !important;
  }

  .dark-mode .nav-link:hover,
  .dark-mode .nav-link.router-link-active {
    color: var(--primary-color) !important;
  }

  /* Mobile responsive */
  @media (max-width: 991px) {
    .navbar-nav {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #dee2e6;
    }

    .dark-mode .navbar-nav {
      border-top-color: var(--border-color);
    }

    .nav-link.router-link-active::after {
      display: none;
    }

    .nav-item {
      text-align: center;
    }

    .language-menu {
      position: fixed !important;
      top: 65px !important;
      right: 10px !important;
      left: 10px !important;
      max-width: calc(100vw - 20px);
    }
  }

  @media (max-width: 576px) {
    .navbar-logo {
      height: 32px;
    }

    .brand-name {
      font-size: 1.1rem;
    }

    .dropdown-toggle {
      font-size: 0.85rem;
      padding: 0.4rem 0.75rem;
    }

    .language-menu {
      min-width: 240px;
    }
  }
</style>