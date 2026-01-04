<template>
  <DefaultLayout>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1 class="display-5 mb-4">Browse by Category</h1>
          
          <div class="mb-4">
            <label class="form-label fw-semibold">Select Language:</label>
            <select 
              v-model="selectedLanguage" 
              class="form-select"
              style="max-width: 200px;"
              @change="loadCounts"
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
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { useJokes } from '../composables/useJokes';
import { updateSEO } from '../utils/seo';

const router = useRouter();
const { categories, getCategoryCount, currentLanguage } = useJokes();
const selectedLanguage = ref('en');
const categoryCounts = reactive({});

const loadCounts = async () => {
  currentLanguage.value = selectedLanguage.value;
  for (const category of categories.value) {
    categoryCounts[category.slug] = await getCategoryCount(category.slug);
  }
};

const navigateToCategory = (slug) => {
  currentLanguage.value = selectedLanguage.value;
  router.push(`/category/${slug}`);
};

onMounted(async () => {
  updateSEO({
    title: 'Browse Joke Categories - Humoraq',
    description: 'Explore jokes by category: tech, work, animals, food, and more!'
  });
  selectedLanguage.value = currentLanguage.value;
  await loadCounts();
});
</script>