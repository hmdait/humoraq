<template>
  <nav class="navbar" :class="{ 'is-scrolled': isScrolled }">
    <div class="container">
      <div class="navbar-content">
        <!-- Logo Section -->
        <router-link to="/" class="navbar-brand">
          <img src="@/assets/logo.png" alt="Humoraq Logo" class="navbar-logo" />
          <span class="brand-name">Humoraq</span>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="navbar-nav-desktop collapse navbar-collapse" id="navbarNav">
          <router-link 
            v-for="link in navLinks" 
            :key="link.to"
            :to="link.to" 
            class="nav-link"
          >
            <i :class="link.icon"></i>
            <span>{{ link.label }}</span>
          </router-link>
        </div>

        <!-- Actions Section -->
        <div class="navbar-actions">
          <!-- Language Selector with Bootstrap Dropdown -->
          <div class="dropdown language-dropdown">
            <button 
              class="btn-language dropdown-toggle" 
              type="button"
              id="languageDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-translate"></i>
              <span class="language-text">{{ languageButtonText }}</span>
              <span class="badge-count">{{ selectedLanguages.length }}</span>
            </button>
            
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
              <li class="dropdown-header">Select Languages</li>
              
              <li v-for="lang in availableLanguages" :key="lang.code">
                <label class="dropdown-item checkbox-item">
                  <input 
                    type="checkbox" 
                    :id="`lang-${lang.code}`"
                    :checked="isLanguageSelected(lang.code)"
                    @change="toggleLanguage(lang.code)"
                    class="checkbox-input"
                  />
                  <span class="checkbox-label">
                    <span class="lang-name">{{ lang.name }}</span>
                  </span>
                  <i v-if="isLanguageSelected(lang.code)" class="bi bi-check-circle-fill check-icon"></i>
                </label>
              </li>

              <li><hr class="dropdown-divider"></li>
              
              <li class="dropdown-footer">
                <small class="text-muted">
                  <strong>Selected:</strong> {{ selectedLanguagesText }}
                </small>
              </li>
            </ul>
          </div>

          <!-- Theme Toggle -->
          <ThemeToggle />

          <!-- Mobile Menu Toggle -->
          <button 
            class="btn-mobile-toggle navbar-toggler" 
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-label="Toggle menu"
          >
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import ThemeToggle from './ThemeToggle.vue';

const store = useStore();

// State
const isScrolled = ref(false);

// Navigation links
const navLinks = [
  { to: '/', label: 'Feed', icon: 'bi bi-grid' },
  { to: '/spotlight', label: 'Spotlight', icon: 'bi bi-star' },
  { to: '/videos', label: 'Videos', icon: 'bi bi-play-circle' },
  { to: '/categories', label: 'Categories', icon: 'bi bi-folder' },
  { to: '/submit', label: 'Submit', icon: 'bi bi-plus-circle' },
  { to: '/about', label: 'About', icon: 'bi bi-info-circle' }
];

// Available languages
const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' }
];

// Computed
const selectedLanguages = computed(() => store.getters['preferences/selectedLanguages']);

const languageButtonText = computed(() => {
  const langs = selectedLanguages.value;
  if (langs.length === 3) return 'All';
  if (langs.length === 1) {
    const names = { en: 'EN', fr: 'FR', ar: 'AR' };
    return names[langs[0]] || 'Lang';
  }
  return langs.map(l => l.toUpperCase()).join(', ');
});

const selectedLanguagesText = computed(() => {
  const names = { en: 'English', fr: 'Français', ar: 'العربية' };
  return selectedLanguages.value.map(l => names[l]).join(', ');
});

// Methods
const isLanguageSelected = (lang) => {
  return store.getters['preferences/isLanguageSelected'](lang);
};

const toggleLanguage = (lang) => {
  store.dispatch('preferences/toggleLanguage', lang);
};

