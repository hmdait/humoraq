<template>
  <div class="jokes-grid">
    <div 
      v-for="joke in jokes" 
      :key="joke.id"
      class="joke-grid-item"
      @click="navigateToJoke(joke)"
    >
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

      <!-- Title (if exists) -->
      <h5 
        v-if="joke.title" 
        class="joke-title"
        :dir="getTextDirection(joke.title)"
        :lang="joke.language"
        :class="getDirectionClass(joke.title)"
      >
        {{ joke.title }}
      </h5>
      
      <!-- Joke Preview Text -->
      <p 
        class="joke-preview-text preserve-whitespace"
        :dir="getTextDirection(joke.text)"
        :lang="joke.language"
        :class="getDirectionClass(joke.text)"
      >
        {{ truncateText(joke.text, previewLength) }}
      </p>
      
      <!-- Footer: Stats -->
      <div class="engagement-bar">
        <div class="engagement-stat">
          <i class="bi bi-heart"></i>
          <span class="engagement-count">{{ formatCount(joke.likes || 0) }}</span>
        </div>
        
        <div class="engagement-stat">
          <i class="bi bi-eye"></i>
          <span class="engagement-count">{{ formatCount(joke.views || 0) }}</span>
        </div>

        <div v-if="joke.shares && joke.shares > 0" class="engagement-stat">
          <i class="bi bi-arrow-repeat"></i>
          <span class="engagement-count">{{ formatCount(joke.shares) }}</span>
        </div>

        <div class="btn-view-details ms-auto">
          Read more
          <i class="bi bi-arrow-right-short"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { getCategoryLabel, getCategoryColor, getCategoryIcon } from '@/config/categories';
import { getTextDirection, getDirectionClass } from '../utils/rtl';
import { getJokeUrl } from '@/utils/jokeUrlHelper';

const props = defineProps({
  jokes: {
    type: Array,
    required: true,
    default: () => []
  },
  previewLength: {
    type: Number,
    default: 100
  }
});

const router = useRouter();

const navigateToJoke = (joke) => {
  const url = getJokeUrl(joke);
  router.push(url);
};

const getJokeCategories = (joke) => {
  if (Array.isArray(joke.categories)) {
    return joke.categories;
  }
  
  if (joke.category) {
    return [joke.category];
  }
  
  return ['General'];
};

const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
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
   MODERN GRID LAYOUT
   ============================================ */
.jokes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  padding: 0.5rem 0;
}

/* ============================================
   MODERN CARD DESIGN
   ============================================ */
