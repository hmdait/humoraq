<template>
  <div class="joke-card-modern" @click="handleCardClick">
    <!-- Decorative gradient overlay -->
    <div class="card-gradient"></div>
    
    <!-- Header -->
    <div class="joke-card-header">
      <div class="author-section">
        <div class="avatar">
          <span class="avatar-text">{{ getAuthorInitial(joke.author) }}</span>
          <span class="avatar-glow"></span>
        </div>
        <div class="author-info">
          <div class="author-name">{{ getAuthorName(joke.author) }}</div>
          <div class="post-meta">
            <span class="meta-item">
              <i class="bi bi-clock"></i>
              {{ formatDate(joke.createdAt) }}
            </span>
            <span class="meta-separator">•</span>
            <span class="meta-item lang-badge">
              <i class="bi bi-translate"></i>
              {{ getLanguageName(joke.language) }}
            </span>
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
        class="engagement-btn like-btn" 
        :class="{ 'engaged': hasLiked, 'engaging': isLiking }"
        @click.stop="handleLike"
        :disabled="isLiking"
        :aria-label="`${hasLiked ? 'Unlike' : 'Like'} this joke`"
      >
        <span class="btn-icon">
          <i :class="hasLiked ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
        </span>
        <span class="engagement-count" v-if="localLikes > 0">{{ formatCount(localLikes) }}</span>
        <span class="btn-ripple"></span>
      </button>

      <!-- Share Button -->
      <div class="engagement-btn-wrapper" @click.stop>
        <SocialShare :joke="joke" />
      </div>

      <!-- Views -->
      <div class="engagement-stat views-stat">
        <i class="bi bi-eye"></i>
        <span class="engagement-count">{{ formatCount(joke.views || 0) }}</span>
      </div>

      <!-- Shares (optional) -->
      <div v-if="joke.shares && joke.shares > 0" class="engagement-stat">
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
        <span>Read more</span>
        <i class="bi bi-arrow-right"></i>
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
import { getJokeUrl } from '@/utils/jokeUrlHelper';

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
    router.push(getJokeUrl(props.joke));
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
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
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
   MODERN CARD CONTAINER
   ============================================ */
.joke-card-modern {
  position: relative;
  background: var(--card-bg, #ffffff);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  padding: 1.75rem;
  margin-bottom: 1.5rem;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 2px 12px rgba(0, 0, 0, 0.04),
    0 1px 3px rgba(0, 0, 0, 0.03);
}

.joke-card-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.joke-card-modern:hover {
  transform: translateY(-6px);
  box-shadow: 
    0 12px 32px rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.05);
  border-color: rgba(102, 126, 234, 0.15);
}

.joke-card-modern:hover::before {
  opacity: 1;
}

/* Decorative gradient overlay */
.card-gradient {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(102, 126, 234, 0.03) 0%,
    transparent 50%
  );
  pointer-events: none;
  transition: opacity 0.4s ease;
  opacity: 0;
}

.joke-card-modern:hover .card-gradient {
  opacity: 1;
}

