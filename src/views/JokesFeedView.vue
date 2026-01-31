<template>
  <DefaultLayout>
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">

          <!-- Modern Hero -->
          <section class="hero-modern border-bottom">
            <div class="container py-5">
              <div class="row justify-content-center">
                <div class="col-lg-9 text-center">

                  <!-- Badge -->
                  <span class="hero-badge mb-3">
                    <i class="bi bi-emoji-laughing-fill me-1"></i> Updated Daily • Millions of Laughs
                  </span>

                  <!-- Title -->
                  <h1 class="hero-title fw-bold mb-4">
                    Updated daily with fresh jokes loved by millions of readers worldwide.
                  </h1>

                  <!-- Subtitle -->
                  <p class="hero-subtitle mb-5">
                    From <strong>dad jokes</strong> and <strong>kids jokes</strong> to
                    <strong>knock knock jokes</strong> and <strong>dark humor</strong>.
                    Discover the <strong>joke of the day</strong> loved by our global community.
                  </p>

                  <!-- Categories -->
                  <div class="hero-tags d-flex flex-wrap justify-content-center gap-3">

                    <router-link to="/category/family" class="hero-tag">
                      <i class="bi-people"></i> Dad Jokes
                    </router-link>

                    <router-link to="/category/kids" class="hero-tag">
                      <i class="bi-emoji-smile"></i> Kids Jokes
                    </router-link>

                    <router-link to="/category/general" class="hero-tag">
                      <i class="bi-chat-dots"></i> Knock Knock
                    </router-link>

                    <router-link to="/spotlight" class="hero-tag highlight">
                      <i class="bi-star-fill"></i> Joke of the Day
                    </router-link>

                  </div>

                  <!-- SEO Hidden -->
                  <p class="visually-hidden">
                    Best dad jokes, kids jokes, clean jokes, dark humor jokes,
                    knock knock jokes and daily funny jokes online.
                  </p>

                </div>
              </div>
            </div>
          </section>



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

/* ============================================
   MODERN HERO SECTION - Enhanced Styling
   ============================================ */

.hero-modern {
  position: relative;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.08) 0%,
    rgba(118, 75, 162, 0.06) 50%,
    rgba(13, 110, 253, 0.05) 100%
  );
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* Animated background gradient */
.hero-modern::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(102, 126, 234, 0.15) 0%,
    transparent 50%
  );
  animation: float 15s ease-in-out infinite;
  pointer-events: none;
}

.hero-modern::after {
  content: '';
  position: absolute;
  bottom: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(118, 75, 162, 0.12) 0%,
    transparent 50%
  );
  animation: float 20s ease-in-out infinite reverse;
  pointer-events: none;
}

/* Ensure content is above background */
.hero-modern .container {
  position: relative;
  z-index: 1;
}

/* Badge styling with glassmorphic effect */
.hero-badge {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(102, 126, 234, 0.2);
  color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  animation: fadeInDown 0.6s ease-out;
  transition: all 0.3s ease;
}

.hero-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
}

.hero-badge i {
  font-size: 1rem;
  vertical-align: -1px;
  animation: pulse 2s ease-in-out infinite;
}

/* Title styling */
.hero-title {
  font-size: clamp(2rem, 5vw, 3.25rem);
  line-height: 1.2;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
  animation: slideInDown 0.8s ease-out;
  animation-fill-mode: both;
  letter-spacing: -0.02em;
}

