<template>
  <DefaultLayout>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <!-- Header -->
          <h1 class="display-5 mb-2">Browse by Category</h1>
          <p class="text-muted mb-4">
            Explore jokes from different categories
          </p>

          <!-- Categories Grid -->
          <div class="row g-4">
            <div 
              v-for="category in categories" 
              :key="category.value" 
              class="col-md-6 col-lg-4"
            >
              <div 
                class="card category-card h-100" 
                @click="navigateToCategory(category.value)"
                :class="{ 'loading-shimmer': isLoadingCount(category.value) }"
              >
                <div class="card-body text-center">
                  <div class="display-4 mb-3">{{ category.icon }}</div>
                  <h5 class="card-title">{{ category.label }}</h5>
                  
                  <!-- Loading State (per category) -->
                  <p v-if="isLoadingCount(category.value)" class="card-text text-muted">
                    <span class="spinner-border spinner-border-sm me-1"></span>
                    Loading...
                  </p>
                  
                  <!-- Count Display -->
                  <p v-else class="card-text text-muted">
                    {{ categoryCounts[category.value] || 0 }} jokes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { updateSEO } from '../utils/seo';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const router = useRouter();
const store = useStore();

// Get selected languages from GLOBAL state
const selectedLanguages = computed(() => store.getters['preferences/selectedLanguages']);

// Track loading state per category
const loadingCategories = ref(new Set());

/**
 * Categories list (static - no need to be reactive)
 */
const categories = [
  { value: 'General', label: 'General', icon: '😄' },
  { value: 'Relationships', label: 'Relationships', icon: '💑' },
  { value: 'Family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { value: 'Work', label: 'Work', icon: '💼' },
  { value: 'School', label: 'School', icon: '🎓' },
  { value: 'Friends', label: 'Friends', icon: '👥' },
  { value: 'Adult', label: 'Adult', icon: '🔞' },
  { value: 'Animals', label: 'Animals', icon: '🐶' },
  { value: 'Food', label: 'Food', icon: '🍕' },
  { value: 'Tech', label: 'Tech', icon: '💻' },
  { value: 'Sports', label: 'Sports', icon: '⚽' },
  { value: 'Old People', label: 'Old People', icon: '👴' },
  { value: 'Women', label: 'Women', icon: '👩' },
  { value: 'Men', label: 'Men', icon: '👨' }
];

// OPTIMIZATION 1: Use Vuex store for caching counts
const categoryCounts = computed(() => store.getters['categories/counts']);
const cacheKey = computed(() => selectedLanguages.value.join(','));

const isLoadingCount = (categoryValue) => {
  return loadingCategories.value.has(categoryValue);
};

/**
 * OPTIMIZATION 2: Load counts from Vuex cache or fetch if needed
 */
const loadCounts = async () => {
  // Check if we already have cached counts for these languages
  const cached = store.getters['categories/hasCachedCounts'](cacheKey.value);
  
  if (cached) {
    console.log('✅ Using cached category counts');
    return;
  }

  console.log('📊 Fetching category counts for:', selectedLanguages.value);

  // OPTIMIZATION 3: Dispatch Vuex action (handles parallel fetching)
  await store.dispatch('categories/fetchCounts', {
    languages: selectedLanguages.value,
    categories: categories
  });
};

const navigateToCategory = (categoryValue) => {
  router.push(`/category/${categoryValue}`);
};

// OPTIMIZATION 4: Only reload if languages actually changed
const languagesKey = ref(cacheKey.value);
watch(selectedLanguages, (newLangs) => {
  const newKey = newLangs.join(',');
  if (newKey !== languagesKey.value) {
    languagesKey.value = newKey;
    loadCounts();
  }
}, { deep: true });

onMounted(async () => {
  updateSEO({
    title: 'Browse Joke Categories - Humoraq',
    description: 'Explore jokes by category: tech, work, animals, relationships, and more!'
  });
  
  await loadCounts();
});
</script>

<style scoped>
.category-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.category-card:hover:not(.loading-shimmer) {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dark-mode .category-card:hover:not(.loading-shimmer) {
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

.card-title {
  font-weight: 600;
  color: var(--text-color);
}

.card-text {
  font-size: 1.1rem;
}

/* Loading shimmer effect */
.loading-shimmer {
  opacity: 0.7;
  pointer-events: none;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.15em;
}
</style>