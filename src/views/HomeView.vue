<template>
  <DefaultLayout>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="text-center mb-4">
            <img 
              src="@/assets/logo.png" 
              alt="Humoraq Logo" 
              class="home-logo mb-3"
            />
            <h1 class="display-4 mb-3">Humoraq</h1>
            <p class="lead text-muted">Get your daily dose of laughter</p>
          </div>

          <CategoryFilter 
            v-model:category="currentCategory"
            @language-changed="handleLanguageChange"
          />

          <JokeCard 
            v-if="currentJoke" 
            :joke="currentJoke"
            class="mb-4"
          />

          <div class="text-center">
            <JokeButton 
              @click="loadRandomJoke"
              :loading="loading"
            />
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import JokeCard from '../components/JokeCard.vue';
import JokeButton from '../components/JokeButton.vue';
import CategoryFilter from '../components/CategoryFilter.vue';
import { updateSEO } from '../utils/seo';

const store = useStore();

// Local state for category only
const currentCategory = ref('');

// CRITICAL: Get all data from Vuex store
const currentJoke = computed(() => store.getters['jokes/currentJoke']);
const loading = computed(() => store.getters['jokes/loading']);
const selectedLanguage = computed(() => store.getters['preferences/selectedLanguage']);

// Load random joke
const loadRandomJoke = () => {
  // Set category in store
  store.dispatch('jokes/setCategory', currentCategory.value);
  // Fetch joke (will automatically use language from preferences)
  store.dispatch('jokes/fetchRandomJoke');
};

// Handle language change
const handleLanguageChange = () => {
  loadRandomJoke();
};

// CRITICAL: Watch for language changes from store
watch(selectedLanguage, (newLanguage, oldLanguage) => {
  if (newLanguage !== oldLanguage) {
    loadRandomJoke();
  }
});

// Watch for category changes
watch(currentCategory, () => {
  loadRandomJoke();
});

onMounted(() => {
  updateSEO({
    title: 'Humoraq - Random Jokes',
    description: 'Enjoy random jokes in multiple languages and categories. Get your daily dose of laughter!'
  });
  loadRandomJoke();
});
</script>

<style scoped>
.home-logo {
  height: 80px;
  width: auto;
  object-fit: contain;
}

@media (max-width: 576px) {
  .home-logo {
    height: 60px;
  }
}
</style>