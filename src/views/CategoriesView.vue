<template>
  <DefaultLayout>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <!-- Header - NO LANGUAGE SELECTOR -->
          <h1 class="display-5 mb-4">Browse by Category</h1>

          <div class="row g-4">
            <div v-for="category in categories" :key="category.slug" class="col-md-6 col-lg-4">
              <div class="card category-card h-100" @click="navigateToCategory(category.slug)">
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
  import { getCategories, getCategoryCount } from '../services/jokeService';
  import { updateSEO } from '../utils/seo';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';

  const router = useRouter();
  const store = useStore();

  // Get selected languages from GLOBAL state
  const selectedLanguages = computed(() => store.getters['preferences/selectedLanguages']);

  const categories = ref(getCategories());
  const categoryCounts = reactive({});

  const loadCounts = async () => {
    console.log('=== Loading counts for languages:', selectedLanguages.value);

    for (const category of categories.value) {
      let totalCount = 0;

      // Count for each selected language
      for (const language of selectedLanguages.value) {
        const count = await getCategoryCount(category.slug, language);
        totalCount += count;
      }

      categoryCounts[category.slug] = totalCount;
    }
  };

  const navigateToCategory = (slug) => {
    console.log('=== Navigating to category:', slug);
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
</style>