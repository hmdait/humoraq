<template>
  <DefaultLayout>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <router-link to="/categories" class="btn btn-outline-secondary mb-4">
            ← Back to Categories
          </router-link>

          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="display-5">
              {{ categoryName }} Jokes
            </h1>
            <select 
              :value="selectedLanguage"
              @change="handleLanguageChange"
              class="form-select"
              style="max-width: 150px;"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          <!-- Loading state -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <!-- Jokes grid -->
          <JokeGrid 
            v-else-if="jokes.length > 0"
            :jokes="jokes"
            :preview-length="120"
          />

          <!-- Empty state -->
          <div v-else class="alert alert-info">
            No jokes found in this category for the selected language.
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import JokeGrid from '../components/JokeGrid.vue';
import { updateSEO } from '../utils/seo';
import { getCategories } from '../services/jokeService';

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
});

const store = useStore();

// CRITICAL: Get all data from Vuex store
const jokes = computed(() => store.getters['jokes/jokes']);
const loading = computed(() => store.getters['jokes/loading']);
const selectedLanguage = computed(() => store.getters['preferences/selectedLanguage']);

// Get category name
const categoryName = computed(() => {
  const categories = getCategories();
  const category = categories.find(c => c.slug === props.slug);
  return category ? category.name : props.slug;
});

// CRITICAL: Update Vuex store on language change
const handleLanguageChange = (event) => {
  store.dispatch('preferences/setLanguage', event.target.value);
};

// Load jokes
const loadJokes = () => {
  store.dispatch('jokes/fetchJokesByCategory', props.slug);
};

// CRITICAL: Watch for language changes from store
watch(selectedLanguage, (newLanguage, oldLanguage) => {
  if (newLanguage !== oldLanguage) {
    loadJokes();
  }
});

// Watch for route changes
watch(() => props.slug, () => {
  loadJokes();
});

onMounted(() => {
  loadJokes();
  updateSEO({
    title: `${categoryName.value} Jokes - Humoraq`,
    description: `Browse all ${categoryName.value.toLowerCase()} jokes. Funny and entertaining content in multiple languages.`
  });
});
</script>