<template>
  <DefaultLayout>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <router-link to="/categories" class="btn btn-outline-secondary mb-4">
            ← Back to Categories
          </router-link>

          <!-- Header -->
          <div class="category-header mb-4">
            <h1 class="display-5 mb-2">
              <span class="category-icon me-2">{{ categoryIcon }}</span>
              {{ categoryLabel }} Jokes
            </h1>
            <p class="text-muted">{{ categoryDescription }}</p>
          </div>

          <!-- Loading State with Skeleton -->
          <div v-if="loading" class="row g-4">
            <div 
              v-for="n in 6" 
              :key="n"
              class="col-md-6 col-lg-4"
            >
              <div class="card skeleton-card">
                <div class="card-body">
                  <div class="skeleton-badge mb-3"></div>
                  <div class="skeleton-title mb-2"></div>
                  <div class="skeleton-text mb-2"></div>
                  <div class="skeleton-text mb-3"></div>
                  <div class="skeleton-button"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Jokes Grid -->
          <JokeGrid 
            v-else-if="jokes.length > 0" 
            :jokes="jokes" 
            :preview-length="120" 
          />

          <!-- Empty State -->
          <div v-else class="alert alert-info">
            <strong>No jokes found in this category.</strong>
            <p class="mb-0 mt-2">
              Try selecting more languages from the header, or 
              <router-link to="/submit">submit a joke</router-link> in this category!
            </p>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { onBeforeRouteUpdate } from 'vue-router';
import JokeGrid from '../components/JokeGrid.vue';
import { updateSEO } from '../utils/seo';
import { getCategoryByValue, getCategoryLabel, getCategoryIcon, getCategoryDescription } from '@/config/categories'; // UPDATED
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
});

const store = useStore();

// OPTIMIZATION: Use Vuex for state management and caching
const jokes = computed(() => store.getters['categories/currentCategoryJokes']);
const loading = computed(() => store.getters['categories/loading']);
const selectedLanguages = computed(() => store.getters['preferences/selectedLanguages']);

// UPDATED: Get category info from unified config
const category = computed(() => getCategoryByValue(props.slug));
const categoryLabel = computed(() => getCategoryLabel(props.slug));
const categoryIcon = computed(() => getCategoryIcon(props.slug));
const categoryDescription = computed(() => getCategoryDescription(props.slug));

/**
 * OPTIMIZATION: Load jokes with caching
 */
const loadJokes = async () => {
  const cacheKey = `${props.slug}-${selectedLanguages.value.join(',')}`;
  
  // Check cache
  const cached = store.getters['categories/hasCachedJokes'](cacheKey);
  
  if (cached) {
    console.log('✅ Using cached jokes for:', props.slug);
    store.commit('categories/SET_CURRENT_CATEGORY', props.slug);
    return;
  }

  console.log('📊 Fetching jokes for category:', props.slug);

  // Fetch from Firestore
  await store.dispatch('categories/fetchCategoryJokes', {
    category: props.slug,
    languages: selectedLanguages.value
  });
};

// Handle route changes efficiently
onBeforeRouteUpdate(async (to, from) => {
  if (to.params.slug !== from.params.slug) {
    await loadJokes();
    updateSEO({
      title: `${categoryLabel.value} Jokes - Humoraq`,
      description: `Browse all ${categoryLabel.value.toLowerCase()} jokes. ${categoryDescription.value}`
    });
  }
});

// Debounced language change watcher
let languageChangeTimeout = null;
watch(selectedLanguages, () => {
  if (languageChangeTimeout) {
    clearTimeout(languageChangeTimeout);
  }
  
  languageChangeTimeout = setTimeout(() => {
    console.log('Languages changed, reloading category');
    loadJokes();
  }, 300);
}, { deep: true });

onMounted(async () => {
  await loadJokes();
  
  updateSEO({
    title: `${categoryLabel.value} Jokes - Humoraq`,
    description: `Browse all ${categoryLabel.value.toLowerCase()} jokes. ${categoryDescription.value}`
  });
});

onBeforeUnmount(() => {
  if (languageChangeTimeout) {
    clearTimeout(languageChangeTimeout);
  }
});
</script>

<style scoped>
.category-header {
  border-bottom: 2px solid var(--border-color, #dee2e6);
  padding-bottom: 1rem;
}

.category-icon {
  font-size: 3rem;
  vertical-align: middle;
}

/* Skeleton loading styles */
.skeleton-card {
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-badge,
.skeleton-title,
.skeleton-text,
.skeleton-button {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-badge {
  height: 24px;
  width: 80px;
  border-radius: 12px;
}

.skeleton-title {
  height: 20px;
  width: 60%;
}

.skeleton-text {
  height: 16px;
  width: 100%;
}

.skeleton-text:last-of-type {
  width: 80%;
}

.skeleton-button {
  height: 32px;
  width: 100%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.dark-mode .skeleton-badge,
.dark-mode .skeleton-title,
.dark-mode .skeleton-text,
.dark-mode .skeleton-button {
  background: linear-gradient(90deg, #2c2c2c 25%, #3c3c3c 50%, #2c2c2c 75%);
  background-size: 200% 100%;
}
</style>