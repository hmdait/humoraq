<template>
  <DefaultLayout>
    <!-- Full-width Hero Section -->
    <section class="hero-modern">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-9 text-center">
            <!-- Badge -->
            <div class="hero-badge-wrapper mb-3" data-aos="fade-down">
              <span class="hero-badge">
                <i class="bi bi-emoji-laughing-fill me-1"></i> 
                <span class="badge-text">Updated Daily • Millions of Laughs</span>
              </span>
            </div>

            <!-- Title -->
            <h1 class="hero-title fw-bold mb-4" data-aos="fade-up" data-aos-delay="100">
              Updated daily with fresh jokes loved by millions of readers worldwide.
            </h1>

            <!-- Subtitle -->
            <p class="hero-subtitle mb-5" data-aos="fade-up" data-aos-delay="200">
              From <strong>dad jokes</strong> and <strong>kids jokes</strong> to
              <strong>knock knock jokes</strong> and <strong>dark humor</strong>.
              Discover the <strong>joke of the day</strong> loved by our global community.
            </p>

            <!-- Category Tags -->
            <div class="hero-tags d-flex flex-wrap justify-content-center gap-3" data-aos="fade-up" data-aos-delay="300">
              <router-link to="/category/family" class="hero-tag">
                <i class="bi bi-people"></i> 
                <span>Dad Jokes</span>
              </router-link>

              <router-link to="/category/kids" class="hero-tag">
                <i class="bi bi-emoji-smile"></i> 
                <span>Kids Jokes</span>
              </router-link>

              <router-link to="/category/general" class="hero-tag">
                <i class="bi bi-chat-dots"></i> 
                <span>Knock Knock</span>
              </router-link>

              <router-link to="/spotlight" class="hero-tag hero-tag-highlight">
                <i class="bi bi-star-fill"></i> 
                <span>Joke of the Day</span>
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

    <!-- Main Content Container -->
    <div class="feed-container">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <!-- Feed Posts -->
            <div v-if="jokes.length > 0" class="feed-posts">
              <FeedPost 
                v-for="(joke, index) in jokes" 
                :key="joke.id" 
                :joke="joke"
                :data-aos="index < 3 ? 'fade-up' : ''"
                :data-aos-delay="index < 3 ? (index * 100).toString() : '0'"
              />
            </div>

            <!-- Loading Indicator -->
            <div v-if="loading" class="loading-state text-center py-5">
              <div class="spinner-wrapper">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              <p class="loading-text mt-3">Loading more jokes...</p>
            </div>

            <!-- Load More Button -->
            <div v-if="hasMore && !loading" class="load-more-wrapper text-center py-5">
              <button @click="loadMore" class="btn-load-more">
                <span class="btn-text">Load More Jokes</span>
                <i class="bi bi-arrow-down-circle ms-2"></i>
              </button>
            </div>

            <!-- End of Feed -->
            <div v-if="!hasMore && jokes.length > 0" class="end-of-feed text-center py-5">
              <div class="end-icon mb-3">🎉</div>
              <p class="end-message">You've reached the end of the feed!</p>
            </div>

            <!-- Empty State -->
            <div v-if="!loading && jokes.length === 0" class="empty-state text-center py-5">
              <div class="empty-icon mb-4">
                <i class="bi bi-emoji-frown"></i>
              </div>
              <h3 class="empty-title mb-3">No jokes found</h3>
              <p class="empty-description mb-4">
                Try selecting more languages from the header or be the first to submit a joke!
              </p>
              <router-link to="/submit" class="btn-empty-action">
                <i class="bi bi-plus-circle me-2"></i>
                Submit a Joke
              </router-link>
            </div>

            <!-- Scroll Sentinel -->
            <div ref="scrollSentinel" class="scroll-sentinel"></div>
          </div>
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
      title: 'Funny Jokes Feed, Best Short & Viral Jokes Updated Daily',
      description: 'Scroll through the funniest jokes online. Short jokes, viral humor, dark comedy, couple jokes, and daily funny content curated by the Humor community.'
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
   PAGE BACKGROUND - Applied to entire page
   ============================================ */

/* Global page background */
:deep(.main-content) {
  position: relative;
}

:deep(.main-content)::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.08) 0%,
    rgba(118, 75, 162, 0.06) 50%,
    rgba(13, 110, 253, 0.05) 100%
  );
}

:deep(.main-content)::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.08) 0%, transparent 50%);
  animation: float-pattern 20s ease-in-out infinite;
}

@keyframes float-pattern {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, -20px);
  }
}

.dark-mode :deep(.main-content)::before {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.12) 0%,
    rgba(118, 75, 162, 0.08) 50%,
    rgba(13, 110, 253, 0.06) 100%
  );
}

/* ============================================
   HERO SECTION - Full-width with modern design
   ============================================ */

.hero-modern {
  position: relative;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  overflow: hidden;
  margin-bottom: 0;
  background: transparent; /* Removed separate background */
}

