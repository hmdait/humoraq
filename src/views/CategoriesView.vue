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
                  <!-- Bootstrap Icon with gradient background -->
                  <div class="category-icon-wrapper mb-3">
                    <i :class="['bi', category.icon, 'category-icon']"></i>
                  </div>
                  <h5 class="card-title">{{ category.label }}</h5>
                  <p class="card-text text-muted mb-2">
                    <strong>{{ categoryCounts[category.value] || 0 }}</strong> jokes
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

const selectedLanguages = computed(() => store.getters['preferences/selectedLanguages']);

const categories = ref(getAllCategories());
const categoryCounts = reactive({});

const loadCounts = async () => {
  console.log('=== Loading counts for languages:', selectedLanguages.value);
  console.time('⏱️ Category counts load time');

  try {
    const categoryValues = getAllCategoryValues();
    console.log('Querying for categories:', categoryValues);
    
    const counts = await getBatchCategoryCounts(categoryValues, selectedLanguages.value);
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
  border: 2px solid transparent;
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: rgba(13, 110, 253, 0.3);
}

.dark-mode .category-card:hover {
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.1);
  border-color: rgba(13, 110, 253, 0.5);
}

/* Modern Icon Wrapper */
.category-icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.1), rgba(13, 110, 253, 0.05));
  border-radius: 20px;
  transition: all 0.3s ease;
}

.category-card:hover .category-icon-wrapper {
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.2), rgba(13, 110, 253, 0.1));
  transform: scale(1.1);
}

.category-icon {
  font-size: 2.5rem;
  color: #0d6efd;
  transition: all 0.3s ease;
}

.category-card:hover .category-icon {
  color: #0a58ca;
  transform: scale(1.05);
}

/* Dark Mode Icon Styling */
.dark-mode .category-icon-wrapper {
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.15), rgba(13, 110, 253, 0.08));
}

.dark-mode .category-card:hover .category-icon-wrapper {
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.25), rgba(13, 110, 253, 0.15));
}

.dark-mode .category-icon {
  color: #6ea8fe;
}

.dark-mode .category-card:hover .category-icon {
  color: #9ec5fe;
}

.card-title {
  font-weight: 600;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.card-text {
  font-weight: 500;
}

.card-text strong {
  color: #0d6efd;
  font-size: 1.1rem;
}

.dark-mode .card-text strong {
  color: #6ea8fe;
}

small.text-muted {
  font-size: 0.85rem;
  line-height: 1.4;
  display: block;
  margin-top: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .category-icon-wrapper {
    width: 70px;
    height: 70px;
  }
  
  .category-icon {
    font-size: 2rem;
  }
}
</style>