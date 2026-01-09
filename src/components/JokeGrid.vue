<template>
  <div class="row g-4">
    <div 
      v-for="joke in jokes" 
      :key="joke.id"
      class="col-md-6 col-lg-4"
    >
      <div class="card joke-card-preview h-100">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <span :class="`badge bg-${getCategoryColor(joke.category)} category-badge`">
              {{ getCategoryName(joke.category) }}
            </span>
            <span class="badge bg-secondary">{{ getLanguageName(joke.language) }}</span>
          </div>
          
          <!-- UPDATED: Added RTL support -->
          <p 
            class="joke-preview-text flex-grow-1 preserve-whitespace"
            :dir="getTextDirection(joke.text)"
            :lang="joke.language"
            :class="getDirectionClass(joke.text)"
          >
            {{ truncateText(joke.text, previewLength) }}
          </p>
          
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

.joke-preview-text {
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-color);
  height: 4.5em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

/* UPDATED: Force right alignment for RTL */
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

.category-badge {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>