.hero-background {
  display: none; /* No longer needed - using page background */
}

.hero-gradient {
  display: none; /* No longer needed - using page background */
}

.hero-pattern {
  display: none; /* No longer needed - using page background */
}

.hero-modern .container {
  position: relative;
  z-index: 1;
}

/* Badge styling */
.hero-badge-wrapper {
  display: flex;
  justify-content: center;
  animation: float-badge 3s ease-in-out infinite;
}

@keyframes float-badge {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(102, 126, 234, 0.2);
  color: #667eea;
  box-shadow: 
    0 4px 12px rgba(102, 126, 234, 0.15),
    0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-badge:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 20px rgba(102, 126, 234, 0.2),
    0 4px 8px rgba(0, 0, 0, 0.08);
}

.hero-badge i {
  font-size: 1.1rem;
  vertical-align: -1px;
  animation: pulse 2.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Title styling */
.hero-title {
  font-size: clamp(1.75rem, 5vw, 3rem);
  line-height: 1.25;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  animation: fade-in-up 0.8s ease-out;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Subtitle styling */
.hero-subtitle {
  font-size: clamp(1rem, 3vw, 1.15rem);
  line-height: 1.7;
  color: var(--bs-secondary-color, #6c757d);
  max-width: 720px;
  margin: 0 auto 2rem;
}

.hero-subtitle strong {
  color: #667eea;
  font-weight: 600;
  position: relative;
  transition: color 0.3s ease;
}

/* Tags container */
.hero-tags {
  gap: 0.875rem;
}

/* Individual tag styling */
.hero-tag {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9375rem;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1.5px solid rgba(102, 126, 234, 0.15);
  color: #495057;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.05),
    0 1px 3px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

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
  transition: all 0.4s ease;
  z-index: 0;
}

.hero-tag i,
.hero-tag span {
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}

.hero-tag:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 
    0 12px 24px rgba(102, 126, 234, 0.25),
    0 6px 12px rgba(0, 0, 0, 0.08);
  border-color: #667eea;
  color: #fff;
}

.hero-tag:hover::before {
  width: 300%;
  height: 300%;
}

.hero-tag:hover i,
.hero-tag:hover span {
  color: #fff;
}

/* Highlighted tag (Joke of the Day) */
.hero-tag-highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: #fff;
  box-shadow: 
    0 4px 16px rgba(102, 126, 234, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.1);
  animation: glow 2.5s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% {
    box-shadow: 
      0 4px 16px rgba(102, 126, 234, 0.3),
      0 2px 8px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: 
      0 8px 28px rgba(102, 126, 234, 0.4),
      0 4px 12px rgba(0, 0, 0, 0.12);
  }
}

.hero-tag-highlight::before {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.hero-tag-highlight:hover {
  box-shadow: 
    0 12px 32px rgba(102, 126, 234, 0.4),
    0 6px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px) scale(1.08);
}

.hero-tag-highlight i {
  animation: sparkle 1.8s ease-in-out infinite;
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

/* Dark mode adjustments */
.dark-mode .hero-gradient {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.12) 0%,
    rgba(118, 75, 162, 0.08) 50%,
    rgba(13, 110, 253, 0.06) 100%
  );
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
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.2),
    0 1px 3px rgba(0, 0, 0, 0.15);
}

.dark-mode .hero-tag:hover {
  box-shadow: 
    0 12px 24px rgba(102, 126, 234, 0.35),
    0 6px 12px rgba(0, 0, 0, 0.2);
}

.dark-mode .hero-tag-highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 
    0 4px 16px rgba(102, 126, 234, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.3);
}

/* ============================================
   FEED CONTAINER
   ============================================ */

.feed-container {
  background: transparent; /* Changed from var(--bs-body-bg) to transparent */
  min-height: 60vh;
}

.feed-posts {
  display: flex;
  flex-direction: column;
  gap: 1.25rem; /* Added gap between posts */
}

/* ============================================
   LOADING STATE
   ============================================ */

.loading-state {
  animation: fade-in 0.3s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.spinner-wrapper {
  display: inline-flex;
  padding: 1.5rem;
  background: rgba(13, 110, 253, 0.05);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.1);
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.3em;
}

