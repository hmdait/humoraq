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
        <div class="navbar-nav-desktop" :class="{ 'show': showMobileMenu }">
          <router-link 
            v-for="link in navLinks" 
            :key="link.to"
            :to="link.to" 
            class="nav-link"
            @click="closeMobileMenu"
          >
            <i :class="link.icon"></i>
            <span>{{ t(`nav.${link.key}`) }}</span>
          </router-link>
        </div>

        <!-- Actions Section -->
        <div class="navbar-actions">
          <!-- Language Selector (Controls BOTH UI and Content Language) -->
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
            </button>
            
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
              <li class="dropdown-header">Language / Langue / Idioma</li>
              
              <li v-for="lang in availableLanguages" :key="lang.code">
                <label class="dropdown-item radio-item">
                  <input 
                    type="radio" 
                    :id="`lang-${lang.code}`"
                    :value="lang.code"
                    :checked="isLanguageSelected(lang.code)"
                    @change="changeLanguage(lang.code)"
                    name="language-selector"
                    class="radio-input"
                  />
                  <span class="radio-label">
                    <span class="lang-name">{{ lang.nativeName }}</span>
                  </span>
                  <i v-if="isLanguageSelected(lang.code)" class="bi bi-check-circle-fill check-icon"></i>
                </label>
              </li>

              <li><hr class="dropdown-divider"></li>
              
              <li class="dropdown-footer">
                <small class="text-muted">
                  <i class="bi bi-info-circle me-1"></i>
                  Changes UI and joke content language
                </small>
              </li>
            </ul>
          </div>

          <!-- Theme Toggle -->
          <ThemeToggle />

          <!-- Mobile Menu Toggle -->
          <button 
            class="btn-mobile-toggle" 
            type="button"
            @click="toggleMobileMenu"
            :class="{ 'active': showMobileMenu }"
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
import { AVAILABLE_LANGUAGES, currentLanguage, t } from '@/i18n';

const store = useStore();

// State
const isScrolled = ref(false);
const showMobileMenu = ref(false);

// Navigation links (with translation keys)
const navLinks = [
  { to: '/', key: 'feed', icon: 'bi bi-grid' },
  { to: '/spotlight', key: 'spotlight', icon: 'bi bi-star' },
  { to: '/videos', key: 'videos', icon: 'bi bi-play-circle' },
  { to: '/blogs', key: 'blog', icon: 'bi bi-journal-text' },
  { to: '/categories', key: 'categories', icon: 'bi bi-folder' },
  { to: '/submit', key: 'submit', icon: 'bi bi-plus-circle' },
  { to: '/about', key: 'about', icon: 'bi bi-info-circle' }
];

// Language Management (Single dropdown controls both UI and content)
const availableLanguages = AVAILABLE_LANGUAGES;

// Get selected language from Vuex store
const selectedLanguage = computed(() => {
  const languages = store.getters['preferences/selectedLanguages'];
  return languages && languages.length > 0 ? languages[0] : 'en';
});

const languageButtonText = computed(() => {
  const names = { en: 'EN', fr: 'FR', es: 'ES', ar: 'AR' };
  return names[selectedLanguage.value] || 'Lang';
});

// Methods
const isLanguageSelected = (lang) => {
  return selectedLanguage.value === lang;
};

/**
 * Change language - updates BOTH UI translations AND joke content
 */
