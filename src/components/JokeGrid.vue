<template>
  <div class="row g-4">
    <div 
      v-for="joke in jokes" 
      :key="joke.id"
      class="col-md-6 col-lg-4"
    >
      <div class="card joke-card-preview h-100">
        <div class="card-body d-flex flex-column">
          <!-- Header: Badges -->
          <div class="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
            <div class="d-flex flex-wrap gap-1">
              <!-- UPDATED: Display all categories as badges -->
              <span 
                v-for="category in getJokeCategories(joke)" 
                :key="category"
                :class="`badge bg-${getCategoryColor(category)} category-badge`"
              >
                {{ category }}
              </span>
            </div>
            <span class="badge bg-secondary">{{ getLanguageName(joke.language) }}</span>
          </div>
          
          <!-- Joke Title (if exists) -->
          <h5 
            v-if="joke.title" 
            class="joke-title mb-2"
            :dir="getTextDirection(joke.title)"
            :lang="joke.language"
            :class="getDirectionClass(joke.title)"
          >
            {{ joke.title }}
          </h5>
          
          <!-- Joke Preview Text -->
          <p 
            class="joke-preview-text flex-grow-1 preserve-whitespace"
            :dir="getTextDirection(joke.text)"
            :lang="joke.language"
            :class="getDirectionClass(joke.text)"
          >
            {{ truncateText(joke.text, previewLength) }}
          </p>
          
          <!-- Footer: Author, Stats, and Action -->
          <div class="mt-auto pt-3 border-top">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <small class="text-muted">
                👤 <strong>{{ getAuthorName(joke.author) }}</strong>
              </small>
              <div class="d-flex gap-2">
                <small class="text-muted">❤️ {{ joke.likes || 0 }}</small>
                <small class="text-muted">👁️ {{ joke.views || 0 }}</small>
              </div>
            </div>
            <router-link 
              :to="`/joke/${joke.id}`" 
              class="btn btn-sm btn-primary w-100"
            >
              Read More
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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

/**
 * UPDATED: Get categories array from joke
 * Supports both old (category) and new (categories) formats
 */
const getJokeCategories = (joke) => {
  // If joke has categories array, use it
  if (joke.categories && Array.isArray(joke.categories)) {
    return joke.categories;
  }
  // Fallback to old single category format
  if (joke.category) {
    return [joke.category];
  }
  // Default fallback
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

const getAuthorName = (author) => {
  if (!author || !author.name) {
    return 'Anonymous';
  }
  return author.name;
};
</script>

<style scoped>
.joke-card-preview {
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.joke-card-preview:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.dark-mode .joke-card-preview:hover {
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.1);
}

/* Joke Title Styling */
.joke-title {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  
  /* Limit to 2 lines with ellipsis */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* RTL support for title */
.rtl-text.joke-title {
  text-align: right !important;
  direction: rtl !important;
}

.ltr-text.joke-title {
  text-align: left !important;
  direction: ltr !important;
}

.joke-preview-text {
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-color);
  height: 4.5em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

/* RTL text gets better line height */
.rtl-text.joke-preview-text {
  line-height: 1.7 !important;
  text-align: right !important;
  direction: rtl !important;
}

.ltr-text.joke-preview-text {
  text-align: left !important;
  direction: ltr !important;
}

.preserve-whitespace {
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* UPDATED: Category badge styling for multiple categories */
.category-badge {
  font-size: 0.7rem;
  text-transform: capitalize;
  letter-spacing: 0.3px;
  padding: 0.3em 0.5em;
  font-weight: 500;
}
</style>