/* Subtitle styling */
.hero-subtitle {
  font-size: 1.15rem;
  line-height: 1.7;
  color: var(--bs-secondary-color, #6c757d);
  max-width: 720px;
  margin: 0 auto 2rem;
  animation: fadeInUp 1s ease-out;
  animation-fill-mode: both;
}

.hero-subtitle strong {
  color: #667eea;
  font-weight: 600;
  position: relative;
  transition: color 0.3s ease;
}

/* Tags container */
.hero-tags {
  margin-top: 2rem;
  animation: fadeInUp 1.2s ease-out;
  animation-fill-mode: both;
}

/* Individual tag styling */
.hero-tag {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.3rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1.5px solid rgba(102, 126, 234, 0.15);
  color: #495057;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* Tag hover effect with expanding gradient */
.hero-tag::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
  z-index: 0;
}

.hero-tag:hover::before {
  width: 300%;
  height: 300%;
}

.hero-tag i,
.hero-tag span {
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}

.hero-tag:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25);
  border-color: #667eea;
  color: #fff;
}

.hero-tag:hover i,
.hero-tag:hover span {
  color: #fff;
}

/* Highlighted tag (Joke of the Day) */
.hero-tag.highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: #fff;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  animation: glow 2s ease-in-out infinite;
}

.hero-tag.highlight::before {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.hero-tag.highlight:hover {
  box-shadow: 0 8px 28px rgba(102, 126, 234, 0.4);
  transform: translateY(-4px) scale(1.08);
}

.hero-tag.highlight i {
  animation: sparkle 1.5s ease-in-out infinite;
}

/* Dark mode adjustments */
.dark-mode .hero-modern {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.12) 0%,
    rgba(118, 75, 162, 0.08) 50%,
    rgba(13, 110, 253, 0.06) 100%
  );
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.dark-mode .hero-badge {
  background: rgba(28, 32, 36, 0.9);
  border-color: rgba(102, 126, 234, 0.3);
  color: #9ec5fe;
}

.dark-mode .hero-title {
  background: linear-gradient(135deg, #9ec5fe 0%, #d4a5ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark-mode .hero-subtitle {
  color: #adb5bd;
}

.dark-mode .hero-subtitle strong {
  color: #9ec5fe;
}

.dark-mode .hero-tag {
  background: rgba(28, 32, 36, 0.9);
  border-color: rgba(102, 126, 234, 0.2);
  color: #f8f9fa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.dark-mode .hero-tag:hover {
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.35);
}

.dark-mode .hero-tag.highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

/* ============================================
   ANIMATIONS
   ============================================ */

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(5deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(-5deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  }
  50% {
    box-shadow: 0 4px 24px rgba(102, 126, 234, 0.5);
  }
}

@keyframes sparkle {
  0%, 100% {
    transform: rotate(0deg) scale(1);
  }
  25% {
    transform: rotate(-10deg) scale(1.1);
  }
  75% {
    transform: rotate(10deg) scale(1.1);
  }
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */

@media (max-width: 768px) {
  .hero-modern {
    padding: 2rem 0;
  }

  .hero-badge {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
  }

  .hero-title {
    font-size: clamp(1.75rem, 6vw, 2.5rem);
    margin-bottom: 1.25rem;
  }

  .hero-subtitle {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .hero-tags {
    gap: 0.5rem !important;
  }

  .hero-tag {
    padding: 0.6rem 1rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 576px) {
  .hero-badge {
    font-size: 0.75rem;
  }

  .hero-title {
    font-size: clamp(1.5rem, 7vw, 2rem);
    line-height: 1.3;
  }

  .hero-subtitle {
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .hero-tags {
    gap: 0.4rem !important;
  }

  .hero-tag {
    padding: 0.55rem 0.9rem;
    font-size: 0.825rem;
    gap: 0.4rem;
  }

  .hero-tag i {
    font-size: 0.9rem;
  }
}

/* ============================================
   ACCESSIBILITY
   ============================================ */

@media (prefers-reduced-motion: reduce) {
  .hero-modern::before,
  .hero-modern::after,
  .hero-badge,
  .hero-title,
  .hero-subtitle,
  .hero-tags,
  .hero-tag,
  .hero-tag::before,
  .hero-badge i,
  .hero-tag.highlight i {
    animation: none !important;
    transition: none !important;
  }
}

</style>