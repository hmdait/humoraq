<template>
  <div class="social-share">
    <!-- Share Button -->
    <button
      class="btn btn-sm btn-outline-secondary share-btn"
      type="button"
      :id="`shareDropdown-${joke.id}`"
      data-bs-toggle="dropdown"
      data-bs-auto-close="true"
      aria-expanded="false"
      @click.stop
    >
      <i class="bi bi-share"></i>
      <span class="d-none d-sm-inline ms-1">Share</span>
    </button>

    <!-- Dropdown Menu -->
    <ul class="dropdown-menu dropdown-menu-end share-dropdown" :aria-labelledby="`shareDropdown-${joke.id}`">
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

    <!-- Success Toast -->
    <div v-if="showToast" class="position-fixed top-0 end-0 p-3" style="z-index: 9999">
      <div class="toast show" role="alert">
        <div class="toast-body d-flex align-items-center">
          <i class="bi bi-check-circle-fill text-success me-2"></i>
          {{ toastMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
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

// Copy link to clipboard
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(jokeUrl.value);
    displayToast('Link copied to clipboard!');
    trackShare();
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
};

// Share to WhatsApp
const shareToWhatsApp = () => {
  const text = encodeURIComponent(`${jokePreview.value} ${jokeUrl.value}`);
  window.open(
    `https://wa.me/?text=${text}`,
    '_blank'
  );
  trackShare();
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
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error sharing:', error);
    }
  }
};
</script>

<style scoped>
.social-share {
  position: relative;
}

.share-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.share-btn:hover {
  background-color: rgba(13, 110, 253, 0.1);
  border-color: #0d6efd;
  color: #0d6efd;
}

.share-btn i {
  font-size: 1rem;
}

.share-dropdown {
  min-width: 200px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 0.5rem 0;
}

.share-dropdown .dropdown-item {
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.share-dropdown .dropdown-item i {
  font-size: 1.1rem;
  width: 20px;
}

.share-dropdown .dropdown-item:hover {
  background-color: rgba(13, 110, 253, 0.08);
}

.toast {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast-body {
  padding: 0.75rem 1rem;
}

/* Dark mode */
.dark-mode .share-btn {
  border-color: #495057;
  color: var(--text-color);
}

.dark-mode .share-btn:hover {
  background-color: rgba(13, 110, 253, 0.2);
  border-color: #0d6efd;
}

.dark-mode .share-dropdown {
  background-color: #2c3034;
  border-color: #495057;
}

.dark-mode .share-dropdown .dropdown-item {
  color: #f8f9fa;
}

.dark-mode .share-dropdown .dropdown-item:hover {
  background-color: rgba(13, 110, 253, 0.15);
}

.dark-mode .toast {
  background-color: #2c3034;
  color: #f8f9fa;
}
</style>