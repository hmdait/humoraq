<template>
  <DefaultLayout>
    <div class="container">
      <div class="row">
        <div class="col-12">

          <!-- Categories Header -->
          <div class="categories-hero border-bottom mb-4">
            <div class="container py-4">
              <div class="row">
                <div class="col-lg-9 mx-auto text-center">

                  <h1 class="display-5 fw-bold mb-3">
                    {{ t('categories.hero.title') }}
                  </h1>

                  <p class="lead text-muted mb-0" v-html="t('categories.hero.description')"></p>
                  
                  <p class="small text-muted mt-3">
                    {{ t('categories.hero.updated') }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Categories Grid -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{{ t('categories.loading') }}</span>
            </div>
          </div>

          <div v-else-if="categories.length === 0" class="text-center py-5">
            <p class="text-muted">{{ t('categories.empty') }}</p>
          </div>

          <div v-else class="row g-4">
            <div 
              v-for="category in categories" 
              :key="category.slug"
              class="col-md-6 col-lg-4"
            >
              <router-link 
                :to="`/category/${category.slug}`"
                class="text-decoration-none"
              >
                <div class="card category-card h-100 border-0 shadow-sm">
                  <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                      <div class="category-icon me-3">
                        <i :class="category.icon"></i>
                      </div>
                      <h3 class="card-title h5 mb-0">{{ t(`categoryNames.${category.value}`) }}</h3>
                    </div>
                    <p class="card-text text-muted">{{ t(`categories.descriptions.${category.value}`) }}</p>
                    <div class="mt-3">
                      <span class="badge bg-primary">
                        {{ categoryCounts[category.value] || 0 }} {{ t('categories.jokesCount') }}
                      </span>
                    </div>
                  </div>
                </div>
              </router-link>
            </div>
          </div>

        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { getAllCategories, getAllCategoryValues } from '@/config/categories';
import { getBatchCategoryCounts } from '@/services/jokeService';
import { useStore } from 'vuex';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { t, currentLanguage } from '@/i18n';
import { updateDynamicSEO } from '@/utils/dynamicSEO';

const store = useStore();
const categories = ref([]);
const categoryCounts = ref({});
const loading = ref(true);

// Get selected languages from Vuex
const selectedLanguages = computed(() => store.getters['preferences/selectedLanguages']);

const loadCounts = async () => {
  loading.value = true;
  
  console.log('🚀 Loading category counts for languages:', selectedLanguages.value);
  console.time('⏱️ Category counts load time');
  
  try {
    categories.value = getAllCategories();
    const categoryValues = getAllCategoryValues();
    
    // ✅ OPTIMIZED: Single batch call - executes all queries in parallel
    const counts = await getBatchCategoryCounts(categoryValues, selectedLanguages.value);
    categoryCounts.value = counts;
    
    console.log('✅ Category counts loaded:', counts);
  } catch (error) {
    console.error('❌ Error loading category counts:', error);
  } finally {
    loading.value = false;
    console.timeEnd('⏱️ Category counts load time');
  }
};

// SEO update function
const updateCategoriesSEO = () => {
  const lang = currentLanguage.value;
  
  updateDynamicSEO({
    title: t('seo.categoriesTitle', lang),
    description: t('seo.categoriesDescription', lang),
    keywords: t('seo.categoriesKeywords', lang),
    lang: lang,
    ogLocale: lang === 'en' ? 'en_US' : lang === 'fr' ? 'fr_FR' : lang === 'es' ? 'es_ES' : 'ar_AR'
  });
};

// Watch for language changes
watch(currentLanguage, updateCategoriesSEO);

// Watch for selected languages changes to reload counts
watch(selectedLanguages, () => {
  loadCounts();
}, { deep: true });

onMounted(async () => {
  updateCategoriesSEO();
  await loadCounts();
});
</script>

<style scoped>
/* Categories Hero Section */
.categories-hero {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.03), rgba(118, 75, 162, 0.03));
  border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
  position: relative;
  overflow: hidden;
}

.categories-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
  opacity: 0.6;
}

.dark-mode .categories-hero {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
  border-bottom-color: rgba(255, 255, 255, 0.08) !important;
}

.categories-hero .display-5 {
  color: var(--text-color, #0f1419);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  position: relative;
}

.categories-hero .display-5::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
}

.categories-hero .lead {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #536471;
  max-width: 700px;
  margin: 0 auto 1rem;
}

.dark-mode .categories-hero .lead {
  color: #71767b;
}

.categories-hero .lead strong {
  color: #667eea;
  font-weight: 600;
  position: relative;
  padding: 0 0.15rem;
}

.dark-mode .categories-hero .lead strong {
  color: #9ec5fe;
}

.categories-hero .small {
  font-size: 0.9375rem;
  color: #6c757d;
  font-style: italic;
}

.dark-mode .categories-hero .small {
  color: #adb5bd;
}

/* Category Cards */
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

.category-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .categories-hero .display-5 {
    font-size: 2rem;
  }
  
  .categories-hero .lead {
    font-size: 1rem;
  }
}

@media (max-width: 576px) {
  .categories-hero .display-5 {
    font-size: 1.75rem;
  }
  
  .categories-hero .lead {
    font-size: 0.9375rem;
  }
}
</style>