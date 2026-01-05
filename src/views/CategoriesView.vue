<template>
  <DefaultLayout>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1 class="display-5 mb-4">Browse by Category</h1>
          
          <div class="mb-4">
            <label class="form-label fw-semibold">Select Language:</label>
            <select 
              :value="selectedLanguage"
              @change="handleLanguageChange"
              class="form-select"
              style="max-width: 200px;"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          <div class="row g-4">
            <div 
              v-for="category in categories" 
              :key="category.slug"
              class="col-md-6 col-lg-4"
            >
              <div 
                class="card category-card h-100"
                @click="navigateToCategory(category.slug)"
              >
                <div class="card-body text-center">
                  <div class="display-4 mb-3">{{ category.icon }}</div>
                  <h5 class="card-title">{{ category.name }}</h5>
                  <p class="card-text text-muted">
                    {{ categoryCounts[category.slug] || 0 }} jokes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { getCategories, getCategoryCount } from '../services/jokeService';
import { updateSEO } from '../utils/seo';

const router = useRouter();
const store = useStore();

// CRITICAL: Get language from Vuex store
const selectedLanguage = computed(() => store.getters['preferences/selectedLanguage']);
const categories = ref(getCategories());
const categoryCounts = reactive({});

// CRITICAL: Update Vuex store on language change
const handleLanguageChange = (event) => {
  store.dispatch('preferences/setLanguage', event.target.value);
};

const loadCounts = async () => {
  for (const category of categories.value) {
    categoryCounts[category.slug] = await getCategoryCount(category.slug, selectedLanguage.value);
  }
};

const navigateToCategory = (slug) => {
  router.push(`/category/${slug}`);
};

// CRITICAL: Watch for language changes from store
watch(selectedLanguage, () => {
  loadCounts();
});

onMounted(async () => {
  updateSEO({
    title: 'Browse Joke Categories - Humoraq',
    description: 'Explore jokes by category: tech, work, animals, food, and more!'
  });
  await loadCounts();
});
</script>