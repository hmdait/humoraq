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
import { trackJokeView } from '../services/analyticsService'; // ADD THIS

const router = useRouter();
const route = useRoute();
const store = useStore();

const currentJoke = computed(() => store.getters['jokes/currentJoke']);
const loading = computed(() => store.getters['jokes/loading']);
const selectedLanguage = computed(() => store.getters['preferences/selectedLanguage']);

const loadRandomJoke = async () => {
  console.log('=== JokeView: loadRandomJoke called ===');
  console.log('JokeView: Current language:', selectedLanguage.value);
  
  await store.dispatch('jokes/setCategory', '');
  await store.dispatch('jokes/fetchRandomJoke');
  
  if (currentJoke.value) {
    router.push(`/joke/${currentJoke.value.id}`);
  }
};

const loadJokeById = async (jokeId) => {
  console.log('=== JokeView: loadJokeById called ===');
  console.log('JokeView: Loading joke ID:', jokeId);
  
  await store.dispatch('jokes/fetchJokeById', jokeId);
  
  // ADD THIS: Track joke view
  if (currentJoke.value) {
    trackJokeView(
      currentJoke.value.id, 
      currentJoke.value.category, 
      currentJoke.value.language
    );
  }
};

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await loadJokeById(String(newId));
      
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