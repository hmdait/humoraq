<template>
  <DefaultLayout>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <router-link to="/categories" class="btn btn-outline-secondary mb-4">
            ← Back to Categories
          </router-link>

          <!-- Header -->
          <h1 class="display-5 mb-4">
            {{ categoryName }} Jokes
          </h1>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <!-- Jokes Grid -->
          <JokeGrid v-else-if="jokes.length > 0" :jokes="jokes" :preview-length="120" />

          <!-- Empty State -->
          <div v-else class="alert alert-info">
            No jokes found in this category. Try selecting more languages from the header!
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { getCategoryBySlug, slugToValue } from '@/config/categories'; // SINGLE SOURCE OF TRUTH
import JokeGrid from '../components/JokeGrid.vue';
import { updateSEO } from '../utils/seo';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
});

const store = useStore();

// Get data from GLOBAL Vuex state
const jokes = computed(() => store.getters['jokes/jokes']);
const loading = computed(() => store.getters['jokes/loading']);
const selectedLanguages = computed(() => store.getters['preferences/selectedLanguages']);

// Get category from centralized config
const category = computed(() => getCategoryBySlug(props.slug));

// Get category name with fallback
const categoryName = computed(() => {
  return category.value ? category.value.label : props.slug;
});

// Get category value for Firestore queries
const categoryValue = computed(() => {
  return slugToValue(props.slug);
});

// Load jokes using GLOBAL state
const loadJokes = async () => {
  console.log('=== Loading jokes for category slug:', props.slug);
  console.log('=== Category value for Firestore:', categoryValue.value);
  console.log('=== Languages:', selectedLanguages.value);
  
  // Use category value (not slug) for Firestore queries
  if (categoryValue.value) {
    await store.dispatch('jokes/fetchJokesByCategory', categoryValue.value);
  } else {
    console.error('Invalid category slug:', props.slug);
  }
  
  // Debug after loading
  console.log('=== After loading ===');
  console.log('Jokes in state:', store.state.jokes.jokes);
  console.log('Jokes count:', store.state.jokes.jokes.length);
};

// Watch for language changes from GLOBAL state
watch(selectedLanguages, () => {
  console.log('=== Languages changed, reloading category ===');
  loadJokes();
}, { deep: true });

// Watch for route changes
watch(() => props.slug, () => {
  loadJokes();
  // Update SEO when slug changes
  updateSEO({
    title: `${categoryName.value} Jokes - Humoraq`,
    description: `Browse all ${(categoryName.value || props.slug).toLowerCase()} jokes. Funny and entertaining content in multiple languages.`
  });
});

onMounted(() => {
  loadJokes();
  
  // Debug: Log current state
  console.log('🔍 Debug Info:');
  console.log('- Category slug:', props.slug);
  console.log('- Category data:', category.value);
  console.log('- Category value:', categoryValue.value);
  console.log('- Selected languages:', selectedLanguages.value);
  
  // Update SEO with safe fallbacks
  updateSEO({
    title: `${categoryName.value || 'Category'} Jokes - Humoraq`,
    description: `Browse all ${(categoryName.value || props.slug || 'category').toLowerCase()} jokes. Funny and entertaining content in multiple languages.`
  });
});
</script>

<style scoped>
/* No custom styles needed - using global styles */
</style>