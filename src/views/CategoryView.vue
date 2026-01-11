<template>
  <DefaultLayout>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <router-link to="/categories" class="btn btn-outline-secondary mb-4">
            ← Back to Categories
          </router-link>

          <!-- Header - NO LANGUAGE SELECTOR -->
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
  import JokeGrid from '../components/JokeGrid.vue';
  import { updateSEO } from '../utils/seo';
  import { getCategories } from '../services/jokeService';
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

  // Get category name
  const categoryName = computed(() => {
    const categories = getCategories();
    const category = categories.find(c => c.slug === props.slug);
    return category ? category.name : props.slug;
  });

  // Load jokes using GLOBAL state
  const loadJokes = () => {
    console.log('=== Loading jokes for category:', props.slug, 'languages:', selectedLanguages.value);
    store.dispatch('jokes/fetchJokesByCategory', props.slug);
  };

  // Watch for language changes from GLOBAL state
  watch(selectedLanguages, () => {
    console.log('=== Languages changed, reloading category ===');
    loadJokes();
  }, { deep: true });

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