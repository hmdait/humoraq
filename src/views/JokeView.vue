<template>
  <DefaultLayout>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <router-link to="/" class="btn btn-outline-secondary mb-4">
            ← Back to Home
          </router-link>

          <JokeCard 
            v-if="currentJoke" 
            :joke="currentJoke"
            :show-link="false"
            class="mb-4"
          />

          <div v-else-if="!loading" class="alert alert-warning">
            Joke not found
          </div>

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <div v-if="currentJoke" class="text-center">
            <JokeButton 
              @click="loadRandomJoke"
              text="Get Another Joke"
            />
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import JokeCard from '../components/JokeCard.vue';
import JokeButton from '../components/JokeButton.vue';
import { updateSEO } from '../utils/seo';

const router = useRouter();
const route = useRoute();
const store = useStore();

// CRITICAL: Get data from Vuex store
const currentJoke = computed(() => store.getters['jokes/currentJoke']);
const loading = computed(() => store.getters['jokes/loading']);
const selectedLanguage = computed(() => store.getters['preferences/selectedLanguage']);

// Load random joke
const loadRandomJoke = async () => {  
  // CRITICAL: Clear category before fetching random joke
  await store.dispatch('jokes/setCategory', '');
  
  // CRITICAL: Fetch joke using Vuex (will use language from preferences)
  await store.dispatch('jokes/fetchRandomJoke');
  
  // Navigate to the new joke if one was loaded
  if (currentJoke.value) {
    router.push(`/joke/${currentJoke.value.id}`);
  }
};

// Load joke by ID
const loadJokeById = async (jokeId) => {
  await store.dispatch('jokes/fetchJokeById', jokeId);
};

// Watch for route param changes
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await loadJokeById(String(newId));
      
      // Update SEO after joke is loaded
      if (currentJoke.value && currentJoke.value.text) {
        updateSEO({
          title: `Joke - Humoraq`,
          description: currentJoke.value.text.substring(0, 150)
        });
      }
    }
  },
  { immediate: true }
);

onMounted(() => {
  updateSEO({
    title: 'Joke - Humoraq',
    description: 'View and enjoy jokes from Humoraq'
  });
});
</script>