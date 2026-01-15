<template>
  <DefaultLayout>
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <!-- Header -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="display-5 mb-0">Jokes Feed</h1>
          </div>

          <!-- Feed Posts -->
          <div v-if="jokes.length > 0">
            <FeedPost v-for="joke in jokes" :key="joke.id" :joke="joke" />
          </div>

          <!-- Loading Indicator -->
          <div v-if="loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Loading more jokes...</p>
          </div>

          <!-- Load More Button -->
          <div v-if="hasMore && !loading" class="text-center py-4">
            <button @click="loadMore" class="btn btn-outline-primary">
              Load More Jokes
            </button>
          </div>

          <!-- End of Feed -->
          <div v-if="!hasMore && jokes.length > 0" class="text-center py-4">
            <p class="text-muted">🎉 You've reached the end of the feed!</p>
          </div>

          <!-- Empty State -->
          <div v-if="!loading && jokes.length === 0" class="text-center py-5">
            <div class="display-1 mb-3">😢</div>
            <h3>No jokes found</h3>
            <p class="text-muted">
              Try selecting more languages from the header or be the first to submit a joke!
            </p>
            <router-link to="/submit" class="btn btn-primary mt-3">
              Submit a Joke
            </router-link>
          </div>

          <!-- Scroll Sentinel -->
          <div ref="scrollSentinel" class="scroll-sentinel"></div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';
import FeedPost from '../components/FeedPost.vue';
import { getJokesFeedByLanguageInteraction } from '../services/jokeService'; // Updated import
import { updateSEO } from '../utils/seo';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const store = useStore();

const jokes = ref([]);
const loading = ref(false);
const hasMore = ref(true);
const lastDocs = ref({});
const scrollSentinel = ref(null);
const pageSize = 10;

let observer = null;

// Get selected languages from Vuex (GLOBAL STATE)
const selectedLanguages = computed(() => store.getters['preferences/selectedLanguages']);

const loadInitialJokes = async () => {
  console.log('=== Loading initial jokes for languages:', selectedLanguages.value);
  loading.value = true;
  jokes.value = [];
  lastDocs.value = {};
  hasMore.value = true;

  try {
    let allJokes = [];

    // Fetch for each selected language (ordered by updatedAt)
    for (const language of selectedLanguages.value) {
      const result = await getJokesFeedByLanguageInteraction(language, pageSize);
      allJokes = [...allJokes, ...result.jokes];
      lastDocs.value[language] = result.lastDoc;
    }

    // Sort by updatedAt (or createdAt as fallback) - most recent first
    allJokes.sort((a, b) => {
      const aTime = getSortTime(a);
      const bTime = getSortTime(b);
      return bTime - aTime;
    });

    jokes.value = allJokes.slice(0, pageSize);
    hasMore.value = allJokes.length >= pageSize;

    console.log('Loaded jokes:', jokes.value.length);
  } catch (error) {
    console.error('Error loading initial jokes:', error);
  } finally {
    loading.value = false;
  }
};

const loadMore = async () => {
  if (loading.value || !hasMore.value) return;

  console.log('=== Loading more jokes ===');
  loading.value = true;

  try {
    let allJokes = [];

    for (const language of selectedLanguages.value) {
      const result = await getJokesFeedByLanguageInteraction(
        language,
        pageSize,
        lastDocs.value[language]
      );
      allJokes = [...allJokes, ...result.jokes];
      lastDocs.value[language] = result.lastDoc;
    }

    // Sort by updatedAt/createdAt
    allJokes.sort((a, b) => {
      const aTime = getSortTime(a);
      const bTime = getSortTime(b);
      return bTime - aTime;
    });

    jokes.value = [...jokes.value, ...allJokes.slice(0, pageSize)];
    hasMore.value = allJokes.length >= pageSize;

    console.log('Total jokes:', jokes.value.length);
  } catch (error) {
    console.error('Error loading more jokes:', error);
  } finally {
    loading.value = false;
  }
};

/**
 * Get sort time with fallback
 * Priority: updatedAt > createdAt > 0
 */
const getSortTime = (joke) => {
  // Try updatedAt first (most recent interaction)
  if (joke.updatedAt && typeof joke.updatedAt.toMillis === 'function') {
    return joke.updatedAt.toMillis();
  }
  
  // Fallback to createdAt
  if (joke.createdAt && typeof joke.createdAt.toMillis === 'function') {
    return joke.createdAt.toMillis();
  }
  
  // Fallback to 0 if neither exists
  return 0;
};

// Watch for language changes from GLOBAL state
watch(selectedLanguages, () => {
  console.log('=== Languages changed, reloading feed ===');
  loadInitialJokes();
}, { deep: true });

const setupInfiniteScroll = () => {
  if (!scrollSentinel.value) return;

  const options = {
    root: null,
    rootMargin: '200px',
    threshold: 0
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && hasMore.value && !loading.value) {
        console.log('=== Scroll sentinel visible, loading more ===');
        loadMore();
      }
    });
  }, options);

  observer.observe(scrollSentinel.value);
};

const cleanupInfiniteScroll = () => {
  if (observer && scrollSentinel.value) {
    observer.unobserve(scrollSentinel.value);
    observer.disconnect();
  }
};

onMounted(async () => {
  updateSEO({
    title: 'Jokes Feed - Humoraq',
    description: 'Browse the latest and most popular jokes from the Humoraq community.'
  });

  await loadInitialJokes();
  setupInfiniteScroll();
});

onUnmounted(() => {
  cleanupInfiniteScroll();
});
</script>

<style scoped>
.scroll-sentinel {
  height: 1px;
  width: 100%;
}
</style>