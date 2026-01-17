<template>
  <DefaultLayout>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <!-- Header -->
          <h1 class="display-5 mb-2">Browse by Category</h1>
          <p class="text-muted mb-4">
            Explore jokes from different categories
          </p>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading counts...</span>
            </div>
          </div>

          <!-- Categories Grid -->
          <div v-else class="row g-4">
            <div 
              v-for="category in categories" 
              :key="category.value" 
              class="col-md-6 col-lg-4"
            >
              <div 
                class="card category-card h-100" 
                @click="navigateToCategory(category.value)"
              >
                <div class="card-body text-center">
                  <div class="display-4 mb-3">{{ category.icon }}</div>
                  <h5 class="card-title">{{ category.label }}</h5>
                  <p class="card-text text-muted">
                    {{ categoryCounts[category.value] || 0 }} jokes
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
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { updateSEO } from '../utils/seo';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const router = useRouter();
const store = useStore();

// Get selected languages from GLOBAL state
const selectedLanguages = computed(() => store.getters['preferences/selectedLanguages']);

const loading = ref(false);

/**
 * Categories list
 */
const categories = ref([
  { value: 'General', label: 'General', icon: '😄' },
  { value: 'Relationships', label: 'Relationships', icon: '💑' },
  { value: 'Family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { value: 'Work', label: 'Work', icon: '💼' },
  { value: 'School', label: 'School', icon: '🎓' },
  { value: 'Friends', label: 'Friends', icon: '👥' },
  { value: 'Adult', label: 'Adult', icon: '🔞' },
  { value: 'Animals', label: 'Animals', icon: '🐶' },
  { value: 'Food', label: 'Food', icon: '🍕' },
  { value: 'Tech', label: 'Tech', icon: '💻' },
  { value: 'Sports', label: 'Sports', icon: '⚽' },
  { value: 'Old People', label: 'Old People', icon: '👴' },
  { value: 'Women', label: 'Women', icon: '👩' },
  { value: 'Men', label: 'Men', icon: '👨' }
]);

const categoryCounts = reactive({});

/**
 * FIXED: Count jokes using array-contains query
 * Firestore supports array-contains for querying arrays
 */
const loadCounts = async () => {
  loading.value = true;
  console.log('=== Loading counts for languages:', selectedLanguages.value);

  try {
    for (const category of categories.value) {
      let totalCount = 0;

      // Count for each selected language
      for (const language of selectedLanguages.value) {
        try {
          // FIXED: Use array-contains to query categories array
          const q = query(
            collection(db, 'jokes'),
            where('status', '==', 'published'),
            where('language', '==', language),
            where('categories', 'array-contains', category.value)
          );

          const snapshot = await getDocs(q);
          totalCount += snapshot.size;

          console.log(`Category ${category.value} (${language}): ${snapshot.size} jokes`);
        } catch (error) {
          console.error(`Error counting ${category.value} (${language}):`, error);
        }
      }

      categoryCounts[category.value] = totalCount;
      console.log(`Total for ${category.value}: ${totalCount}`);
    }
  } catch (error) {
    console.error('Error loading counts:', error);
  } finally {
    loading.value = false;
  }
};

const navigateToCategory = (categoryValue) => {
  console.log('=== Navigating to category:', categoryValue);
  router.push(`/category/${categoryValue}`);
};

// Watch for language changes from GLOBAL state
watch(selectedLanguages, () => {
  console.log('=== Languages changed, reloading counts ===');
  loadCounts();
}, { deep: true });

onMounted(async () => {
  updateSEO({
    title: 'Browse Joke Categories - Humoraq',
    description: 'Explore jokes by category: tech, work, animals, relationships, and more!'
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

.card-title {
  font-weight: 600;
  color: var(--text-color);
}

.card-text {
  font-size: 1.1rem;
}
</style>