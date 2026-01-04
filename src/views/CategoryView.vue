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
              v-model="currentLanguage" 
              class="form-select"
              style="max-width: 150px;"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          <div v-if="jokes.length > 0" class="row g-4">
            <div 
              v-for="joke in jokes" 
              :key="joke.id"
              class="col-md-6 col-lg-4"
            >
              <JokeCard :joke="joke" />
            </div>
          </div>

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
import DefaultLayout from '../layouts/DefaultLayout.vue';
import JokeCard from '../components/JokeCard.vue';
import { useJokes } from '../composables/useJokes';
import { updateSEO } from '../utils/seo';

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
});

const { jokes, currentLanguage, loadJokesByCategory, getCategoryName } = useJokes();

const categoryName = computed(() => getCategoryName(props.slug));

watch([() => props.slug, currentLanguage], () => {
  loadJokesByCategory(props.slug);
});

onMounted(() => {
  loadJokesByCategory(props.slug);
  updateSEO({
    title: `${categoryName.value} Jokes - Humoraq`,
    description: `Browse all ${categoryName.value.toLowerCase()} jokes. Funny and entertaining content in multiple languages.`
  });
});
</script>