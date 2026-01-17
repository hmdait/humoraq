<template>
  <div class="card feed-post mb-4 shadow-sm">
    <div class="card-body">
      <!-- Header -->
      <div class="feed-post-header mb-3">
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <div class="avatar-circle me-3">
              {{ getAuthorInitial(joke.author) }}
            </div>
            <div>
              <h6 class="mb-0 fw-bold">{{ getAuthorName(joke.author) }}</h6>
              <small class="text-muted">
                {{ formatDate(joke.createdAt) }}
                <span class="mx-1">•</span>
                <!-- UPDATED: Display all categories as badges -->
                <span 
                  v-for="(category, index) in jokeCategories" 
                  :key="category"
                  :class="`badge bg-${getCategoryColor(category)} badge-sm me-1`"
                >
                  {{ category }}
                </span>
                <span class="mx-1">•</span>
                <span class="badge bg-secondary badge-sm">
                  {{ getLanguageName(joke.language) }}
                </span>
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Title (if exists) -->
      <h5 
        v-if="joke.title" 
        class="feed-post-title mb-2"
        :dir="titleDirection"
        :class="titleDirectionClass"
      >
        {{ joke.title }}
      </h5>

      <!-- Joke Text -->
      <p 
        class="feed-post-text mb-3 preserve-whitespace"
        :dir="textDirection"
        :lang="joke.language"
        :class="directionClass"
      >
        {{ joke.text }}
      </p>

      <!-- Footer with stats and actions -->
      <div class="feed-post-footer">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div class="d-flex gap-3 align-items-center">
            <!-- Like Button -->
            <button 
              class="btn btn-sm btn-link text-decoration-none p-0 like-btn"
              :class="{ 'liked': hasLiked }"
              @click.stop="handleLike"
              :disabled="isLiking"
            >
              <span class="heart-icon">{{ hasLiked ? '❤️' : '🤍' }}</span>
              <span class="ms-1">{{ localLikes }}</span>
            </button>

            <!-- Social Share Component -->
            <SocialShare :joke="joke" />

            <!-- Views Count -->
            <span class="text-muted d-none d-sm-inline">
              <small>👁️ {{ joke.views || 0 }}</small>
            </span>

            <!-- Shares Count (optional) -->
            <span class="text-muted d-none d-sm-inline" v-if="joke.shares">
              <small>🔗 {{ joke.shares }}</small>
            </span>
          </div>
          
          <!-- View Details Button -->
          <router-link 
            :to="`/joke/${joke.id}`" 
            class="btn btn-sm btn-outline-primary"
          >
            View Details
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { likeJoke } from '../services/jokeService';
import { trackJokeLike } from '../services/analyticsService';
import { getTextDirection, getDirectionClass } from '../utils/rtl';
import SocialShare from './SocialShare.vue';

const props = defineProps({
  joke: {
    type: Object,
    required: true
  }
});

const store = useStore();
const localLikes = ref(props.joke.likes || 0);
const hasLiked = ref(false);
const isLiking = ref(false);

// UPDATED: Support both old (category) and new (categories) formats
const jokeCategories = computed(() => {
  // If joke has categories array, use it
  if (props.joke.categories && Array.isArray(props.joke.categories)) {
    return props.joke.categories;
  }
  // Fallback to old single category format
  if (props.joke.category) {
    return [props.joke.category];
  }
  // Default fallback
  return ['General'];
});

// Compute text direction based on content
const textDirection = computed(() => getTextDirection(props.joke.text));
const directionClass = computed(() => getDirectionClass(props.joke.text));

const titleDirection = computed(() => 
  props.joke.title ? getTextDirection(props.joke.title) : 'ltr'
);
const titleDirectionClass = computed(() => 
  props.joke.title ? getDirectionClass(props.joke.title) : 'ltr-text'
);

onMounted(() => {
  const likedJokes = JSON.parse(localStorage.getItem('likedJokes') || '[]');
  hasLiked.value = likedJokes.includes(props.joke.id);
});

const handleLike = async () => {
  if (hasLiked.value || isLiking.value) return;

  isLiking.value = true;

  try {
    // Optimistic UI update
    localLikes.value += 1;
    hasLiked.value = true;

    // Track interaction in Firestore (updates updatedAt)
    await store.dispatch('jokes/trackInteraction', {
      jokeId: props.joke.id,
      interactionType: 'like'
    });

    // Mark as liked in localStorage
    const likedJokes = JSON.parse(localStorage.getItem('likedJokes') || '[]');
    likedJokes.push(props.joke.id);
    localStorage.setItem('likedJokes', JSON.stringify(likedJokes));

    // Track analytics - use first category
    trackJokeLike(props.joke.id, jokeCategories.value[0], props.joke.language);
  } catch (error) {
    console.error('Failed to like joke:', error);
    // Rollback on error
    localLikes.value -= 1;
    hasLiked.value = false;
  } finally {
    isLiking.value = false;
  }
};

const getAuthorName = (author) => {
  if (!author || !author.name) return 'Anonymous';
  return author.name;
};

const getAuthorInitial = (author) => {
  const name = getAuthorName(author);
  return name.charAt(0).toUpperCase();
};

/**
 * UPDATED: Get color for category
 */
const getCategoryColor = (category) => {
  const colorMap = {
    'General': 'info',
    'Relationships': 'danger',
    'Family': 'success',
    'Work': 'primary',
    'School': 'warning',
    'Friends': 'info',
    'Adult': 'dark',
    'Animals': 'warning',
    'Food': 'danger',
    'Tech': 'primary',
    'Sports': 'success',
    'Old People': 'secondary',
    'Women': 'danger',
    'Men': 'primary'
  };
  return colorMap[category] || 'secondary';
};

const getLanguageName = (code) => {
  const languages = {
    en: 'EN',
    fr: 'FR',
    ar: 'AR'
  };
  return languages[code] || code.toUpperCase();
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'Just now';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};
</script>

<style scoped>
.feed-post {
  transition: box-shadow 0.3s ease;
}

.feed-post:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.dark-mode .feed-post:hover {
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.05);
}

.avatar-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.25rem;
}

.feed-post-title {
  color: var(--text-color);
  font-weight: 600;
}

.rtl-text.feed-post-title {
  text-align: right !important;
  direction: rtl !important;
}

.ltr-text.feed-post-title {
  text-align: left !important;
  direction: ltr !important;
}

.feed-post-text {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-color);
}

.rtl-text.feed-post-text {
  line-height: 1.8 !important;
  text-align: right !important;
  direction: rtl !important;
}

.ltr-text.feed-post-text {
  text-align: left !important;
  direction: ltr !important;
}

.preserve-whitespace {
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* UPDATED: Badge styling for multiple categories */
.badge-sm {
  font-size: 0.7rem;
  padding: 0.25em 0.5em;
  text-transform: capitalize;
}

.feed-post-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 0.75rem;
  margin-top: 0.5rem;
}

.dark-mode .feed-post-footer {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.like-btn {
  color: #6c757d;
  transition: all 0.2s ease;
  font-weight: 500;
}

.like-btn:hover:not(.liked) {
  color: #dc3545;
  transform: scale(1.05);
}

.like-btn.liked {
  color: #dc3545;
}

.like-btn:disabled {
  opacity: 0.6;
  cursor: wait;
}

.heart-icon {
  font-size: 1.1rem;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .feed-post-footer .d-flex {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 0.75rem;
  }

  .feed-post-footer .d-flex > div:first-child {
    width: 100%;
  }

  .feed-post-footer .btn-outline-primary {
    width: 100%;
  }

  .badge-sm {
    font-size: 0.65rem;
  }
}
</style>