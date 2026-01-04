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
              @click="handleGetAnother"
              text="Get Another Joke"
            />
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import JokeCard from '../components/JokeCard.vue';
import JokeButton from '../components/JokeButton.vue';
import { useJokes } from '../composables/useJokes';
import { updateSEO } from '../utils/seo';

const router = useRouter();
const route = useRoute();

// Get the composable with all its refs and methods
const { 
  currentJoke, 
  loading, 
  loadJokeById, 
  loadRandomJoke 
} = useJokes();

// Handle "Get Another Joke" button
const handleGetAnother = async () => {
  await loadRandomJoke();
  if (currentJoke.value) {
    router.push(`/joke/${currentJoke.value.id}`);
  }
};

// Watch route changes to load the joke
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