// Scroll handler
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* ============================================
   NAVBAR BASE
   ============================================ */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1030;
  background: var(--card-bg, #ffffff);
  border-bottom: 1px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.navbar.is-scrolled {
  background: rgba(255, 255, 255, 0.95);
  border-bottom-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.dark-mode .navbar {
  background: var(--card-bg, #2c3034);
}

.dark-mode .navbar.is-scrolled {
  background: rgba(44, 48, 52, 0.95);
  border-bottom-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  gap: 2rem;
}

/* ============================================
   LOGO & BRAND
   ============================================ */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.navbar-brand:hover {
  transform: translateY(-2px);
}

.navbar-logo {
  height: 40px;
  width: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.navbar-brand:hover .navbar-logo {
  transform: scale(1.05);
}

.brand-name {
  font-weight: 700;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

/* ============================================
   DESKTOP NAVIGATION
   ============================================ */
.navbar-nav-desktop {
  display: none;
  gap: 0.5rem;
  align-items: center;
}

@media (min-width: 992px) {
  .navbar-nav-desktop {
    display: flex !important;
  }
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-color, #6b7280);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  overflow: hidden;
}

.nav-link i {
  font-size: 1.125rem;
  transition: transform 0.2s ease;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transform: translateX(-50%);
  transition: width 0.3s ease;
  border-radius: 2px;
}

.nav-link:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.08);
}

.nav-link:hover i {
  transform: translateY(-2px);
}

.nav-link:hover::before {
  width: 80%;
}

.nav-link.router-link-active {
  color: #667eea;
  background: rgba(102, 126, 234, 0.12);
}

.nav-link.router-link-active::before {
  width: 80%;
}

/* ============================================
   ACTIONS (Language, Theme, Mobile Toggle)
   ============================================ */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* ============================================
   LANGUAGE DROPDOWN
   ============================================ */
.language-dropdown {
  position: relative;
}

.btn-language {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: transparent;
  border: 1.5px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  color: var(--text-color, #374151);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark-mode .btn-language {
  border-color: rgba(255, 255, 255, 0.1);
}

.btn-language:hover {
  background: rgba(102, 126, 234, 0.08);
  border-color: #667eea;
  transform: translateY(-1px);
}

.btn-language[aria-expanded="true"] {
  background: rgba(102, 126, 234, 0.12);
  border-color: #667eea;
}

.btn-language i {
  font-size: 1.125rem;
}

.btn-language::after {
  display: none !important; /* Remove Bootstrap's default arrow */
}

.language-text {
  display: none;
}

@media (min-width: 576px) {
  .language-text {
    display: inline;
  }
}

.badge-count {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 0.375rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 0.6875rem;
  font-weight: 600;
  border-radius: 10px;
}

.dropdown-menu {
  min-width: 260px;
  background: var(--card-bg, white);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  padding: 0.5rem;
  margin-top: 8px !important;
  animation: dropdownSlideIn 0.2s ease-out;
}

.dark-mode .dropdown-menu {
  background: var(--card-bg, #2c3034);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

@keyframes dropdownSlideIn {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dropdown-header {
  padding: 0.75rem 0.75rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
}

.dropdown-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  gap: 0.75rem;
}

.dropdown-item:hover {
  background: rgba(102, 126, 234, 0.08);
}

.dropdown-item:active {
  background: rgba(102, 126, 234, 0.12);
}

.checkbox-item {
  padding: 0.75rem;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  margin: 0;
  flex-shrink: 0;
  border-radius: 4px;
  border: 2px solid #dee2e6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.checkbox-input:checked {
  background-color: #667eea;
  border-color: #667eea;
}

.checkbox-input:hover {
  border-color: #667eea;
}

.dark-mode .checkbox-input {
  background-color: #495057;
  border-color: #6c757d;
}

.dark-mode .checkbox-input:checked {
  background-color: #667eea;
  border-color: #667eea;
}

.checkbox-label {
  display: flex;
  align-items: center;
  flex: 1;
}

.lang-name {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-color, #374151);
}

.check-icon {
  color: #667eea;
  font-size: 1.125rem;
  margin-left: auto;
}

.dropdown-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.08);
  margin: 0.5rem 0;
  border: none;
}

.dark-mode .dropdown-divider {
  background: rgba(255, 255, 255, 0.1);
}

.dropdown-footer {
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  margin-top: 0.5rem;
}

.dark-mode .dropdown-footer {
  background: rgba(255, 255, 255, 0.05);
}

.dropdown-footer small {
  font-size: 0.8125rem;
  color: #9ca3af;
}

/* ============================================
   MOBILE MENU TOGGLE
   ============================================ */
.btn-mobile-toggle {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}

@media (min-width: 992px) {
  .btn-mobile-toggle {
    display: none;
  }
}

.btn-mobile-toggle:hover {
  transform: scale(1.05);
}

.hamburger-line {
  width: 24px;
  height: 2px;
  background: var(--text-color, #374151);
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-mobile-toggle:not(.collapsed) .hamburger-line:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.btn-mobile-toggle:not(.collapsed) .hamburger-line:nth-child(2) {
  opacity: 0;
  transform: translateX(-10px);
}

.btn-mobile-toggle:not(.collapsed) .hamburger-line:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 991px) {
  .navbar-content {
    padding: 0.75rem 0;
  }

  .navbar-logo {
    height: 32px;
  }

  .brand-name {
    font-size: 1.25rem;
  }

  .navbar-collapse {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
  }

  .dark-mode .navbar-collapse {
    border-top-color: rgba(255, 255, 255, 0.08);
  }

  .navbar-nav-desktop {
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
  }

  .nav-link {
    width: 100%;
    justify-content: flex-start;
    padding: 0.875rem 1rem;
  }

  .nav-link::before {
    display: none;
  }

  .nav-link.router-link-active {
    background: rgba(102, 126, 234, 0.15);
  }
}

@media (max-width: 576px) {
  .navbar-actions {
    gap: 0.5rem;
  }

  .btn-language {
    padding: 0.5rem 0.75rem;
  }

  .dropdown-menu {
    min-width: calc(100vw - 2rem);
  }
}
</style>