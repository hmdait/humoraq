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
            v-model:language="currentLanguage"
            v-model:category="currentCategory"
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
import { onMounted, watch } from 'vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import JokeCard from '../components/JokeCard.vue';
import JokeButton from '../components/JokeButton.vue';
import CategoryFilter from '../components/CategoryFilter.vue';
import { useJokes } from '../composables/useJokes';
import { updateSEO } from '../utils/seo';

const { 
  currentJoke, 
  loading, 
  currentLanguage, 
  currentCategory,
  loadRandomJoke 
} = useJokes();

watch([currentLanguage, currentCategory], () => {
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