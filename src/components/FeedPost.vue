<template>
  <article class="feed-post" @click="handleCardClick">
    <!-- Card Inner Wrapper for better shadow/border control -->
    <div class="feed-post-inner">
      <!-- Header -->
      <div class="feed-post-header">
        <div class="author-section">
          <div class="avatar">
            <span class="avatar-text">{{ getAuthorInitial(joke.author) }}</span>
            <div class="avatar-ring"></div>
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

      <!-- Title (if exists) -->
      <h5 
        v-if="joke.title" 
        class="feed-post-title"
        :dir="titleDirection"
        :class="titleDirectionClass"
      >
        {{ joke.title }}
      </h5>

      <!-- Joke Text -->
      <div class="feed-post-content">
        <p 
          class="feed-post-text preserve-whitespace"
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
        <div v-if="joke.shares && joke.shares > 0" class="engagement-stat">
          <i class="bi bi-arrow-repeat"></i>
          <span class="engagement-count">{{ formatCount(joke.shares) }}</span>
        </div>

        <!-- View Details (Desktop) -->
        <router-link 
          :to="`/joke/${joke.id}`" 
          class="btn-view-details ms-auto"
          @click="handleCardClick"
        >
          <span>Read more</span>
          <i class="bi bi-arrow-right-short"></i>
        </router-link>
      </div>
    </div>
  </article>
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
    localLikes.value += 1;
    hasLiked.value = true;

    await store.dispatch('jokes/trackInteraction', {
      jokeId: props.joke.id,
      interactionType: 'like'
    });

    const likedJokes = JSON.parse(localStorage.getItem('likedJokes') || '[]');
    likedJokes.push(props.joke.id);
    localStorage.setItem('likedJokes', JSON.stringify(likedJokes));

    trackJokeLike(props.joke.id, props.joke.category, props.joke.language);
  } catch (error) {
    console.error('Failed to like joke:', error);
    localLikes.value -= 1;
    hasLiked.value = false;
  } finally {
    isLiking.value = false;
  }
};

const handleCardClick = () => {
  router.push(getJokeUrl(props.joke));
};

const getJokeCategories = (joke) => {
  if (Array.isArray(joke.categories)) return joke.categories;
  if (joke.category) return [joke.category];
  return ['General'];
};

const getAuthorName = (author) => {
  if (!author || !author.name) return 'Anonymous';
  return author.name;
};

