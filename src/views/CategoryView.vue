<template>
  <DefaultLayout>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <router-link to="/categories" class="btn btn-outline-secondary mb-4">
            ← Back to Categories
          </router-link>

          <!-- Header -->
          <h1 class="display-5 mb-4">
            {{ categoryLabel }} Jokes
          </h1>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <!-- Jokes Grid -->
          <JokeGrid 
            v-else-if="jokes.length > 0" 
            :jokes="jokes" 
            :preview-length="120" 
          />

          <!-- Empty State -->
          <div v-else class="alert alert-info">
            <strong>No jokes found in this category.</strong>
            <p class="mb-0 mt-2">
              Try selecting more languages from the header, or 
              <router-link to="/submit">submit a joke</router-link> in this category!
            </p>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useStore } from 'vuex';
import JokeGrid from '../components/JokeGrid.vue';
import { updateSEO } from '../utils/seo';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
});

const store = useStore();

// Local state
const jokes = ref([]);
const loading = ref(false);

// Get selected languages from GLOBAL state
const selectedLanguages = computed(() => store.getters['preferences/selectedLanguages']);

/**
 * Map category slug to label
 */
const categoryLabel = computed(() => {
  const categoryMap = {
    'General': 'General',
    'Relationships': 'Relationships',
    'Family': 'Family',
    'Work': 'Work',
    'School': 'School',
    'Friends': 'Friends',
    'Adult': 'Adult',
    'Animals': 'Animals',
    'Food': 'Food',
    'Tech': 'Tech',
    'Sports': 'Sports',
    'Old People': 'Old People',
    'Women': 'Women',
    'Men': 'Men'
  };
  return categoryMap[props.slug] || props.slug;
});

/**
 * FIXED: Load jokes using array-contains query
 * Firestore can query arrays with 'array-contains'
 */
const loadJokes = async () => {
  loading.value = true;
  console.log('=== Loading jokes for category:', props.slug, 'languages:', selectedLanguages.value);
  
  try {
    let allJokes = [];

    // Fetch jokes for each selected language
    for (const language of selectedLanguages.value) {
      try {
        // FIXED: Use array-contains to query categories array
        const q = query(
          collection(db, 'jokes'),
          where('status', '==', 'published'),
          where('language', '==', language),
          where('categories', 'array-contains', props.slug)
        );

        const snapshot = await getDocs(q);
        
        const languageJokes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        allJokes = [...allJokes, ...languageJokes];

        console.log(`Found ${languageJokes.length} jokes for ${props.slug} (${language})`);
      } catch (error) {
        console.error(`Error loading jokes for ${language}:`, error);
      }
    }

    // Sort by createdAt (newest first)
    allJokes.sort((a, b) => {
      const aTime = a.createdAt && typeof a.createdAt.toMillis === 'function' 
        ? a.createdAt.toMillis() 
        : 0;
      const bTime = b.createdAt && typeof b.createdAt.toMillis === 'function' 
        ? b.createdAt.toMillis() 
        : 0;
      return bTime - aTime;
    });

    jokes.value = allJokes;
    
    console.log('=== Total jokes loaded:', jokes.value.length);
  } catch (error) {
    console.error('Error loading jokes:', error);
    jokes.value = [];
  } finally {
    loading.value = false;
  }
};

// Watch for language changes
watch(selectedLanguages, () => {
  console.log('=== Languages changed, reloading category ===');
  loadJokes();
}, { deep: true });

// Watch for route changes (different category)
watch(() => props.slug, () => {
  loadJokes();
  updateSEO({
    title: `${categoryLabel.value} Jokes - Humoraq`,
    description: `Browse all ${categoryLabel.value.toLowerCase()} jokes. Funny and entertaining content in multiple languages.`
  });
});

onMounted(() => {
  loadJokes();
  
  updateSEO({
    title: `${categoryLabel.value} Jokes - Humoraq`,
    description: `Browse all ${categoryLabel.value.toLowerCase()} jokes. Funny and entertaining content in multiple languages.`
  });
});
</script>

<style scoped>
.alert {
  border-radius: 8px;
}

.alert a {
  font-weight: 600;
  text-decoration: underline;
}
</style>