<template>
  <DefaultLayout>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <!-- Header -->
          <h1 class="display-5 mb-4">Browse by Category</h1>

          <div class="row g-4">
            <div v-for="category in categories" :key="category.slug" class="col-md-6 col-lg-4">
              <div class="card category-card h-100" @click="navigateToCategory(category.slug)">
                <div class="card-body text-center">
                  <div class="display-4 mb-3">{{ category.icon }}</div>
                  <h5 class="card-title">{{ category.label }}</h5>
                  <p class="card-text text-muted mb-2">
                    {{ categoryCounts[category.value] || 0 }} jokes
                  </p>
                  <small class="text-muted" v-if="category.description">
                    {{ category.description }}
                  </small>
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
import { getAllCategories, getAllCategoryValues } from '@/config/categories';
import { getBatchCategoryCounts } from '../services/jokeService';
import { updateSEO } from '../utils/seo';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const router = useRouter();
const store = useStore();

// Get selected languages from GLOBAL state
const selectedLanguages = computed(() => store.getters['preferences/selectedLanguages']);

// Get categories from centralized config
const categories = ref(getAllCategories());
const categoryCounts = reactive({});

/**
 * OPTIMIZED: Batch load all category counts at once
 * Uses array-contains queries for categories array field
 */
const loadCounts = async () => {
  console.log('=== Loading counts for languages:', selectedLanguages.value);
  console.time('⏱️ Category counts load time');

  try {
    // Get all category values from config
    const categoryValues = getAllCategoryValues();
    
    console.log('Querying for categories:', categoryValues);
    
    // Batch fetch all counts (optimized: 3 queries instead of 42)
    const counts = await getBatchCategoryCounts(categoryValues, selectedLanguages.value);
    
    // Update reactive object with all results
    Object.assign(categoryCounts, counts);

    console.log('✅ Category counts loaded:', counts);
  } catch (error) {
    console.error('❌ Error loading category counts:', error);
  } finally {
    console.timeEnd('⏱️ Category counts load time');
  }
};

const navigateToCategory = (slug) => {
  console.log('=== Navigating to category slug:', slug);
  router.push(`/category/${slug}`);
};

// Watch for language changes from GLOBAL state
watch(selectedLanguages, () => {
  console.log('=== Languages changed, reloading counts ===');
  loadCounts();
}, { deep: true });

onMounted(async () => {
  updateSEO({
    title: 'Browse Joke Categories - Humoraq',
    description: 'Explore jokes by category: tech, work, animals, food, and more!'
  });
  
  await loadCounts();
});
</script>

<style scoped>
.category-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dark-mode .category-card:hover {
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

.card-text.text-muted {
  font-weight: 500;
}

small.text-muted {
  font-size: 0.85rem;
  line-height: 1.4;
}
</style>