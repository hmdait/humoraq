<template>
  <DefaultLayout>
    <!-- Hero Section -->
    <section class="hero-modern">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-9 text-center">
            <!-- Badge -->
            <div class="hero-badge-wrapper mb-3" data-aos="fade-down">
              <span class="hero-badge">
                <i class="bi bi-emoji-laughing-fill me-1"></i> 
                <span class="badge-text">{{ t('feed.hero.badge') }}</span>
              </span>
            </div>

            <!-- Title -->
            <h1 class="hero-title fw-bold mb-4" data-aos="fade-up" data-aos-delay="100">
              {{ t('feed.hero.title') }}
            </h1>

            <!-- Subtitle (with HTML support) -->
            <p 
              class="hero-subtitle mb-5" 
              data-aos="fade-up" 
              data-aos-delay="200"
              v-html="t('feed.hero.subtitle')"
            ></p>

            <!-- Category Tags -->
            <div class="hero-tags d-flex flex-wrap justify-content-center gap-3" data-aos="fade-up" data-aos-delay="300">
              <router-link to="/category/family" class="hero-tag">
                <i class="bi bi-people"></i> 
                <span>{{ t('feed.hero.dadJokes') }}</span>
              </router-link>

              <router-link to="/category/kids" class="hero-tag">
                <i class="bi bi-emoji-smile"></i> 
                <span>{{ t('feed.hero.kidsJokes') }}</span>
              </router-link>

              <router-link to="/category/general" class="hero-tag">
                <i class="bi bi-chat-dots"></i> 
                <span>{{ t('feed.hero.knockKnock') }}</span>
              </router-link>

              <router-link to="/spotlight" class="hero-tag hero-tag-highlight">
                <i class="bi bi-star-fill"></i> 
                <span>{{ t('feed.hero.jokeOfDay') }}</span>
              </router-link>
            </div>
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
                  <span class="visually-hidden">{{ t('feed.loading') }}</span>
                </div>
              </div>
              <p class="loading-text mt-3">{{ t('feed.loading') }}</p>
            </div>

            <!-- Load More Button -->
            <div v-if="hasMore && !loading" class="load-more-wrapper text-center py-5">
              <button @click="loadMore" class="btn-load-more">
                <span class="btn-text">{{ t('feed.loadMore') }}</span>
                <i class="bi bi-arrow-down-circle ms-2"></i>
              </button>
            </div>

            <!-- End of Feed -->
            <div v-if="!hasMore && jokes.length > 0" class="end-of-feed text-center py-5">
              <div class="end-icon mb-3">🎉</div>
              <p class="end-message">{{ t('feed.endOfFeed') }}</p>
            </div>

            <!-- Empty State -->
            <div v-if="!loading && jokes.length === 0" class="empty-state text-center py-5">
              <div class="empty-icon mb-4">
                <i class="bi bi-emoji-frown"></i>
              </div>
              <h3 class="empty-title mb-3">{{ t('feed.empty.title') }}</h3>
              <p class="empty-description mb-4">
                {{ t('feed.empty.description') }}
              </p>
              <router-link to="/submit" class="btn-empty-action">
                <i class="bi bi-plus-circle me-2"></i>
                {{ t('feed.empty.action') }}
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
import { getJokesFeedByLanguageInteraction } from '../services/jokeService';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { t, currentLanguage } from '@/i18n';
import { updateDynamicSEO } from '@/utils/dynamicSEO';

const store = useStore();

const jokes = ref([]);
const loading = ref(false);
const hasMore = ref(true);
const lastDocs = ref({});
const scrollSentinel = ref(null);
const pageSize = 10;

let observer = null;

// Get selected languages from Vuex (for joke content)
const selectedLanguages = computed(() => store.getters['preferences/selectedLanguages']);

// Update SEO function
const updateFeedSEO = () => {
  const lang = currentLanguage.value;
  
  updateDynamicSEO({
    title: t('seo.feedTitle', lang),
    description: t('seo.feedDescription', lang),
    keywords: t('seo.feedKeywords', lang),
    lang: lang,
    ogLocale: lang === 'en' ? 'en_US' : lang === 'fr' ? 'fr_FR' : lang === 'es' ? 'es_ES' : 'ar_AR'
  });
};

// Load jokes functions (existing logic)
const loadInitialJokes = async () => {
  console.log('=== Loading initial jokes for languages:', selectedLanguages.value);
  loading.value = true;
  jokes.value = [];
  lastDocs.value = {};
  hasMore.value = true;

  try {
    let allJokes = [];

    for (const language of selectedLanguages.value) {
      const result = await getJokesFeedByLanguageInteraction(language, pageSize);
      allJokes = [...allJokes, ...result.jokes];
      lastDocs.value[language] = result.lastDoc;
    }

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

const getSortTime = (joke) => {
  if (joke.updatedAt && typeof joke.updatedAt.toMillis === 'function') {
    return joke.updatedAt.toMillis();
  }
  if (joke.createdAt && typeof joke.createdAt.toMillis === 'function') {
    return joke.createdAt.toMillis();
  }
  return 0;
};

// Watch for language changes (both UI and content)
watch(selectedLanguages, () => {
  console.log('=== Content languages changed, reloading feed ===');
  loadInitialJokes();
}, { deep: true });

watch(currentLanguage, () => {
  console.log('=== UI language changed, updating SEO ===');
  updateFeedSEO();
});

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
  // Update SEO on mount
  updateFeedSEO();
  
  await loadInitialJokes();
  setupInfiniteScroll();
});

onUnmounted(() => {
  cleanupInfiniteScroll();
});
</script>

<style scoped>
/* Hero Section Styles */
.hero-modern {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.dark-mode .hero-modern {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.875rem;
}

.hero-title {
  font-size: 2rem;
  color: var(--text-color);
  line-height: 1.4;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: #6c757d;
  line-height: 1.6;
}

.hero-tags {
  margin-top: 2rem;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 50px;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
}

.hero-tag:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.hero-tag-highlight {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-color: transparent;
}

.hero-tag-highlight:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.dark-mode .hero-tag {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(102, 126, 234, 0.3);
  color: #9ec5fe;
}

.dark-mode .hero-tag:hover {
  background: #667eea;
  color: white;
}

/* Feed Container */
.feed-container {
  background: var(--bg-light);
}

.feed-posts {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner-wrapper {
  margin-bottom: 1rem;
}

.loading-text {
  color: #6c757d;
  font-size: 1rem;
}

/* Load More Button */
.btn-load-more {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-load-more:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

/* End of Feed */
.end-of-feed {
  color: #6c757d;
}

.end-icon {
  font-size: 3rem;
}

.end-message {
  font-size: 1.125rem;
  font-weight: 500;
}

/* Empty State */
.empty-state {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.empty-icon {
  font-size: 4rem;
  color: #6c757d;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
}

.empty-description {
  font-size: 1rem;
  color: #6c757d;
}

.btn-empty-action {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.btn-empty-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  color: white;
}

.scroll-sentinel {
  height: 1px;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 1.5rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .hero-tags {
    gap: 0.5rem;
  }
  
  .hero-tag {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
  }
}
</style>