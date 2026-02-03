<template>
  <div class="social-share" ref="shareContainer">
    <!-- Share Button -->
    <button
      class="btn btn-sm btn-outline-secondary share-btn"
      type="button"
      @click.stop="handleShareClick"
      ref="shareButton"
      :aria-expanded="isDropdownOpen"
      aria-haspopup="true"
    >
      <i class="bi bi-share"></i>
      <span class="d-none d-sm-inline ms-1">Share</span>
    </button>

    <!-- Dropdown Menu - Using Teleport to avoid parent overflow issues -->
    <!-- FIXED: Only render when dropdown is actually open to prevent extra space -->
    <Teleport to="body">
      <div 
        v-if="isMounted && isDropdownOpen"
        class="share-dropdown-wrapper show"
        :style="dropdownStyles"
        ref="dropdownMenu"
        @click.stop
      >
        <ul class="share-dropdown-menu">
          <li>
            <button class="dropdown-item" @click.stop="copyLink">
              <i class="bi bi-link-45deg me-2"></i>
              Copy Link
            </button>
          </li>
          <li><hr class="dropdown-divider"></li>
          <li>
            <button class="dropdown-item" @click.stop="shareToTwitter">
              <i class="bi bi-twitter-x me-2"></i>
              Share on X (Twitter)
            </button>
          </li>
          <li>
            <button class="dropdown-item" @click.stop="shareToFacebook">
              <i class="bi bi-facebook me-2"></i>
              Share on Facebook
            </button>
          </li>
          <li>
            <button class="dropdown-item" @click.stop="shareToWhatsApp">
              <i class="bi bi-whatsapp me-2"></i>
              Share on WhatsApp
            </button>
          </li>
          <li v-if="canUseNativeShare">
            <hr class="dropdown-divider">
          </li>
          <li v-if="canUseNativeShare">
            <button class="dropdown-item" @click.stop="nativeShare">
              <i class="bi bi-three-dots me-2"></i>
              More Options
            </button>
          </li>
        </ul>
      </div>
    </Teleport>

    <!-- Success Toast -->
    <Teleport to="body">
      <div v-if="showToast" class="share-toast-container">
        <div class="toast show" role="alert">
          <div class="toast-body d-flex align-items-center">
            <i class="bi bi-check-circle-fill text-success me-2"></i>
            {{ toastMessage }}
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useStore } from 'vuex';
import { getJokeUrl } from '@/utils/jokeUrlHelper';

const props = defineProps({
  joke: {
    type: Object,
    required: true
  }
});

const store = useStore();
const showToast = ref(false);
const toastMessage = ref('');
const isDropdownOpen = ref(false);
const shareButton = ref(null);
const dropdownMenu = ref(null);
const shareContainer = ref(null);
const isMounted = ref(false);
const dropdownStyles = ref({});

// Check if native share is available (mobile devices)
const canUseNativeShare = computed(() => {
  return navigator.share !== undefined;
});

// Generate joke URL
const jokeUrl = computed(() => {
  return `${window.location.origin}${getJokeUrl(props.joke)}`;
});

// Get joke text preview (first 100 chars)
const jokePreview = computed(() => {
  const text = props.joke.text || props.joke.title || 'Check out this funny joke!';
  return text.length > 100 ? text.substring(0, 100) + '...' : text;
});

// Show temporary toast
const displayToast = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 2000);
};

// Track share and update updatedAt
const trackShare = async () => {
  try {
    await store.dispatch('jokes/trackInteraction', {
      jokeId: props.joke.id,
      interactionType: 'share'
    });
  } catch (error) {
    console.error('Error tracking share:', error);
  }
};

// Get accurate dropdown dimensions
const getDropdownDimensions = async () => {
  // Return default dimensions since dropdown is not yet rendered
  return { width: 200, height: 250 };
};

