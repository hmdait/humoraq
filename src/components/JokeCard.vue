<template>
  <div class="joke-card" @click="handleCardClick">
    <!-- Header -->
    <div class="joke-card-header">
      <div class="author-section">
        <div class="avatar">
          {{ getAuthorInitial(joke.author) }}
        </div>
        <div class="author-info">
          <div class="author-name">{{ getAuthorName(joke.author) }}</div>
          <div class="post-meta">
            <span class="meta-item">{{ formatDate(joke.createdAt) }}</span>
            <span class="meta-separator">·</span>
            <span class="meta-item lang-badge">{{ getLanguageName(joke.language) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Categories Badges -->
      <div class="categories-section">
        <span 
          v-for="cat in getJokeCategories(joke)" 
          :key="cat"
          :class="`category-pill category-${getCategoryColor(cat)}`"
          :title="getCategoryLabel(cat)"
        >
          <i :class="['bi', getCategoryIcon(cat)]"></i>
        </span>
      </div>
    </div>

    <!-- Joke Content -->
    <div class="joke-content">
      <p 
        class="joke-text preserve-whitespace"
        :dir="textDirection"
        :lang="joke.language"
        :class="directionClass"
      >
        {{ joke.text }}
      </p>
    </div>

    <!-- Engagement Bar -->
    <div class="engagement-bar">
      <!-- Like Button -->
      <button 
        class="engagement-btn" 
        :class="{ 'engaged': hasLiked, 'engaging': isLiking }"
        @click.stop="handleLike"
        :disabled="isLiking"
        :aria-label="`${hasLiked ? 'Unlike' : 'Like'} this joke`"
      >
        <i :class="hasLiked ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
        <span class="engagement-count" v-if="localLikes > 0">{{ formatCount(localLikes) }}</span>
      </button>

      <!-- Share Button -->
      <div class="engagement-btn-wrapper" @click.stop>
        <SocialShare :joke="joke" />
      </div>

      <!-- Views -->
      <div class="engagement-stat">
        <i class="bi bi-eye"></i>
        <span class="engagement-count">{{ formatCount(joke.views || 0) }}</span>
      </div>

      <!-- Shares (optional) -->
      <div v-if="joke.shares && joke.shares > 0" class="engagement-stat d-none d-sm-flex">
        <i class="bi bi-arrow-repeat"></i>
        <span class="engagement-count">{{ formatCount(joke.shares) }}</span>
      </div>

      <!-- View Details (Desktop) -->
      <router-link 
        v-if="showLink"
        :to="`/joke/${joke.id}`" 
        class="btn-view-details ms-auto"
        @click.stop
      >
        Read more
        <i class="bi bi-arrow-right-short"></i>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { getCategoryLabel, getCategoryColor, getCategoryIcon } from '@/config/categories';
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

const router = useRouter();
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

const handleCardClick = () => {
  if (props.showLink) {
    router.push(`/joke/${props.joke.id}`);
  }
};

const getJokeCategories = (joke) => {
  if (Array.isArray(joke.categories)) return joke.categories;
  if (joke.category) return [joke.category];
  return ['General'];
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

const getAuthorInitial = (author) => {
  const name = getAuthorName(author);
  return name.charAt(0).toUpperCase();
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
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatCount = (count) => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
  return count;
};
</script>

<style scoped>
/* ============================================
   CARD CONTAINER - X-style minimal design
   ============================================ */
.joke-card {
  background: var(--card-bg, #ffffff);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 0;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
}

.joke-card:hover {
  background: rgba(0, 0, 0, 0.02);
}

.dark-mode .joke-card {
  background: var(--card-bg, #000000);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .joke-card:hover {
  background: rgba(255, 255, 255, 0.03);
}

/* ============================================
   HEADER SECTION
   ============================================ */
.joke-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.author-section {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.joke-card:hover .avatar {
  transform: scale(1.05);
}

.author-info {
  flex: 1;
  min-width: 0;
}

.author-name {
  font-weight: 700;
  font-size: 0.9375rem;
  color: var(--text-color, #0f1419);
  margin-bottom: 0.125rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: #536471;
}

.dark-mode .post-meta {
  color: #71767b;
}

.meta-item {
  white-space: nowrap;
}

.meta-separator {
  color: #536471;
  font-weight: 300;
}

.lang-badge {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
}

/* ============================================
   CATEGORIES SECTION
   ============================================ */
.categories-section {
  display: flex;
  gap: 0.375rem;
  flex-shrink: 0;
  flex-wrap: wrap;
  max-width: 120px;
  justify-content: flex-end;
}

.category-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 0.875rem;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.category-pill:hover {
  transform: scale(1.1);
}

/* Category colors */
.category-primary { background: rgba(13, 110, 253, 0.1); color: #0d6efd; }
.category-success { background: rgba(25, 135, 84, 0.1); color: #198754; }
.category-danger { background: rgba(220, 53, 69, 0.1); color: #dc3545; }
.category-warning { background: rgba(255, 193, 7, 0.1); color: #ffc107; }
.category-info { background: rgba(13, 202, 240, 0.1); color: #0dcaf0; }
.category-secondary { background: rgba(108, 117, 125, 0.1); color: #6c757d; }
.category-dark { background: rgba(33, 37, 41, 0.1); color: #212529; }

.dark-mode .category-primary { background: rgba(13, 110, 253, 0.2); color: #6ea8fe; }
.dark-mode .category-success { background: rgba(25, 135, 84, 0.2); color: #75b798; }
.dark-mode .category-danger { background: rgba(220, 53, 69, 0.2); color: #ea868f; }
.dark-mode .category-warning { background: rgba(255, 193, 7, 0.2); color: #ffc107; }
.dark-mode .category-info { background: rgba(13, 202, 240, 0.2); color: #6edff6; }
.dark-mode .category-secondary { background: rgba(108, 117, 125, 0.2); color: #adb5bd; }
.dark-mode .category-dark { background: rgba(255, 255, 255, 0.2); color: #f8f9fa; }

/* ============================================
   JOKE CONTENT
   ============================================ */
.joke-content {
  margin-bottom: 0.75rem;
}

.joke-text {
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--text-color, #0f1419);
  margin: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.dark-mode .joke-text {
  color: var(--text-color, #e7e9ea);
}

.preserve-whitespace {
  white-space: pre-wrap;
}

/* RTL Support */
.rtl-text.joke-text {
  line-height: 1.7 !important;
  text-align: right !important;
  direction: rtl !important;
}

.ltr-text.joke-text {
  text-align: left !important;
  direction: ltr !important;
}

/* ============================================
   ENGAGEMENT BAR
   ============================================ */
.engagement-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 0.5rem;
  max-width: 425px;
}

.engagement-btn,
.engagement-stat {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0;
  background: transparent;
  border: none;
  color: #536471;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: color 0.2s ease;
  user-select: none;
}

.engagement-btn {
  font-weight: 500;
}

.engagement-btn i {
  font-size: 1.125rem;
  transition: transform 0.2s ease;
}

.engagement-btn:hover {
  color: #f91880;
}

.engagement-btn:hover i {
  transform: scale(1.1);
}

.engagement-btn:active i {
  transform: scale(0.95);
}

/* Like button specific */
.engagement-btn.engaged {
  color: #f91880;
}

.engagement-btn.engaged i {
  animation: likeAnimation 0.4s ease;
}

.engagement-btn.engaging {
  opacity: 0.6;
  cursor: wait;
}

@keyframes likeAnimation {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.2); }
  50% { transform: scale(0.95); }
  75% { transform: scale(1.05); }
}

.engagement-count {
  font-size: 0.8125rem;
  font-weight: 500;
  min-width: 20px;
  text-align: left;
}

.engagement-stat {
  color: #536471;
  cursor: default;
  font-weight: 500;
}

.dark-mode .engagement-btn,
.dark-mode .engagement-stat {
  color: #71767b;
}

.dark-mode .engagement-btn:hover {
  color: #f91880;
}

.dark-mode .engagement-btn.engaged {
  color: #f91880;
}

/* ============================================
   VIEW DETAILS BUTTON
   ============================================ */
.btn-view-details {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1d9bf0;
  text-decoration: none;
  border-radius: 9999px;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.btn-view-details:hover {
  background: rgba(29, 155, 240, 0.1);
  color: #1d9bf0;
}

.btn-view-details i {
  font-size: 1.25rem;
  transition: transform 0.2s ease;
}

.btn-view-details:hover i {
  transform: translateX(2px);
}

/* ============================================
   SOCIAL SHARE WRAPPER
   ============================================ */
.engagement-btn-wrapper {
  display: inline-flex;
}

/* Override SocialShare button to match engagement style */
.engagement-btn-wrapper :deep(.share-btn) {
  padding: 0;
  border: none;
  background: transparent;
  color: #536471;
  font-size: 0.8125rem;
  gap: 0.375rem;
  border-radius: 0;
}

.engagement-btn-wrapper :deep(.share-btn i) {
  font-size: 1.125rem;
}

.engagement-btn-wrapper :deep(.share-btn:hover) {
  background: transparent;
  color: #00ba7c;
  border: none;
  transform: none;
  box-shadow: none;
}

.engagement-btn-wrapper :deep(.share-btn:hover i) {
  transform: scale(1.1);
}

.dark-mode .engagement-btn-wrapper :deep(.share-btn) {
  color: #71767b;
}

.dark-mode .engagement-btn-wrapper :deep(.share-btn:hover) {
  color: #00ba7c;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */
@media (max-width: 576px) {
  .joke-card {
    padding: 0.875rem 1rem;
  }

  .avatar {
    width: 36px;
    height: 36px;
    font-size: 0.875rem;
  }

  .author-name {
    font-size: 0.875rem;
  }

  .post-meta {
    font-size: 0.75rem;
  }

  .joke-text {
    font-size: 0.875rem;
  }

  .categories-section {
    max-width: 100px;
  }

  .category-pill {
    width: 28px;
    height: 28px;
    font-size: 0.8125rem;
  }

  .engagement-bar {
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .engagement-btn,
  .engagement-stat {
    font-size: 0.75rem;
  }

  .engagement-btn i,
  .engagement-stat i {
    font-size: 1rem;
  }

  .btn-view-details {
    display: none;
  }
}

@media (max-width: 375px) {
  .engagement-bar {
    max-width: 100%;
  }

  .engagement-count {
    font-size: 0.75rem;
  }

  /* Show only engaged like count on very small screens */
  .engagement-stat .engagement-count {
    display: none;
  }

  .engagement-btn.engaged .engagement-count {
    display: inline;
  }
}
</style>