.loading-text {
  color: var(--bs-secondary-color, #6c757d);
  font-weight: 500;
  font-size: 1rem;
}

/* ============================================
   LOAD MORE BUTTON
   ============================================ */

.load-more-wrapper {
  animation: fade-in 0.3s ease-out;
}

.btn-load-more {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2.5rem;
  font-size: 1.0625rem;
  font-weight: 600;
  color: #667eea;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.08),
    0 2px 4px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.btn-load-more::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-load-more .btn-text,
.btn-load-more i {
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}

.btn-load-more:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 12px 28px rgba(102, 126, 234, 0.25),
    0 6px 12px rgba(0, 0, 0, 0.08);
  border-color: #667eea;
  color: #fff;
}

.btn-load-more:hover::before {
  opacity: 1;
}

.btn-load-more:active {
  transform: translateY(-2px);
}

.btn-load-more i {
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.btn-load-more:hover i {
  animation: bounce-down 0.6s ease infinite;
}

@keyframes bounce-down {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(4px);
  }
}

.dark-mode .btn-load-more {
  background: rgba(28, 32, 36, 0.9);
  border-color: rgba(102, 126, 234, 0.3);
  color: #9ec5fe;
}

.dark-mode .btn-load-more:hover {
  border-color: #667eea;
  color: #fff;
}

/* ============================================
   END OF FEED
   ============================================ */

.end-of-feed {
  animation: fade-in 0.5s ease-out;
}

.end-icon {
  font-size: 3rem;
  animation: rotate-celebrate 1s ease-in-out;
}

@keyframes rotate-celebrate {
  0% {
    transform: rotate(0deg) scale(0.5);
    opacity: 0;
  }
  50% {
    transform: rotate(180deg) scale(1.2);
  }
  100% {
    transform: rotate(360deg) scale(1);
    opacity: 1;
  }
}

.end-message {
  color: var(--bs-secondary-color, #6c757d);
  font-size: 1.125rem;
  font-weight: 500;
  margin: 0;
}

/* ============================================
   EMPTY STATE
   ============================================ */

.empty-state {
  padding: 4rem 2rem;
  animation: fade-in 0.5s ease-out;
}

.empty-icon {
  font-size: 5rem;
  opacity: 0.3;
  animation: sway 3s ease-in-out infinite;
}

@keyframes sway {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}

.empty-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color, #0f1419);
  margin-bottom: 1rem;
}

.empty-description {
  font-size: 1.0625rem;
  color: var(--bs-secondary-color, #6c757d);
  max-width: 500px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.btn-empty-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  font-size: 1.0625rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 12px rgba(102, 126, 234, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-empty-action:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 12px 28px rgba(102, 126, 234, 0.4),
    0 6px 12px rgba(0, 0, 0, 0.12);
  color: #fff;
}

.btn-empty-action:active {
  transform: translateY(-2px);
}

/* ============================================
   SCROLL SENTINEL (hidden)
   ============================================ */

.scroll-sentinel {
  height: 1px;
  visibility: hidden;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */

@media (max-width: 768px) {
  .hero-modern .container {
    padding: 2rem 1rem;
  }

  .hero-badge {
    font-size: 0.8125rem;
    padding: 0.625rem 1.25rem;
  }

  .hero-badge .badge-text {
    display: none;
  }

  .hero-badge i {
    font-size: 1rem;
    margin-right: 0 !important;
  }

  .hero-title {
    font-size: clamp(1.5rem, 6vw, 2.25rem);
    margin-bottom: 1.25rem;
  }

  .hero-subtitle {
    font-size: clamp(0.95rem, 3.5vw, 1.0625rem);
    margin-bottom: 1.5rem;
  }

  .hero-tags {
    gap: 0.625rem;
  }

  .hero-tag {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }

  .hero-tag span {
    display: none;
  }

  .hero-tag i {
    font-size: 1.125rem;
    margin-right: 0 !important;
  }

  .feed-container .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .btn-load-more {
    padding: 0.875rem 2rem;
    font-size: 1rem;
  }

  .empty-icon {
    font-size: 4rem;
  }

  .empty-title {
    font-size: 1.5rem;
  }

  .empty-description {
    font-size: 1rem;
  }

  .btn-empty-action {
    padding: 0.875rem 1.75rem;
    font-size: 1rem;
  }
}

@media (max-width: 576px) {
  .hero-modern .container {
    padding: 1.5rem 1rem;
  }

  .hero-badge {
    font-size: 0.75rem;
    padding: 0.5rem 1rem;
  }

  .hero-title {
    font-size: clamp(1.25rem, 7vw, 1.875rem);
    line-height: 1.3;
  }

  .hero-subtitle {
    font-size: clamp(0.875rem, 4vw, 1rem);
    line-height: 1.6;
  }

  .hero-tags {
    gap: 0.5rem;
  }

  .hero-tag {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  }

  .btn-load-more {
    width: 100%;
    max-width: 320px;
  }

  .btn-empty-action {
    width: 100%;
    max-width: 280px;
  }
}

/* ============================================
   ACCESSIBILITY
   ============================================ */

@media (prefers-reduced-motion: reduce) {
  .hero-modern,
  .hero-badge,
  .hero-title,
  .hero-subtitle,
  .hero-tags,
  .hero-tag,
  .hero-tag::before,
  .hero-badge i,
  .hero-tag-highlight i,
  .spinner-wrapper,
  .loading-state,
  .load-more-wrapper,
  .end-of-feed,
  .empty-state,
  .btn-load-more,
  .btn-load-more i,
  .btn-empty-action,
  .empty-icon,
  .end-icon {
    animation: none !important;
    transition: none !important;
  }
}

</style>