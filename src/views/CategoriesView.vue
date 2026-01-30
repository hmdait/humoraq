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
                    Browse Funny Jokes by Category
                  </h1>

                  <p class="lead text-muted mb-0">
                    Looking for <strong>dad jokes</strong>, <strong>jokes for kids</strong>,
                    or classic <strong>knock knock jokes</strong>?
                    Explore thousands of jokes organized into easy-to-browse categories —
                    from family-friendly <strong>kids jokes</strong> to bold
                    <strong>dark humor jokes</strong>.
                  </p>
                  <p class="small text-muted mt-3">
                    Updated daily with new jokes across all categories.
                  </p>
                  <p class="visually-hidden">
                    Funny jokes categories including dad jokes, kids jokes, clean jokes,
                    dark humor jokes, knock knock jokes, holiday jokes, and joke of the day.
                  </p>

                </div>
              </div>
            </div>
          </div>





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
      title: 'Browse Funny Jokes by Category | Dad Jokes, Kids Jokes & More',
      description: 'Explore our joke categories! Find dad jokes, jokes for kids, knock knock jokes, work humor, tech jokes, and dark humor. Thousands of jokes organized for easy browsing.',
      keywords: 'funny jokes categories, dad jokes, kids jokes, knock knock jokes, work jokes, tech humor, dark jokes, joke categories'
    });

    await loadCounts();
  });
</script>

<style scoped>
  
  /* ============================================
   CATEGORIES HERO SECTION (SEO OPTIMIZED)
   ============================================ */
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

/* Animated gradient on hover (subtle effect) */
@media (hover: hover) {
  .categories-hero .lead strong {
    transition: all 0.3s ease;
  }
  
  .categories-hero .lead strong:hover {
    color: #764ba2;
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 3px;
  }
  
  .dark-mode .categories-hero .lead strong:hover {
    color: #6ea8fe;
  }
}

/* Responsive typography */
@media (max-width: 768px) {
  .categories-hero .display-5 {
    font-size: 2rem;
  }
  
  .categories-hero .lead {
    font-size: 1rem;
  }
  
  .categories-hero .display-5::after {
    width: 60px;
    height: 3px;
  }
}

@media (max-width: 576px) {
  .categories-hero .display-5 {
    font-size: 1.75rem;
  }
  
  .categories-hero .lead {
    font-size: 0.9375rem;
  }
  
  .categories-hero .py-4 {
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
  }
}

/* ============================================
   CATEGORY CARDS
   ============================================ */
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