.dark-mode .joke-card-modern {
  background: var(--card-bg, #1c2024);
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow: 
    0 2px 12px rgba(0, 0, 0, 0.2),
    0 1px 3px rgba(0, 0, 0, 0.15);
}

.dark-mode .joke-card-modern:hover {
  box-shadow: 
    0 12px 32px rgba(0, 0, 0, 0.4),
    0 4px 12px rgba(0, 0, 0, 0.25);
  border-color: rgba(102, 126, 234, 0.25);
}

/* ============================================
   HEADER SECTION
   ============================================ */
.joke-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.author-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.avatar {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
}

.avatar-text {
  font-weight: 700;
  font-size: 1.125rem;
  position: relative;
  z-index: 2;
}

.avatar-glow {
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  filter: blur(8px);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.joke-card-modern:hover .avatar {
  transform: scale(1.08) rotate(5deg);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.35);
}

.joke-card-modern:hover .avatar-glow {
  opacity: 0.6;
}

.author-info {
  flex: 1;
  min-width: 0;
}

.author-name {
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-color, #0f1419);
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6c757d;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.meta-item i {
  font-size: 0.875rem;
  opacity: 0.7;
}

.meta-separator {
  opacity: 0.5;
}

.lang-badge {
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.125rem 0.5rem;
  background: rgba(102, 126, 234, 0.08);
  border-radius: 6px;
  color: #667eea;
}

.dark-mode .lang-badge {
  background: rgba(102, 126, 234, 0.15);
  color: #9ec5fe;
}

/* ============================================
   CATEGORIES SECTION
   ============================================ */
.categories-section {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
  flex-wrap: wrap;
  max-width: 140px;
  justify-content: flex-end;
}

.category-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.category-pill:hover {
  transform: translateY(-3px) scale(1.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* Category colors with enhanced gradients */
.category-primary { 
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.12), rgba(13, 110, 253, 0.08));
  color: #0d6efd;
}
.category-success { 
  background: linear-gradient(135deg, rgba(25, 135, 84, 0.12), rgba(25, 135, 84, 0.08));
  color: #198754;
}
.category-danger { 
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.12), rgba(220, 53, 69, 0.08));
  color: #dc3545;
}
.category-warning { 
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.12), rgba(255, 193, 7, 0.08));
  color: #ffc107;
}
.category-info { 
  background: linear-gradient(135deg, rgba(13, 202, 240, 0.12), rgba(13, 202, 240, 0.08));
  color: #0dcaf0;
}
.category-secondary { 
  background: linear-gradient(135deg, rgba(108, 117, 125, 0.12), rgba(108, 117, 125, 0.08));
  color: #6c757d;
}
.category-dark { 
  background: linear-gradient(135deg, rgba(33, 37, 41, 0.12), rgba(33, 37, 41, 0.08));
  color: #212529;
}

.dark-mode .category-primary { 
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.25), rgba(13, 110, 253, 0.15));
  color: #6ea8fe;
}
.dark-mode .category-success { 
  background: linear-gradient(135deg, rgba(25, 135, 84, 0.25), rgba(25, 135, 84, 0.15));
  color: #75b798;
}
.dark-mode .category-danger { 
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.25), rgba(220, 53, 69, 0.15));
  color: #ea868f;
}
.dark-mode .category-warning { 
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.25), rgba(255, 193, 7, 0.15));
  color: #ffc107;
}
.dark-mode .category-info { 
  background: linear-gradient(135deg, rgba(13, 202, 240, 0.25), rgba(13, 202, 240, 0.15));
  color: #6edff6;
}
.dark-mode .category-secondary { 
  background: linear-gradient(135deg, rgba(108, 117, 125, 0.25), rgba(108, 117, 125, 0.15));
  color: #adb5bd;
}
.dark-mode .category-dark { 
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15));
  color: #f8f9fa;
}

/* ============================================
   JOKE CONTENT
   ============================================ */
.joke-content {
  margin-bottom: 1.5rem;
}