// Calculate optimal dropdown position
const calculateDropdownPosition = async () => {
  if (!shareButton.value) return {};
  
  const button = shareButton.value;
  const buttonRect = button.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Get dropdown dimensions
  const { width: menuWidth, height: menuHeight } = await getDropdownDimensions();
  
  // Constants
  const gap = 8;
  const edgePadding = 16;
  
  // Check if we're on mobile
  const isMobile = viewportWidth <= 576;
  
  if (isMobile) {
    // Mobile: Fixed at bottom, centered, full width
    return {
      position: 'fixed',
      bottom: '1rem',
      left: '50%',
      right: 'auto',
      top: 'auto',
      transform: 'translateX(-50%)',
      width: `calc(100vw - 2rem)`,
      maxWidth: '400px',
      zIndex: '9998'
    };
  }
  
  // Desktop positioning logic
  let styles = {
    position: 'fixed',
    zIndex: '9998'
  };
  
  // Vertical positioning
  const spaceBelow = viewportHeight - buttonRect.bottom - gap;
  const spaceAbove = buttonRect.top - gap;
  
  if (spaceBelow >= menuHeight) {
    styles.top = `${buttonRect.bottom + gap}px`;
  } else if (spaceAbove >= menuHeight) {
    styles.bottom = `${viewportHeight - buttonRect.top + gap}px`;
  } else {
    if (spaceBelow > spaceAbove) {
      styles.top = `${buttonRect.bottom + gap}px`;
      styles.maxHeight = `${spaceBelow - edgePadding}px`;
    } else {
      styles.bottom = `${viewportHeight - buttonRect.top + gap}px`;
      styles.maxHeight = `${spaceAbove - edgePadding}px`;
    }
    styles.overflowY = 'auto';
  }
  
  // Horizontal positioning
  if (buttonRect.right + menuWidth <= viewportWidth - edgePadding) {
    styles.left = `${buttonRect.left}px`;
  } else if (buttonRect.right - menuWidth >= edgePadding) {
    styles.left = `${buttonRect.right - menuWidth}px`;
  } else {
    styles.right = `${viewportWidth - buttonRect.right}px`;
    styles.maxWidth = `${buttonRect.left - edgePadding}px`;
  }
  
  return styles;
};

// Handle share button click
const handleShareClick = async (event) => {
  event.stopPropagation();
  
  if (isDropdownOpen.value) {
    // Close dropdown
    isDropdownOpen.value = false;
    dropdownStyles.value = {};
  } else {
    // Open dropdown
    isDropdownOpen.value = true;
    await nextTick();
    dropdownStyles.value = await calculateDropdownPosition();
  }
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!shareContainer.value || !dropdownMenu.value) return;
  
  const clickedButton = shareButton.value && shareButton.value.contains(event.target);
  const clickedDropdown = dropdownMenu.value && dropdownMenu.value.contains(event.target);
  
  if (!clickedButton && !clickedDropdown && isDropdownOpen.value) {
    isDropdownOpen.value = false;
    dropdownStyles.value = {};
  }
};

// Handle window resize and scroll
const handlePositionUpdate = async () => {
  if (isDropdownOpen.value) {
    dropdownStyles.value = await calculateDropdownPosition();
  }
};

// Debounce function for performance
let resizeTimeout;
const debouncedPositionUpdate = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(handlePositionUpdate, 100);
};

// Copy link to clipboard
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(jokeUrl.value);
    displayToast('Link copied to clipboard!');
    trackShare();
    isDropdownOpen.value = false;
    dropdownStyles.value = {};
  } catch (error) {
    console.error('Failed to copy link:', error);
    displayToast('Failed to copy link');
  }
};

// Share to Twitter/X
const shareToTwitter = () => {
  const text = encodeURIComponent(jokePreview.value);
  const url = encodeURIComponent(jokeUrl.value);
  window.open(
    `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    '_blank',
    'width=550,height=420'
  );
  trackShare();
  isDropdownOpen.value = false;
  dropdownStyles.value = {};
};

// Share to Facebook
const shareToFacebook = () => {
  const url = encodeURIComponent(jokeUrl.value);
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    '_blank',
    'width=550,height=420'
  );
  trackShare();
  isDropdownOpen.value = false;
  dropdownStyles.value = {};
};

// Share to WhatsApp
const shareToWhatsApp = () => {
  const text = encodeURIComponent(`${jokePreview.value} ${jokeUrl.value}`);
  window.open(
    `https://wa.me/?text=${text}`,
    '_blank'
  );
  trackShare();
  isDropdownOpen.value = false;
  dropdownStyles.value = {};
};

// Native share (mobile)
const nativeShare = async () => {
  try {
    await navigator.share({
      title: 'Humoraq Joke',
      text: jokePreview.value,
      url: jokeUrl.value
    });
    trackShare();
    isDropdownOpen.value = false;
    dropdownStyles.value = {};
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error sharing:', error);
    }
  }
};

