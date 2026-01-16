<template>
  <div class="card joke-card shadow-sm">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <span :class="`badge bg-${getCategoryColor(joke.category)} category-badge`">
          {{ getCategoryName(joke.category) }}
        </span>
        <span class="badge bg-secondary">{{ getLanguageName(joke.language) }}</span>
      </div>
      
      <!-- UPDATED: Added dynamic direction and lang attributes -->
      <p 
        class="joke-text preserve-whitespace"
        :dir="textDirection"
        :lang="joke.language"
        :class="directionClass"
      >
        {{ joke.text }}
      </p>
      
      <div class="joke-card-footer">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <!-- Author and Stats -->
          <div class="d-flex flex-column flex-sm-row gap-2 align-items-start align-items-sm-center">
            <small class="text-muted">
              👤 By: <strong>{{ getAuthorName(joke.author) }}</strong>
            </small>
            <div class="d-flex gap-3 align-items-center">
              <!-- Like Button -->
              <small 
                class="text-muted like-button" 
                @click.stop="handleLike"
                :class="{ 'liked': hasLiked, 'liking': isLiking }"
                role="button"
                tabindex="0"
              >
                <span class="heart-icon">{{ hasLiked ? '❤️' : '🤍' }}</span>
                {{ localLikes }}
              </small>

              <!-- NEW: Social Share Component -->
              <SocialShare :joke="joke" />

              <!-- Views -->
              <small class="text-muted d-none d-sm-inline">
                👁️ {{ joke.views || 0 }}
              </small>

              <!-- Shares (optional) -->
              <small class="text-muted d-none d-sm-inline" v-if="joke.shares">
                🔗 {{ joke.shares }}
              </small>
            </div>
          </div>

          <!-- View Details Button -->
          <router-link 
            v-if="showLink"
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
  },
  showLink: {
    type: Boolean,
    default: true
  }
});

const store = useStore();
const localLikes = ref(props.joke.likes || 0);
const hasLiked = ref(false);
const isLiking = ref(false);

// Compute text direction based on content
const textDirection = computed(() => getTextDirection(props.joke.text));
const directionClass = computed(() => getDirectionClass(props.joke.text));

onMounted(() => {
  const likedJokes = JSON.parse(localStorage.getItem('likedJokes') || '[]');
  hasLiked.value = likedJokes.includes(props.joke.id);
});

const handleLike = async () => {
  if (hasLiked.value || isLiking.value) {
    return;
  }

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

    // Track analytics
    trackJokeLike(props.joke.id, props.joke.category, props.joke.language);
  } catch (error) {
    console.error('Failed to like joke:', error);
    // Rollback on error
    localLikes.value -= 1;
    hasLiked.value = false;
  } finally {
    isLiking.value = false;
  }
};

const getCategoryName = (slug) => {
  const categories = {
    tech: 'Tech',
    work: 'Work',
    animals: 'Animals',
    food: 'Food',
    general: 'General'
  };
  return categories[slug] || slug;
};

const getCategoryColor = (slug) => {
  const colors = {
    tech: 'primary',
    work: 'success',
    animals: 'warning',
    food: 'danger',
    general: 'info'
  };
  return colors[slug] || 'secondary';
};

const getLanguageName = (code) => {
  const languages = {
    en: 'EN',
    fr: 'FR',
    ar: 'AR'
  };
  return languages[code] || code.toUpperCase();
};

const getAuthorName = (author) => {
  if (!author || !author.name) {
    return 'Anonymous';
  }
  return author.name;
};
</script>

<style scoped>
.joke-card {
  transition: box-shadow 0.3s ease;
}

.joke-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.dark-mode .joke-card:hover {
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.1);
}

.joke-text {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--text-color);
  margin-bottom: 0;
}

/* Preserve whitespace and line breaks */
.preserve-whitespace {
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* UPDATED: Force right alignment for RTL */
.rtl-text.joke-text {
  line-height: 1.8 !important;
  text-align: right !important;
  direction: rtl !important;
}

/* UPDATED: Ensure LTR stays left */
.ltr-text.joke-text {
  text-align: left !important;
  direction: ltr !important;
}

.category-badge {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.joke-card-footer {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.dark-mode .joke-card-footer {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.like-button {
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  font-weight: 500;
}

.like-button:hover:not(.liked) {
  transform: scale(1.1);
  color: #dc3545 !important;
}

.like-button.liked {
  color: #dc3545 !important;
  font-weight: 600;
  cursor: default;
}

.like-button.liking {
  opacity: 0.6;
  cursor: wait;
}

.heart-icon {
  display: inline-block;
  transition: transform 0.3s ease;
}

.like-button:hover:not(.liked) .heart-icon {
  transform: scale(1.2);
}

.like-button:active:not(.liked) .heart-icon {
  transform: scale(0.9);
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .joke-card-footer .d-flex {
    flex-direction: column;
    align-items: flex-start !important;
  }

  .joke-card-footer .btn-outline-primary {
    margin-top: 0.5rem;
    width: 100%;
  }
}
</style>