const getAuthorInitial = (author) => {
  const name = getAuthorName(author);
  return name.charAt(0).toUpperCase();
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
   FEED POST CARD - Modern Design
   ============================================ */
.feed-post {
  position: relative;
  cursor: pointer;
  animation: fade-in-up 0.5s ease-out;
  animation-fill-mode: both;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feed-post-inner {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.75rem;
  border: 1px solid rgba(102, 126, 234, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.06),
    0 2px 8px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(255, 255, 255, 0.5);
  position: relative;
  overflow: hidden;
}

/* Gradient accent line on top */
.feed-post-inner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.feed-post:hover .feed-post-inner {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 
    0 20px 40px rgba(102, 126, 234, 0.15),
    0 10px 20px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.3);
}

.feed-post:hover .feed-post-inner::before {
  opacity: 1;
}

.feed-post:active .feed-post-inner {
  transform: translateY(-4px) scale(1.005);
  transition-duration: 0.1s;
}

/* Dark mode */
.dark-mode .feed-post-inner {
  background: rgba(28, 32, 36, 0.95);
  border-color: rgba(102, 126, 234, 0.15);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

.dark-mode .feed-post:hover .feed-post-inner {
  box-shadow: 
    0 20px 40px rgba(102, 126, 234, 0.25),
    0 10px 20px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(102, 126, 234, 0.4);
  border-color: rgba(102, 126, 234, 0.4);
}

/* ============================================
   HEADER SECTION - Enhanced
   ============================================ */
.feed-post-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.author-section {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

/* Avatar with animated ring */
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
  font-weight: 700;
  font-size: 1.125rem;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 12px rgba(102, 126, 234, 0.25),
    0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.avatar-text {
  position: relative;
  z-index: 2;
}

/* Animated ring effect */
.avatar-ring {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 2px solid transparent;
  background: linear-gradient(135deg, #667eea, #764ba2) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.feed-post:hover .avatar {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 
    0 8px 20px rgba(102, 126, 234, 0.35),
    0 4px 10px rgba(0, 0, 0, 0.15);
}

.feed-post:hover .avatar-ring {
  opacity: 1;
  animation: ring-rotate 3s linear infinite;
}

@keyframes ring-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.author-info {
  flex: 1;
  min-width: 0;
}

.author-name {
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-color, #0f1419);
  margin-bottom: 0.375rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}

.feed-post:hover .author-name {
  color: #667eea;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: #6c757d;
  flex-wrap: wrap;
}

.dark-mode .post-meta {
  color: #adb5bd;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.meta-item i {
  font-size: 0.875rem;
}

.meta-separator {
  color: #dee2e6;
  font-weight: 300;
}

.dark-mode .meta-separator {
  color: #495057;
}

.lang-badge {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  padding: 0.25rem 0.625rem;
  background: rgba(13, 110, 253, 0.1);
  border-radius: 12px;
  color: #0d6efd;
  transition: all 0.3s ease;
}

.feed-post:hover .lang-badge {
  background: rgba(13, 110, 253, 0.15);
  transform: translateY(-1px);
}

.dark-mode .lang-badge {
  background: rgba(13, 110, 253, 0.2);
  color: #6ea8fe;
}

.dark-mode .feed-post:hover .lang-badge {
  background: rgba(13, 110, 253, 0.3);
}

/* ============================================
   CATEGORIES SECTION - Enhanced
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
  width: 38px;
  height: 38px;
  border-radius: 50%;
  font-size: 1rem;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 2px 6px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
}

.category-pill::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: inherit;
  opacity: 0;
  filter: blur(8px);
  transition: opacity 0.3s ease;
  z-index: -1;
}

.category-pill:hover {
  transform: scale(1.15) rotate(10deg);
  box-shadow: 
    0 6px 16px rgba(0, 0, 0, 0.12),
    0 3px 8px rgba(0, 0, 0, 0.08);
}

.category-pill:hover::after {
  opacity: 0.5;
}

/* Enhanced category colors with gradients */
.category-primary { 
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.15), rgba(13, 110, 253, 0.08));
  color: #0d6efd; 
}
.category-success { 
  background: linear-gradient(135deg, rgba(25, 135, 84, 0.15), rgba(25, 135, 84, 0.08));
  color: #198754; 
}
.category-danger { 
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.15), rgba(220, 53, 69, 0.08));
  color: #dc3545; 
}
.category-warning { 
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 193, 7, 0.08));
  color: #ffc107; 
}
.category-info { 
  background: linear-gradient(135deg, rgba(13, 202, 240, 0.15), rgba(13, 202, 240, 0.08));
  color: #0dcaf0; 
}
.category-secondary { 
  background: linear-gradient(135deg, rgba(108, 117, 125, 0.15), rgba(108, 117, 125, 0.08));
  color: #6c757d; 
}
.category-dark { 
  background: linear-gradient(135deg, rgba(33, 37, 41, 0.15), rgba(33, 37, 41, 0.08));
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
   TITLE & CONTENT - Enhanced Typography
   ============================================ */
.feed-post-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color, #0f1419);
  margin-bottom: 1rem;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.feed-post:hover .feed-post-title {
  color: #667eea;
}

.dark-mode .feed-post-title {
  color: var(--text-color, #e7e9ea);
}

.dark-mode .feed-post:hover .feed-post-title {
  color: #9ec5fe;
}

/* RTL Support for title */
.rtl-text.feed-post-title {
  text-align: right !important;
  direction: rtl !important;
}

.ltr-text.feed-post-title {
  text-align: left !important;
  direction: ltr !important;
}

.feed-post-content {
  margin-bottom: 1.25rem;
}

.feed-post-text {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-color, #0f1419);
  margin: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.dark-mode .feed-post-text {
  color: var(--text-color, #e7e9ea);
}

.preserve-whitespace {
  white-space: pre-wrap;
}

/* RTL Support */
.rtl-text.feed-post-text {
  line-height: 1.8 !important;
  text-align: right !important;
  direction: rtl !important;
}

.ltr-text.feed-post-text {
  text-align: left !important;
  direction: ltr !important;
}

/* ============================================
   ENGAGEMENT BAR - Enhanced Interactions
   ============================================ */
.engagement-bar {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  transition: border-color 0.3s ease;
}

.feed-post:hover .engagement-bar {
  border-top-color: rgba(102, 126, 234, 0.15);
}

.dark-mode .engagement-bar {
  border-top-color: rgba(255, 255, 255, 0.08);
}

.dark-mode .feed-post:hover .engagement-bar {
  border-top-color: rgba(102, 126, 234, 0.25);
}

.engagement-btn,
.engagement-stat {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: none;
  color: #6c757d;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  border-radius: 12px;
  position: relative;
}

.engagement-btn {
  font-weight: 600;
}

.engagement-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: currentColor;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.engagement-btn i {
  font-size: 1.25rem;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

.engagement-btn span {
  position: relative;
  z-index: 1;
}

.engagement-btn:hover {
  color: #f91880;
  background: rgba(249, 24, 128, 0.08);
  transform: translateY(-2px);
}

.engagement-btn:hover::before {
  opacity: 0.05;
}

.engagement-btn:hover i {
  transform: scale(1.2);
}

.engagement-btn:active {
  transform: translateY(-1px);
  transition-duration: 0.1s;
}

/* Like button specific */
.engagement-btn.engaged {
  color: #f91880;
  background: rgba(249, 24, 128, 0.1);
}

.engagement-btn.engaged i {
  animation: like-pop 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes like-pop {
  0%, 100% { 
    transform: scale(1); 
  }
  25% { 
    transform: scale(1.3); 
  }
  50% { 
    transform: scale(0.9); 
  }
  75% { 
    transform: scale(1.1); 
  }
}

.engagement-btn.engaging {
  opacity: 0.6;
  cursor: wait;
}

.engagement-count {
  font-size: 0.875rem;
  font-weight: 600;
  min-width: 24px;
  text-align: left;
}

.engagement-stat {
  color: #6c757d;
  cursor: default;
  font-weight: 600;
  transition: all 0.3s ease;
}

.engagement-stat:hover {
  background: rgba(108, 117, 125, 0.08);
  transform: translateY(-2px);
}

.engagement-stat i {
  font-size: 1.125rem;
  transition: transform 0.3s ease;
}

.engagement-stat:hover i {
  transform: scale(1.15);
}

.dark-mode .engagement-btn,
.dark-mode .engagement-stat {
  color: #adb5bd;
}

.dark-mode .engagement-btn:hover {
  color: #f91880;
  background: rgba(249, 24, 128, 0.12);
}

.dark-mode .engagement-btn.engaged {
  color: #f91880;
  background: rgba(249, 24, 128, 0.15);
}

.dark-mode .engagement-stat:hover {
  background: rgba(108, 117, 125, 0.12);
}

/* ============================================
   VIEW DETAILS BUTTON - Enhanced
   ============================================ */
.btn-view-details {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1.125rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #667eea;
  text-decoration: none;
  border-radius: 50px;
  background: rgba(102, 126, 234, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.btn-view-details::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-view-details span,
.btn-view-details i {
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}

.btn-view-details:hover {
  background: rgba(102, 126, 234, 0.15);
  color: #fff;
  transform: translateX(4px) translateY(-2px);
  box-shadow: 
    0 6px 16px rgba(102, 126, 234, 0.25),
    0 3px 8px rgba(0, 0, 0, 0.1);
}

.btn-view-details:hover::before {
  opacity: 1;
}

.btn-view-details i {
  font-size: 1.375rem;
  transition: transform 0.3s ease;
}

.btn-view-details:hover i {
  transform: translateX(4px);
}

.dark-mode .btn-view-details {
  color: #9ec5fe;
  background: rgba(102, 126, 234, 0.15);
}

.dark-mode .btn-view-details:hover {
  background: rgba(102, 126, 234, 0.25);
  color: #fff;
}

/* ============================================
   SOCIAL SHARE WRAPPER
   ============================================ */
.engagement-btn-wrapper {
  display: inline-flex;
}

/* Override SocialShare button to match engagement style */
.engagement-btn-wrapper :deep(.share-btn) {
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  color: #6c757d;
  font-size: 0.875rem;
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
  border: none;
  transform: translateY(-2px);
  box-shadow: none;
}

.engagement-btn-wrapper :deep(.share-btn:hover i) {
  transform: scale(1.2);
}

.dark-mode .engagement-btn-wrapper :deep(.share-btn) {
  color: #adb5bd;
}

.dark-mode .engagement-btn-wrapper :deep(.share-btn:hover) {
  color: #00ba7c;
  background: rgba(0, 186, 124, 0.12);
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */
@media (max-width: 576px) {
  .feed-post-inner {
    padding: 1.5rem;
    border-radius: 16px;
  }

  .avatar {
    width: 42px;
    height: 42px;
    font-size: 1rem;
  }

  .author-name {
    font-size: 0.9375rem;
  }

  .post-meta {
    font-size: 0.75rem;
  }

  .feed-post-title {
    font-size: 1.125rem;
  }

  .feed-post-text {
    font-size: 0.9375rem;
  }

  .categories-section {
    max-width: 110px;
  }

  .category-pill {
    width: 34px;
    height: 34px;
    font-size: 0.9375rem;
  }

  .engagement-bar {
    gap: 1rem;
    padding-top: 1rem;
    flex-wrap: wrap;
  }

  .engagement-btn,
  .engagement-stat {
    font-size: 0.8125rem;
    padding: 0.375rem 0.625rem;
  }

  .engagement-btn i,
  .engagement-stat i {
    font-size: 1.125rem;
  }

  .engagement-count {
    font-size: 0.8125rem;
  }

  .btn-view-details {
    display: none;
  }
}

@media (max-width: 375px) {
  .feed-post-inner {
    padding: 1.25rem;
  }

  .engagement-bar {
    gap: 0.75rem;
  }

  .engagement-count {
    font-size: 0.7rem;
  }

  .engagement-btn i,
  .engagement-stat i {
    font-size: 1rem;
  }
}

/* ============================================
   ACCESSIBILITY
   ============================================ */
@media (prefers-reduced-motion: reduce) {
  .feed-post,
  .feed-post-inner,
  .feed-post-inner::before,
  .avatar,
  .avatar-ring,
  .category-pill,
  .category-pill::after,
  .engagement-btn,
  .engagement-btn::before,
  .engagement-btn i,
  .engagement-stat,
  .engagement-stat i,
  .btn-view-details,
  .btn-view-details::before,
  .btn-view-details i {
    animation: none !important;
    transition: none !important;
  }
}
</style>