// Close dropdown on escape key
const handleEscape = (event) => {
  if (event.key === 'Escape' && isDropdownOpen.value) {
    isDropdownOpen.value = false;
    dropdownStyles.value = {};
    shareButton.value?.focus();
  }
};

onMounted(() => {
  isMounted.value = true;
  
  // Add event listeners
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('touchstart', handleClickOutside, { passive: true });
  document.addEventListener('keydown', handleEscape);
  window.addEventListener('resize', debouncedPositionUpdate);
  window.addEventListener('scroll', handlePositionUpdate, { passive: true });
  window.addEventListener('orientationchange', handlePositionUpdate);
});

onUnmounted(() => {
  // Remove event listeners
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('touchstart', handleClickOutside);
  document.removeEventListener('keydown', handleEscape);
  window.removeEventListener('resize', debouncedPositionUpdate);
  window.removeEventListener('scroll', handlePositionUpdate);
  window.removeEventListener('orientationchange', handlePositionUpdate);
  
  // Clear timeout
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
});
</script>

<style scoped>
.social-share {
  position: relative;
  display: inline-block;
}

.share-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: var(--text-color, #536471);
  cursor: pointer;
  user-select: none;
  min-width: 44px;
  min-height: 44px;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

.share-btn:active {
  transform: scale(0.95);
  background-color: rgba(13, 110, 253, 0.1);
}

.share-btn:hover {
  background-color: rgba(13, 110, 253, 0.1);
  border-color: #0d6efd;
  color: #0d6efd;
}

.share-btn i {
  font-size: 1rem;
  transition: transform 0.2s ease;
}

.share-btn:hover i {
  transform: rotate(15deg);
}

/* Dropdown wrapper */
.share-dropdown-wrapper {
  min-width: 200px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: var(--card-bg, #fff);
  border: 1px solid rgba(0, 0, 0, 0.08);
  user-select: none;
  -webkit-user-select: none;
  /* Animation for show state */
  animation: dropdownFadeIn 0.15s ease;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.share-dropdown-menu {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
}

.share-dropdown-menu .dropdown-item {
  padding: 0.625rem 1rem;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  transition: background-color 0.15s ease;
  color: var(--text-color, #333);
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  min-height: 44px;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  user-select: none;
}

.share-dropdown-menu .dropdown-item i {
  font-size: 1.1rem;
  width: 20px;
  flex-shrink: 0;
}

.share-dropdown-menu .dropdown-item:hover,
.share-dropdown-menu .dropdown-item:active {
  background-color: rgba(13, 110, 253, 0.08);
}

.share-dropdown-menu .dropdown-divider {
  margin: 0.5rem 0;
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

/* Toast container */
.share-toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  pointer-events: none;
}

.toast {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: var(--card-bg, #fff);
  border: 1px solid rgba(0, 0, 0, 0.08);
  animation: slideInRight 0.3s ease;
  pointer-events: auto;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toast-body {
  padding: 0.75rem 1rem;
  color: var(--text-color, #333);
}

/* Dark mode */
.dark-mode .share-btn {
  border-color: #495057;
  color: var(--text-color, #adb5bd);
  background: transparent;
}

.dark-mode .share-btn:hover {
  background-color: rgba(13, 110, 253, 0.2);
  border-color: #0d6efd;
  color: #6ea8fe;
}

.dark-mode .share-btn:active {
  background-color: rgba(13, 110, 253, 0.25);
}

.dark-mode .share-dropdown-wrapper {
  background-color: #2c3034;
  border-color: #495057;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.dark-mode .share-dropdown-menu .dropdown-item {
  color: #f8f9fa;
}

.dark-mode .share-dropdown-menu .dropdown-item:hover,
.dark-mode .share-dropdown-menu .dropdown-item:active {
  background-color: rgba(13, 110, 253, 0.15);
}

.dark-mode .share-dropdown-menu .dropdown-divider {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .toast {
  background-color: #2c3034;
  color: #f8f9fa;
  border-color: #495057;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .share-btn,
  .share-dropdown-wrapper,
  .toast {
    transition: none !important;
    animation: none !important;
  }
}

/* Mobile responsive adjustments */
@media (max-width: 576px) {
  .share-dropdown-wrapper {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
  
  .dark-mode .share-dropdown-wrapper {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  }
}
</style>