.joke-text {
  font-size: 1.0625rem;
  line-height: 1.7;
  color: var(--text-color, #0f1419);
  margin: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
  letter-spacing: 0.01em;
}

.dark-mode .joke-text {
  color: var(--text-color, #e7e9ea);
}

.preserve-whitespace {
  white-space: pre-wrap;
}

/* RTL Support */
.rtl-text.joke-text {
  line-height: 1.8 !important;
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
  gap: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.dark-mode .engagement-bar {
  border-top-color: rgba(255, 255, 255, 0.06);
}

.engagement-btn,
.engagement-stat {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border-radius: 12px;
  background: transparent;
  border: none;
  color: #6c757d;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.engagement-btn {
  overflow: hidden;
}

.engagement-btn:hover:not(:disabled) {
  background: rgba(102, 126, 234, 0.08);
  color: #667eea;
  transform: translateY(-2px);
}

.btn-icon {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.engagement-btn:hover:not(:disabled) .btn-icon {
  transform: scale(1.15);
}

.engagement-btn:active:not(:disabled) .btn-icon {
  transform: scale(0.95);
}

/* Like button specific */
.like-btn.engaged {
  color: #f91880;
  background: rgba(249, 24, 128, 0.08);
}

.like-btn.engaged .btn-icon {
  animation: heartBeat 0.5s ease;
}

@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(0.95); }
  75% { transform: scale(1.1); }
}

.like-btn.engaging {
  opacity: 0.6;
  cursor: wait;
}

/* Ripple effect */
.btn-ripple {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: inherit;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
  transform: scale(0);
  opacity: 0;
}

.engagement-btn:active:not(:disabled) .btn-ripple {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  to {
    transform: scale(2);
    opacity: 0;
  }
}

.engagement-count {
  font-size: 0.9375rem;
  font-weight: 600;
  min-width: 24px;
  text-align: left;
}

.engagement-stat {
  color: #6c757d;
  cursor: default;
  padding: 0.5rem 0.75rem;
}

.views-stat {
  color: #1d9bf0;
}

.dark-mode .engagement-btn,
.dark-mode .engagement-stat {
  color: #adb5bd;
}

.dark-mode .engagement-btn:hover:not(:disabled) {
  background: rgba(102, 126, 234, 0.15);
  color: #9ec5fe;
}

.dark-mode .like-btn.engaged {
  color: #f91880;
  background: rgba(249, 24, 128, 0.15);
}

.dark-mode .views-stat {
  color: #6ea8fe;
}

/* ============================================
   VIEW DETAILS BUTTON
   ============================================ */
.btn-view-details {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #667eea;
  text-decoration: none;
  border-radius: 12px;
  background: rgba(102, 126, 234, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.btn-view-details:hover {
  background: rgba(102, 126, 234, 0.12);
  color: #667eea;
  transform: translateX(4px);
}

.btn-view-details i {
  font-size: 1.125rem;
  transition: transform 0.3s ease;
}

.btn-view-details:hover i {
  transform: translateX(3px);
}

.dark-mode .btn-view-details {
  color: #9ec5fe;
  background: rgba(102, 126, 234, 0.12);
}

.dark-mode .btn-view-details:hover {
  background: rgba(102, 126, 234, 0.2);
  color: #9ec5fe;
}

/* ============================================
   SOCIAL SHARE WRAPPER
   ============================================ */
.engagement-btn-wrapper {
  display: inline-flex;
}

.engagement-btn-wrapper :deep(.share-btn) {
  padding: 0.5rem 0.875rem;
  border: none;
  background: transparent;
  color: #6c757d;
  font-size: 0.9375rem;
  gap: 0.5rem;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.engagement-btn-wrapper :deep(.share-btn i) {
  font-size: 1.25rem;
}

.engagement-btn-wrapper :deep(.share-btn:hover) {
  background: rgba(0, 186, 124, 0.08);
  color: #00ba7c;
  transform: translateY(-2px);
  border: none;
  box-shadow: none;
}

.dark-mode .engagement-btn-wrapper :deep(.share-btn) {
  color: #adb5bd;
}

.dark-mode .engagement-btn-wrapper :deep(.share-btn:hover) {
  background: rgba(0, 186, 124, 0.15);
  color: #00ba7c;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */
@media (max-width: 768px) {
  .joke-card-modern {
    padding: 1.5rem;
    border-radius: 16px;
  }

  .avatar {
    width: 44px;
    height: 44px;
  }

  .avatar-text {
    font-size: 1rem;
  }

  .author-name {
    font-size: 0.9375rem;
  }

  .joke-text {
    font-size: 1rem;
  }

  .categories-section {
    max-width: 120px;
  }

  .category-pill {
    width: 36px;
    height: 36px;
    font-size: 0.9375rem;
  }

  .engagement-bar {
    gap: 1rem;
  }

  .engagement-btn,
  .engagement-stat {
    padding: 0.4rem 0.75rem;
    font-size: 0.875rem;
  }

  .btn-view-details {
    display: none;
  }
}

@media (max-width: 576px) {
  .joke-card-modern {
    padding: 1.25rem;
    margin-bottom: 1.25rem;
  }

  .avatar {
    width: 40px;
    height: 40px;
  }

  .engagement-bar {
    gap: 0.75rem;
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .engagement-bar::-webkit-scrollbar {
    display: none;
  }

  .engagement-btn,
  .engagement-stat {
    padding: 0.375rem 0.625rem;
  }

  .category-pill {
    width: 32px;
    height: 32px;
  }
}

/* ============================================
   ACCESSIBILITY
   ============================================ */
@media (prefers-reduced-motion: reduce) {
  .joke-card-modern,
  .joke-card-modern::before,
  .card-gradient,
  .avatar,
  .avatar-glow,
  .category-pill,
  .engagement-btn,
  .btn-icon,
  .btn-ripple,
  .btn-view-details i {
    animation: none !important;
    transition: none !important;
  }
}

.joke-card,
.card,
.joke-item {
  overflow: visible !important;
}

</style>