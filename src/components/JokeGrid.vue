<template>
  <div class="jokes-grid">
    <div 
      v-for="joke in jokes" 
      :key="joke.id"
      class="joke-grid-item"
      @click="navigateToJoke(joke.id)"
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

const navigateToJoke = (jokeId) => {
  router.push(`/joke/${jokeId}`);
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
   GRID LAYOUT
   ============================================ */
.jokes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1px;
  background: rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.dark-mode .jokes-grid {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
}

/* ============================================
   GRID ITEM - X-style minimal design
   ============================================ */
.joke-grid-item {
  background: var(--card-bg, #ffffff);
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 280px;
}

.joke-grid-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.dark-mode .joke-grid-item {
  background: var(--card-bg, #000000);
}

.dark-mode .joke-grid-item:hover {
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
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.joke-grid-item:hover .avatar {
  transform: scale(1.05);
}

.author-info {
  flex: 1;
  min-width: 0;
}

.author-name {
  font-weight: 700;
  font-size: 0.875rem;
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
  font-size: 0.75rem;
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
  font-size: 0.7rem;
}

/* ============================================
   CATEGORIES SECTION
   ============================================ */
.categories-section {
  display: flex;
  gap: 0.375rem;
  flex-shrink: 0;
  flex-wrap: wrap;
  max-width: 80px;
  justify-content: flex-end;
}

.category-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 0.8125rem;
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
   TITLE & CONTENT
   ============================================ */
.joke-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-color, #0f1419);
  margin-bottom: 0.5rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark-mode .joke-title {
  color: var(--text-color, #e7e9ea);
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
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-color, #0f1419);
  margin: 0 0 auto 0;
  flex-grow: 1;
  word-wrap: break-word;
  overflow-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark-mode .joke-preview-text {
  color: var(--text-color, #e7e9ea);
}

.preserve-whitespace {
  white-space: pre-wrap;
}

/* RTL Support */
.rtl-text.joke-preview-text {
  line-height: 1.7 !important;
  text-align: right !important;
  direction: rtl !important;
}

.ltr-text.joke-preview-text {
  text-align: left !important;
  direction: ltr !important;
}

/* ============================================
   ENGAGEMENT BAR
   ============================================ */
.engagement-bar {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding-top: 0.75rem;
  margin-top: auto;
}

.engagement-stat {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: #536471;
  font-size: 0.75rem;
  font-weight: 500;
  user-select: none;
}

.engagement-stat i {
  font-size: 1rem;
}

.engagement-count {
  font-size: 0.75rem;
  font-weight: 500;
  min-width: 20px;
  text-align: left;
}

.dark-mode .engagement-stat {
  color: #71767b;
}

/* ============================================
   VIEW DETAILS BUTTON
   ============================================ */
.btn-view-details {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #1d9bf0;
  text-decoration: none;
  white-space: nowrap;
}

.btn-view-details i {
  font-size: 1.125rem;
  transition: transform 0.2s ease;
}

.joke-grid-item:hover .btn-view-details i {
  transform: translateX(2px);
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */
@media (max-width: 768px) {
  .jokes-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  .joke-grid-item {
    min-height: 260px;
    padding: 0.875rem 1rem;
  }

  .joke-title {
    font-size: 0.9375rem;
  }

  .joke-preview-text {
    font-size: 0.8125rem;
    -webkit-line-clamp: 3;
  }
}

@media (max-width: 576px) {
  .jokes-grid {
    grid-template-columns: 1fr;
    gap: 1px;
  }

  .joke-grid-item {
    min-height: auto;
  }

  .categories-section {
    max-width: 70px;
  }

  .category-pill {
    width: 24px;
    height: 24px;
    font-size: 0.75rem;
  }

  .engagement-bar {
    gap: 0.625rem;
  }

  .engagement-stat {
    font-size: 0.7rem;
  }

  .engagement-stat i {
    font-size: 0.9rem;
  }

  .engagement-count {
    font-size: 0.7rem;
  }

  .btn-view-details {
    font-size: 0.7rem;
  }

  .btn-view-details i {
    font-size: 1rem;
  }
}
</style>