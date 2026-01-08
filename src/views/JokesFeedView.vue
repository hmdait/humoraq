<template>
  <DefaultLayout>
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <!-- Header -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="display-5 mb-0">Jokes Feed</h1>
            <select 
              v-model="selectedLanguage"
              @change="handleLanguageChange"
              class="form-select"
              style="max-width: 150px;"
            >
              <option value="">All Languages</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          <!-- Feed Posts -->
          <div v-if="jokes.length > 0">
            <FeedPost 
              v-for="joke in jokes" 
              :key="joke.id"
              :joke="joke"
            />
          </div>

          <!-- Loading Indicator -->
          <div v-if="loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Loading more jokes...</p>
          </div>

          <!-- Load More Button (fallback if infinite scroll doesn't work) -->
          <div v-if="hasMore && !loading" class="text-center py-4">
            <button 
              @click="loadMore"
              class="btn btn-outline-primary"
            >
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
              {{ selectedLanguage ? 'Try selecting a different language' : 'Be the first to submit a joke!' }}
            </p>
            <router-link to="/submit" class="btn btn-primary mt-3">
              Submit a Joke
            </router-link>
          </div>

          <!-- Scroll Sentinel (for infinite scroll detection) -->
          <div ref="scrollSentinel" class="scroll-sentinel"></div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import FeedPost from '../components/FeedPost.vue';
import { getJokesFeed, getJokesFeedByLanguage } from '../services/jokeService';
import { updateSEO } from '../utils/seo';
import { trackFeedScroll } from '../services/analyticsService';

const jokes = ref([]);
const loading = ref(false);
const hasMore = ref(true);
const lastDoc = ref(null);
const selectedLanguage = ref('');
const scrollSentinel = ref(null);
const pageSize = 10;

// Intersection Observer for infinite scroll
let observer = null;

const loadInitialJokes = async () => {
  console.log('=== Loading initial jokes ===');
  loading.value = true;
  jokes.value = [];
  lastDoc.value = null;
  hasMore.value = true;

  try {
    const result = selectedLanguage.value
      ? await getJokesFeedByLanguage(selectedLanguage.value, pageSize)
      : await getJokesFeed(pageSize);

    jokes.value = result.jokes;
    lastDoc.value = result.lastDoc;
    hasMore.value = result.hasMore;

    console.log('Loaded jokes:', jokes.value.length);
    console.log('Has more:', hasMore.value);
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
    const result = selectedLanguage.value
      ? await getJokesFeedByLanguage(selectedLanguage.value, pageSize, lastDoc.value)
      : await getJokesFeed(pageSize, lastDoc.value);

    jokes.value = [...jokes.value, ...result.jokes];
    lastDoc.value = result.lastDoc;
    hasMore.value = result.hasMore;

    console.log('Total jokes:', jokes.value.length);
    console.log('Has more:', hasMore.value);

    //Track feed scroll
    trackFeedScroll(jokes.value.length, hasMore.value);
  } catch (error) {
    console.error('Error loading more jokes:', error);
  } finally {
    loading.value = false;
  }
};

const handleLanguageChange = () => {
  console.log('=== Language changed to:', selectedLanguage.value, '===');
  loadInitialJokes();
};

const setupInfiniteScroll = () => {
  if (!scrollSentinel.value) return;

  const options = {
    root: null,
    rootMargin: '200px', // Load more when sentinel is 200px from viewport
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
    description: 'Browse the latest jokes from the Humoraq community in a social feed format.'
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