.joke-grid-item {
  background: var(--card-bg, #ffffff);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 280px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.04),
    0 1px 2px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

/* Gradient border effect on hover */
.joke-grid-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.joke-grid-item:hover::before {
  opacity: 1;
}

.joke-grid-item:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 12px 28px rgba(102, 126, 234, 0.12),
    0 6px 12px rgba(0, 0, 0, 0.08);
  border-color: rgba(102, 126, 234, 0.2);
}

/* Active state */
.joke-grid-item:active {
  transform: translateY(-6px) scale(1.01);
  transition-duration: 0.1s;
}

/* Dark mode card styling */
.dark-mode .joke-grid-item {
  background: var(--card-bg, #1c2024);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.2),
    0 1px 2px rgba(0, 0, 0, 0.3);
}

.dark-mode .joke-grid-item:hover {
  box-shadow: 
    0 12px 28px rgba(102, 126, 234, 0.2),
    0 6px 12px rgba(0, 0, 0, 0.4);
  border-color: rgba(102, 126, 234, 0.4);
}

/* ============================================
   HEADER SECTION - Enhanced
   ============================================ */
.joke-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.author-section {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
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
  font-size: 0.9375rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.joke-grid-item:hover .avatar {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.author-info {
  flex: 1;
  min-width: 0;
}

.author-name {
  font-weight: 700;
  font-size: 0.9375rem;
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
  font-size: 0.8125rem;
  color: #6c757d;
}

.dark-mode .post-meta {
  color: #adb5bd;
}

.meta-item {
  white-space: nowrap;
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
  padding: 0.125rem 0.5rem;
  background: rgba(13, 110, 253, 0.1);
  border-radius: 6px;
  color: #0d6efd;
}

.dark-mode .lang-badge {
  background: rgba(13, 110, 253, 0.2);
  color: #6ea8fe;
}

/* ============================================
   CATEGORIES SECTION - Enhanced
   ============================================ */
.categories-section {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
  flex-wrap: wrap;
  max-width: 100px;
  justify-content: flex-end;
}

.category-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  font-size: 0.9375rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.category-pill:hover {
  transform: scale(1.15) rotate(10deg);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

/* Enhanced category colors with better contrast */
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
.joke-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--text-color, #0f1419);
  margin-bottom: 0.75rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}

.joke-grid-item:hover .joke-title {
  color: #667eea;
}

.dark-mode .joke-title {
  color: var(--text-color, #e7e9ea);
}

.dark-mode .joke-grid-item:hover .joke-title {
  color: #9ec5fe;
}

/* RTL Support for title */
.rtl-text.joke-title {
  text-align: right !important;
  direction: rtl !important;
}

.ltr-text.joke-title {
  text-align: left !important;
  direction: ltr !important;
}

.joke-preview-text {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-color, #536471);
  margin: 0 0 auto 0;
  flex-grow: 1;
  word-wrap: break-word;
  overflow-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark-mode .joke-preview-text {
  color: var(--text-color, #adb5bd);
}

.preserve-whitespace {
  white-space: pre-wrap;
}

/* RTL Support */
.rtl-text.joke-preview-text {
  line-height: 1.8 !important;
  text-align: right !important;
  direction: rtl !important;
}

.ltr-text.joke-preview-text {
  text-align: left !important;
  direction: ltr !important;
}

/* ============================================
   ENGAGEMENT BAR - Enhanced with better spacing
   ============================================ */
.engagement-bar {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding-top: 1rem;
  margin-top: auto;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.dark-mode .engagement-bar {
  border-top-color: rgba(255, 255, 255, 0.08);
}

.engagement-stat {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
  font-size: 0.8125rem;
  font-weight: 600;
  user-select: none;
  transition: all 0.3s ease;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
}

.engagement-stat:hover {
  background: rgba(0, 0, 0, 0.04);
  color: #495057;
}

.dark-mode .engagement-stat {
  color: #adb5bd;
}

.dark-mode .engagement-stat:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #f8f9fa;
}

.engagement-stat i {
  font-size: 1.125rem;
  transition: transform 0.3s ease;
}

.engagement-stat:hover i {
  transform: scale(1.15);
}

.engagement-stat:first-child i {
  color: #f91880;
}

.engagement-stat:nth-child(2) i {
  color: #1d9bf0;
}

.engagement-stat:nth-child(3) i {
  color: #00ba7c;
}

.engagement-count {
  font-size: 0.8125rem;
  font-weight: 600;
  min-width: 20px;
  text-align: left;
}

/* ============================================
   VIEW DETAILS BUTTON - Enhanced
   ============================================ */
.btn-view-details {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.875rem;
  margin-left: auto;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #667eea;
  text-decoration: none;
  white-space: nowrap;
  border-radius: 8px;
  background: rgba(102, 126, 234, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-view-details:hover {
  background: rgba(102, 126, 234, 0.15);
  color: #667eea;
  transform: translateX(4px);
}

.btn-view-details i {
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.joke-grid-item:hover .btn-view-details i {
  transform: translateX(4px);
}

.dark-mode .btn-view-details {
  color: #9ec5fe;
  background: rgba(102, 126, 234, 0.15);
}

.dark-mode .btn-view-details:hover {
  background: rgba(102, 126, 234, 0.25);
  color: #9ec5fe;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */
@media (max-width: 768px) {
  .jokes-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
  }

  .joke-grid-item {
    min-height: 260px;
    padding: 1.25rem;
  }

  .joke-title {
    font-size: 1rem;
  }

  .joke-preview-text {
    font-size: 0.875rem;
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }

  .avatar {
    width: 36px;
    height: 36px;
    font-size: 0.875rem;
  }

  .engagement-bar {
    gap: 1rem;
  }
}

@media (max-width: 576px) {
  .jokes-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .joke-grid-item {
    min-height: auto;
    padding: 1.25rem;
  }

  .joke-card-header {
    margin-bottom: 0.875rem;
  }

  .categories-section {
    max-width: 80px;
  }

  .category-pill {
    width: 30px;
    height: 30px;
    font-size: 0.875rem;
  }

  .engagement-bar {
    gap: 0.875rem;
    padding-top: 0.875rem;
  }

  .engagement-stat {
    font-size: 0.75rem;
    padding: 0.25rem 0.375rem;
  }

  .engagement-stat i {
    font-size: 1rem;
  }

  .engagement-count {
    font-size: 0.75rem;
  }

  .btn-view-details {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
  }

  .btn-view-details i {
    font-size: 1.125rem;
  }
}

/* ============================================
   LOADING ANIMATION
   ============================================ */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.joke-grid-item {
  animation: fadeIn 0.5s ease-out;
  animation-fill-mode: both;
}

.joke-grid-item:nth-child(1) { animation-delay: 0.05s; }
.joke-grid-item:nth-child(2) { animation-delay: 0.1s; }
.joke-grid-item:nth-child(3) { animation-delay: 0.15s; }
.joke-grid-item:nth-child(4) { animation-delay: 0.2s; }
.joke-grid-item:nth-child(5) { animation-delay: 0.25s; }
.joke-grid-item:nth-child(6) { animation-delay: 0.3s; }

/* ============================================
   ACCESSIBILITY
   ============================================ */
@media (prefers-reduced-motion: reduce) {
  .joke-grid-item,
  .avatar,
  .category-pill,
  .engagement-stat i,
  .btn-view-details,
  .btn-view-details i {
    animation: none !important;
    transition: none !important;
  }
}

/* Focus visible for keyboard navigation */
.joke-grid-item:focus-visible {
  outline: 3px solid #667eea;
  outline-offset: 4px;
}
</style>