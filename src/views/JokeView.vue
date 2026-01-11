<template>
  <DefaultLayout>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <router-link to="/" class="btn btn-outline-secondary mb-4">
            ← Back to Feed
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

          <!-- Actions Section -->
          <div v-if="currentJoke" class="text-center mb-4">
            <JokeButton 
              @click="loadRandomJoke"
              text="Get Another Joke"
            />
          </div>

          <!-- Call-to-Action Section -->
          <div v-if="currentJoke" class="cta-section">
            <div class="card border-primary shadow-sm">
              <div class="card-body text-center p-4">
                <h5 class="card-title mb-3">
                  Got a joke to share? 😄
                </h5>
                <p class="card-text text-muted mb-3">
                  Make someone laugh today! Share your favorite joke with our community.
                </p>
                <router-link 
                  to="/submit" 
                  class="btn btn-primary btn-lg"
                >
                  ✍️ Share Your Favorite Joke
                </router-link>
              </div>
            </div>
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
import { trackJokeView } from '../services/analyticsService';

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

<style scoped>
/* CTA Section Styling */
.cta-section {
  margin-top: 2rem;
  animation: fadeInUp 0.5s ease;
}

.cta-section .card {
  border-width: 2px;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

.cta-section .card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(13, 110, 253, 0.2) !important;
}

.cta-section .card-title {
  font-weight: 600;
  color: var(--text-color);
}

.cta-section .btn {
  min-width: 200px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.cta-section .btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
}

/* Dark mode support */
.dark-mode .cta-section .card {
  background-color: var(--card-bg);
  border-color: var(--primary-color);
}

.dark-mode .cta-section .card:hover {
  box-shadow: 0 8px 25px rgba(13, 110, 253, 0.3) !important;
}

/* Fade-in animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .cta-section .btn {
    min-width: 100%;
    font-size: 0.95rem;
  }

  .cta-section .card-body {
    padding: 1.5rem !important;
  }
}
</style>