const changeLanguage = (langCode) => {
  // Update Vuex store (for joke content language)
  store.dispatch('preferences/setLanguages', [langCode]);
  
  // The i18n system will automatically sync currentLanguage via store.watch
  // This ensures UI translations update automatically
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
  if (showMobileMenu.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMobileMenu = () => {
  showMobileMenu.value = false;
  document.body.style.overflow = '';
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.body.style.overflow = '';
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
  z-index: 1031; /* Ensure logo stays above menu */
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
    display: flex;
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
  z-index: 1031; /* Ensure actions stay above menu */
  margin-left: auto; /* Push to right side */
}

/* ============================================
   LANGUAGE DROPDOWN - RADIO BUTTON STYLE
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

.dropdown-menu {
  min-width: 260px;
  background: var(--card-bg, white);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  padding: 0.5rem;
  margin-top: 8px !important;
  animation: dropdownSlideIn 0.2s ease-out;
  z-index: 1040; /* Above navbar */
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

/* RADIO BUTTON STYLING */
.radio-item {
  padding: 0.75rem;
}

.radio-input {
  width: 18px;
  height: 18px;
  margin: 0;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid #dee2e6;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  -webkit-appearance: none;
  position: relative;
}

.radio-input::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
  transition: transform 0.2s ease;
}

.radio-input:checked {
  background-color: #667eea;
  border-color: #667eea;
}

.radio-input:checked::before {
  transform: translate(-50%, -50%) scale(1);
}

.radio-input:hover {
  border-color: #667eea;
}

.dark-mode .radio-input {
  background-color: #495057;
  border-color: #6c757d;
}

.dark-mode .radio-input:checked {
  background-color: #667eea;
  border-color: #667eea;
}

.radio-label {
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
  position: relative;
  z-index: 1032; /* Above everything */
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

.btn-mobile-toggle.active .hamburger-line:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.btn-mobile-toggle.active .hamburger-line:nth-child(2) {
  opacity: 0;
  transform: translateX(-10px);
}

.btn-mobile-toggle.active .hamburger-line:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 991px) {
  .navbar-content {
    padding: 0.75rem 0;
    flex-wrap: nowrap; /* Keep items in one row */
    position: relative;
  }

  .navbar-logo {
    height: 32px;
  }

  .brand-name {
    font-size: 1.25rem;
  }

  /* Mobile menu styles */
  .navbar-nav-desktop {
    display: none;
    position: absolute; /* Position absolutely */
    top: 100%; /* Below navbar-content */
    left: 0;
    right: 0;
    width: 100%;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1rem 0;
    background: var(--card-bg, #ffffff); /* Match navbar background */
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    z-index: 1029; /* Below navbar-actions */
  }

  .navbar-nav-desktop.show {
    display: flex;
  }

  .dark-mode .navbar-nav-desktop {
    border-top-color: rgba(255, 255, 255, 0.08);
    background: var(--card-bg, #2c3034); /* Match dark mode navbar background */
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

  /* FIXED: Dropdown positioning on mobile */
  .dropdown-menu {
    position: absolute !important;
    top: 100% !important;
    left: auto !important;
    right: 0 !important;
    transform: none !important;
    margin-top: 0.5rem !important;
    min-width: 280px;
    max-width: calc(100vw - 2rem);
  }
}

@media (max-width: 576px) {
  .navbar-actions {
    gap: 0.5rem;
  }

  .btn-language {
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
  }

  .btn-language i {
    font-size: 1rem;
  }

  /* Ensure dropdown doesn't overflow on small screens */
  .dropdown-menu {
    min-width: 260px;
    max-width: calc(100vw - 1rem);
    right: 0.5rem !important;
  }
  
  .hamburger-line {
    width: 22px;
  }
}

@media (max-width: 375px) {
  .navbar-logo {
    height: 28px;
  }

  .brand-name {
    font-size: 1.125rem;
  }

  .navbar-actions {
    gap: 0.375rem;
  }

  .btn-language {
    padding: 0.5rem 0.625rem;
    font-size: 0.75rem;
  }

  .btn-language i {
    font-size: 0.95rem;
  }
}

/* ============================================
   FIX: Prevent content shift when menu opens
   ============================================ */
.navbar-content {
  min-height: 56px; /* Prevent height jump */
}

@media (max-width: 991px) {
  .navbar-content {
    width: 100%;
    justify-content: space-between;
    min-height: 48px;
  }
}

/* ============================================
   ACCESSIBILITY
   ============================================ */
@media (prefers-reduced-motion: reduce) {
  .navbar,
  .nav-link,
  .btn-language,
  .btn-mobile-toggle,
  .hamburger-line,
  .dropdown-menu {
    transition: none !important;
    animation: none !important;
  }
}
</style>