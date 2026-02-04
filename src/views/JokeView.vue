<template>
  <DefaultLayout>
    <div class="joke-view-modern">
      <!-- Animated background -->
      <div class="view-background">
        <div class="bg-shape shape-1"></div>
        <div class="bg-shape shape-2"></div>
      </div>

      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            
            <!-- Back Button -->
            <router-link to="/categories" class="btn-back">
              <i class="bi bi-arrow-left"></i>
              <span>Back to Categories</span>
            </router-link>

            <!-- Enhanced Title Section for SEO -->
            <div v-if="currentJoke" class="joke-title-section">
              <div class="title-decoration"></div>
              <h1 class="joke-main-title">
                {{ currentJoke.title || generateDefaultTitle(currentJoke) }}
              </h1>
              <div class="title-meta">
                <span class="meta-badge">
                  <i class="bi bi-eye"></i>
                  {{ formatCount(currentJoke.views || 0) }} views
                </span>
                <span class="meta-badge">
                  <i class="bi bi-heart-fill"></i>
                  {{ formatCount(currentJoke.likes || 0) }} likes
                </span>
              </div>
            </div>

            <!-- Main Joke Card -->
            <transition name="fade-scale" mode="out-in">
              <JokeCard 
                v-if="currentJoke" 
                :joke="currentJoke"
                :show-link="false"
                class="main-joke-card"
                :key="currentJoke.id"
              />
            </transition>

            <div v-if="!currentJoke" class="alert-modern alert-warning">
              <i class="bi bi-exclamation-triangle"></i>
              <div>
                <h5>Joke not found</h5>
                <p>This joke may have been removed or doesn't exist.</p>
              </div>
            </div>

            <div v-if="loading" class="loading-container">
              <div class="spinner-modern">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
              </div>
              <p class="loading-text">Loading joke...</p>
            </div>

            <!-- Actions Section -->
            <div v-if="currentJoke" class="actions-section">
              <JokeButton 
                @click="loadRandomJoke"
                text="Get Another Joke"
                class="action-button"
              />
            </div>

          </div>
        </div>
      </div>

      <!-- Related Jokes Section - FULL WIDTH with TWO COLUMNS -->
      <section v-if="currentJoke && !loading" class="related-jokes-section-fullwidth">
        <div class="container-fluid px-3 px-lg-5">
          <div class="row g-4">
            <!-- Left Column: Section Header & Info -->
            <div class="col-lg-4">
              <div class="section-header-sidebar">
                <div class="header-line"></div>
                <h2 class="section-title">
                  <i class="bi bi-stars"></i>
                  Most Loved {{ getCategoryDisplayName(currentJoke) }} Jokes
                </h2>
                <p class="section-subtitle">
                  Discover more hilarious {{ getCategoryDisplayName(currentJoke).toLowerCase() }} jokes loved by our community
                </p>
                
                <!-- View All Link -->
                <div v-if="relatedJokes.length > 0" class="view-all-section-sidebar">
                  <router-link 
                    :to="`/category/${getCategorySlug(currentJoke)}`"
                    class="btn-view-all"
                  >
                    <span>View All {{ getCategoryDisplayName(currentJoke) }} Jokes</span>
                    <i class="bi bi-arrow-right"></i>
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Right Column: Related Jokes Grid -->
            <div class="col-lg-8">
              <!-- Loading State -->
              <div v-if="relatedJokesLoading" class="related-loading">
                <div class="spinner-small"></div>
                <span>Loading related jokes...</span>
              </div>

              <!-- Related Jokes Grid - FULL CONTENT (NO TRUNCATION) -->
              <transition-group 
                v-else-if="relatedJokes.length > 0" 
                name="stagger"
                tag="div"
                class="related-jokes-grid-fullcontent"
              >
                <article 
                  v-for="(joke, index) in relatedJokes" 
                  :key="joke.id"
                  class="related-joke-card-full"
                  :style="{ '--delay': index * 0.05 + 's' }"
                  @click="navigateToJoke(joke)"
                  :aria-label="`Read joke: ${joke.title || joke.text.substring(0, 50)}`"
                >
                  <div class="card-shine"></div>
                  
                  <!-- Category Badges -->
                  <div class="category-badges">
                    <span 
                      v-for="cat in getJokeCategories(joke).slice(0, 2)" 
                      :key="cat"
                      :class="`category-badge badge-${getCategoryColor(cat)}`"
                    >
                      <i :class="['bi', getCategoryIcon(cat)]"></i>
                    </span>
                  </div>

                  <!-- Joke Title (if exists) -->
                  <h3 
                    v-if="joke.title" 
                    class="joke-title-full"
                    :dir="getTextDirection(joke.title)"
                    :class="getDirectionClass(joke.title)"
                  >
                    {{ joke.title }}
                  </h3>

                  <!-- Joke FULL Content - NO TRUNCATION for SEO -->
                  <div 
                    class="joke-content-full preserve-whitespace"
                    :dir="getTextDirection(joke.text)"
                    :class="getDirectionClass(joke.text)"
                  >
                    {{ joke.text }}
                  </div>

                  <!-- Card Footer -->
                  <div class="card-footer">
                    <div class="stat-item">
                      <i class="bi bi-heart-fill"></i>
                      <span>{{ formatCount(joke.likes || 0) }}</span>
                    </div>
                    <div class="stat-item">
                      <i class="bi bi-eye"></i>
                      <span>{{ formatCount(joke.views || 0) }}</span>
                    </div>
                    <div class="read-more">
                      Read <i class="bi bi-arrow-right"></i>
                    </div>
                  </div>
                </article>
              </transition-group>

              <!-- Empty State -->
              <div v-else class="empty-related">
                <i class="bi bi-emoji-frown"></i>
                <p>No more {{ getCategoryDisplayName(currentJoke).toLowerCase() }} jokes available yet.</p>
                <router-link to="/categories" class="btn-outline-modern">
                  Browse Other Categories
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section - back inside container -->
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div v-if="currentJoke" class="cta-section-modern">
              <div class="cta-background">
                <div class="cta-pattern"></div>
              </div>
              <div class="cta-content">
                <div class="cta-icon">
                  <i class="bi bi-emoji-laughing"></i>
                </div>
                <h3 class="cta-title">Got a joke to share?</h3>
                <p class="cta-description">
                  Join our community of humor enthusiasts! Share your favorite jokes and make the world laugh.
                </p>
                <router-link to="/submit" class="btn-cta">
                  <span>Share Your Joke</span>
                  <i class="bi bi-arrow-right"></i>
                </router-link>
                <p class="cta-hint">It only takes a minute ✨</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </DefaultLayout>
</template>

<script setup>
import { computed, watch, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import JokeCard from '../components/JokeCard.vue';
import JokeButton from '../components/JokeButton.vue';
import { updateSEO } from '../utils/seo';
import { trackJokeView } from '../services/analyticsService';
import { getCategoryLabel, valueToSlug } from '@/config/categories';
import { getJokeUrl } from '@/utils/jokeUrlHelper';
import { generateJokeSlug } from '@/utils/slugify';
import { getJokesByCategory } from '../services/jokeService';
import { getTextDirection, getDirectionClass } from '../utils/rtl';
import { getCategoryColor, getCategoryIcon } from '@/config/categories';

const router = useRouter();
const route = useRoute();
const store = useStore();

const currentJoke = computed(() => store.getters['jokes/currentJoke']);
const loading = computed(() => store.getters['jokes/loading']);
const selectedLanguage = computed(() => store.getters['preferences/selectedLanguage']);
const selectedLanguages = computed(() => store.getters['preferences/selectedLanguages']);

// Related jokes state
const relatedJokes = ref([]);
const relatedJokesLoading = ref(false);

// Helper functions
const generateDefaultTitle = (joke) => {
  if (!joke) return 'Funny Joke';
  const categoryName = getCategoryDisplayName(joke);
  const preview = joke.text.substring(0, 60).trim();
  return `${categoryName} Joke: ${preview}${preview.length < joke.text.length ? '...' : ''}`;
};

const getCategoryDisplayName = (joke) => {
  if (Array.isArray(joke.categories) && joke.categories.length > 0) {
    return getCategoryLabel(joke.categories[0]);
  } else if (joke.category) {
    return getCategoryLabel(joke.category);
  }
  return 'General';
};

const getCategorySlug = (joke) => {
  if (Array.isArray(joke.categories) && joke.categories.length > 0) {
    return valueToSlug(joke.categories[0]) || 'general';
  } else if (joke.category) {
    return valueToSlug(joke.category) || 'general';
  }
  return 'general';
};

const getJokeCategories = (joke) => {
  if (Array.isArray(joke.categories)) return joke.categories;
  if (joke.category) return [joke.category];
  return ['General'];
};

const formatCount = (count) => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
  return count;
};

const navigateToJoke = (joke) => {
  const url = getJokeUrl(joke);
  router.push(url);
};

// Load related jokes
const loadRelatedJokes = async (joke) => {
  if (!joke) return;
  
  relatedJokesLoading.value = true;
  
  try {
    const primaryCategory = Array.isArray(joke.categories) && joke.categories.length > 0
      ? joke.categories[0]
      : joke.category || 'General';
    
    let allJokes = [];
    
    for (const language of selectedLanguages.value) {
      const jokes = await getJokesByCategory(primaryCategory, language);
      allJokes = [...allJokes, ...jokes];
    }
    
    allJokes = allJokes.filter(j => j.id !== joke.id);
    allJokes.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    
    relatedJokes.value = allJokes.slice(0, 10);
  } catch (error) {
    console.error('Error loading related jokes:', error);
    relatedJokes.value = [];
  } finally {
    relatedJokesLoading.value = false;
  }
};

const loadRandomJoke = async () => {
  await store.dispatch('jokes/setCategory', '');
  await store.dispatch('jokes/fetchRandomJoke');
  
  if (currentJoke.value) {
    const url = getJokeUrl(currentJoke.value);
    router.push(url);
  }
};

const loadJokeById = async (jokeId) => {
  await store.dispatch('jokes/fetchJokeById', jokeId);
  
  if (currentJoke.value) {
    trackJokeView(
      currentJoke.value.id, 
      currentJoke.value.category, 
      currentJoke.value.language
    );
    await loadRelatedJokes(currentJoke.value);
  }
};

// Watch for route changes
watch(
  () => route.params.titleSlugWithId,
  async (titleSlugWithId) => {
    if (!titleSlugWithId) return;
    
    const jokeId = titleSlugWithId.substring(titleSlugWithId.lastIndexOf('-') + 1);
    
    if (jokeId) {
      await loadJokeById(String(jokeId));
      
      if (currentJoke.value) {
        updateSEO({
          title: `${currentJoke.value.title || 'Joke'}`,
          description: currentJoke.value.text.substring(0, 160)
        });
      }
    }
  },
  { immediate: true }
);

onMounted(() => {
  updateSEO({
    title: 'Funny Joke - Laugh Out Loud!',
    description: 'Read funny jokes from our community.'
  });
});
</script>

<style scoped>
/* Existing styles remain the same ... */
/* ============================================
   VIEW CONTAINER & BACKGROUND
   ============================================ */
.joke-view-modern {
  position: relative;
  min-height: 100vh;
  padding: 2rem 0 4rem;
}

.view-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
}

.dark-mode .view-background {
  background: linear-gradient(135deg, #0f1419 0%, #1a1d20 100%);
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.12;
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -300px;
  left: -300px;
  animation-delay: 0s;
}

.shape-2 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  bottom: -250px;
  right: -250px;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(50px, -50px) rotate(5deg); }
  66% { transform: translate(-30px, 30px) rotate(-5deg); }
}

/* ============================================
   BACK BUTTON
   ============================================ */
.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  color: #6c757d;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.btn-back:hover {
  background: white;
  color: #667eea;
  transform: translateX(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.btn-back i {
  transition: transform 0.3s ease;
}

.btn-back:hover i {
  transform: translateX(-3px);
}

.dark-mode .btn-back {
  background: rgba(28, 32, 36, 0.9);
  border-color: rgba(255, 255, 255, 0.06);
  color: #adb5bd;
}

.dark-mode .btn-back:hover {
  background: #2c3034;
  color: #9ec5fe;
}

/* ============================================
   TITLE SECTION
   ============================================ */
.joke-title-section {
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 24px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  animation: fadeInUp 0.6s ease;
}

.title-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
}

.joke-main-title {
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1.3;
  color: var(--text-color, #0f1419);
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.02em;
}

.title-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.meta-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.08);
  border-radius: 12px;
  color: #667eea;
  font-size: 0.875rem;
  font-weight: 600;
}

.meta-badge i {
  font-size: 1rem;
}

.dark-mode .joke-title-section {
  background: rgba(28, 32, 36, 0.9);
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.dark-mode .joke-main-title {
  color: var(--text-color, #e7e9ea);
}

.dark-mode .meta-badge {
  background: rgba(102, 126, 234, 0.15);
  color: #9ec5fe;
}

/* ============================================
   MAIN JOKE CARD
   ============================================ */
.main-joke-card {
  animation: fadeInScale 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ============================================
   LOADING STATE
   ============================================ */
.loading-container {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner-modern {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring:nth-child(1) { animation-delay: -0.45s; opacity: 0.3; }
.spinner-ring:nth-child(2) { animation-delay: -0.3s; opacity: 0.5; }
.spinner-ring:nth-child(3) { animation-delay: -0.15s; opacity: 0.7; }

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.125rem;
  color: #6c757d;
  font-weight: 500;
}

/* ============================================
   ALERT MODERN
   ============================================ */
.alert-modern {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.5rem;
  background: rgba(255, 193, 7, 0.08);
  border: 1px solid rgba(255, 193, 7, 0.2);
  border-radius: 16px;
  margin-bottom: 2rem;
}

.alert-modern i {
  font-size: 2rem;
  color: #ffc107;
  flex-shrink: 0;
}

.alert-modern h5 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
}

.alert-modern p {
  margin: 0;
  color: #6c757d;
}

/* ============================================
   ACTIONS SECTION
   ============================================ */
.actions-section {
  text-align: center;
  margin: 2.5rem 0;
  animation: fadeInUp 0.8s ease;
}

.action-button {
  animation: pulse 3s ease-in-out infinite;
}

/* ============================================
   RELATED JOKES SECTION - FULL WIDTH TWO COLUMNS
   ============================================ */
.related-jokes-section-fullwidth {
  margin-top: 4rem;
  padding: 4rem 0;
  background: rgba(102, 126, 234, 0.02);
  border-top: 2px solid rgba(0, 0, 0, 0.06);
  animation: fadeInUp 1s ease;
}

.dark-mode .related-jokes-section-fullwidth {
  background: rgba(102, 126, 234, 0.05);
  border-top-color: rgba(255, 255, 255, 0.06);
}

/* Left Sidebar Header */
.section-header-sidebar {
  position: sticky;
  top: 100px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.dark-mode .section-header-sidebar {
  background: rgba(28, 32, 36, 0.9);
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.header-line {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  margin-bottom: 1.5rem;
  border-radius: 2px;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color, #0f1419);
  margin: 0 0 1rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex-direction: column;
}

.section-title i {
  color: #ffc107;
  font-size: 1.75rem;
}

.section-subtitle {
  font-size: 1rem;
  color: #6c757d;
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.dark-mode .section-title {
  color: var(--text-color, #e7e9ea);
}

.dark-mode .section-subtitle {
  color: #adb5bd;
}

.view-all-section-sidebar {
  margin-top: 2rem;
}

/* Related Loading */
.related-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem;
  color: #6c757d;
}

.spinner-small {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(102, 126, 234, 0.2);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Related Jokes Grid - FULL CONTENT */
.related-jokes-grid-fullcontent {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.related-joke-card-full {
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  padding: 2rem;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  animation: fadeInScale 0.6s ease both;
  animation-delay: var(--delay, 0s);
}

.related-joke-card-full:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: rgba(102, 126, 234, 0.2);
}

.card-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transform: translateX(-100%) translateY(-100%) rotate(45deg);
  transition: transform 0.6s ease;
}

.related-joke-card-full:hover .card-shine {
  transform: translateX(100%) translateY(100%) rotate(45deg);
}

.dark-mode .related-joke-card-full {
  background: rgba(28, 32, 36, 0.9);
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

.dark-mode .related-joke-card-full:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  border-color: rgba(102, 126, 234, 0.3);
}

.category-badges {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  font-size: 0.9375rem;
  transition: transform 0.3s ease;
}

.related-joke-card-full:hover .category-badge {
  transform: scale(1.1) rotate(5deg);
}

.badge-primary { background: rgba(13, 110, 253, 0.12); color: #0d6efd; }
.badge-success { background: rgba(25, 135, 84, 0.12); color: #198754; }
.badge-danger { background: rgba(220, 53, 69, 0.12); color: #dc3545; }
.badge-warning { background: rgba(255, 193, 7, 0.12); color: #ffc107; }
.badge-info { background: rgba(13, 202, 240, 0.12); color: #0dcaf0; }
.badge-secondary { background: rgba(108, 117, 125, 0.12); color: #6c757d; }
.badge-dark { background: rgba(33, 37, 41, 0.12); color: #212529; }

.dark-mode .badge-primary { background: rgba(13, 110, 253, 0.2); color: #6ea8fe; }
.dark-mode .badge-success { background: rgba(25, 135, 84, 0.2); color: #75b798; }
.dark-mode .badge-danger { background: rgba(220, 53, 69, 0.2); color: #ea868f; }
.dark-mode .badge-warning { background: rgba(255, 193, 7, 0.2); color: #ffc107; }
.dark-mode .badge-info { background: rgba(13, 202, 240, 0.2); color: #6edff6; }
.dark-mode .badge-secondary { background: rgba(108, 117, 125, 0.2); color: #adb5bd; }
.dark-mode .badge-dark { background: rgba(255, 255, 255, 0.2); color: #f8f9fa; }

/* Joke Title (if exists) */
.joke-title-full {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--text-color, #0f1419);
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.dark-mode .joke-title-full {
  color: var(--text-color, #e7e9ea);
}

.rtl-text.joke-title-full {
  text-align: right !important;
  direction: rtl !important;
}

.ltr-text.joke-title-full {
  text-align: left !important;
  direction: ltr !important;
}

/* Joke FULL Content - NO TRUNCATION for SEO */
.joke-content-full {
  font-size: 1.0625rem;
  line-height: 1.7;
  color: var(--text-color, #0f1419);
  margin: 0 0 1.5rem 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  /* NO line-clamp - display full content */
}

.dark-mode .joke-content-full {
  color: var(--text-color, #e7e9ea);
}

.preserve-whitespace {
  white-space: pre-wrap;
}

.rtl-text.joke-content-full {
  line-height: 1.8 !important;
  text-align: right !important;
  direction: rtl !important;
}

.ltr-text.joke-content-full {
  text-align: left !important;
  direction: ltr !important;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.dark-mode .card-footer {
  border-top-color: rgba(255, 255, 255, 0.06);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
}

.stat-item:first-child {
  color: #f91880;
}

.stat-item:nth-child(2) {
  color: #1d9bf0;
}

.read-more {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-left: auto;
  font-size: 0.875rem;
  font-weight: 600;
  color: #667eea;
  transition: gap 0.3s ease;
}

.related-joke-card-full:hover .read-more {
  gap: 0.625rem;
}

.read-more i {
  transition: transform 0.3s ease;
}

.related-joke-card-full:hover .read-more i {
  transform: translateX(3px);
}

/* Empty Related */
.empty-related {
  text-align: center;
  padding: 3rem 2rem;
}

.empty-related i {
  font-size: 4rem;
  opacity: 0.3;
  margin-bottom: 1.5rem;
  display: block;
}

.empty-related p {
  font-size: 1.0625rem;
  color: #6c757d;
  margin-bottom: 1.5rem;
}

/* View All Button */
.btn-view-all {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.0625rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  justify-content: center;
}

.btn-view-all:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
  color: #667eea;
}

.btn-view-all i {
  transition: transform 0.3s ease;
}

.btn-view-all:hover i {
  transform: translateX(4px);
}

.dark-mode .btn-view-all {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
  border-color: rgba(102, 126, 234, 0.3);
  color: #9ec5fe;
}

.dark-mode .btn-view-all:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.25), rgba(118, 75, 162, 0.25));
  border-color: #9ec5fe;
  color: #9ec5fe;
}

/* ============================================
   CTA SECTION MODERN
   ============================================ */
.cta-section-modern {
  position: relative;
  margin-top: 4rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 32px;
  padding: 4rem 2rem;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
  animation: fadeInUp 1.2s ease;
}

.cta-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.cta-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.cta-content {
  position: relative;
  z-index: 2;
  text-align: center;
}

.cta-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
}

.cta-description {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.95);
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.125rem 2.5rem;
  background: white;
  color: #667eea;
  border-radius: 16px;
  font-weight: 600;
  font-size: 1.125rem;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.btn-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  color: #667eea;
}

.btn-cta i {
  transition: transform 0.3s ease;
}

.btn-cta:hover i {
  transform: translateX(4px);
}

.cta-hint {
  margin-top: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9375rem;
  font-weight: 500;
}

/* ============================================
   ANIMATIONS
   ============================================ */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Transition groups */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.stagger-enter-active {
  transition: all 0.6s ease;
}

.stagger-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

/* ============================================
   OUTLINE BUTTON
   ============================================ */
.btn-outline-modern {
  display: inline-flex;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-outline-modern:hover {
  background: rgba(102, 126, 234, 0.08);
  border-color: #667eea;
  transform: translateY(-2px);
  color: #667eea;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */
@media (max-width: 991px) {
  .section-header-sidebar {
    position: relative;
    top: 0;
    margin-bottom: 2rem;
  }
  
  .related-jokes-grid-fullcontent {
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .joke-view-modern {
    padding: 1.5rem 0 3rem;
  }

  .joke-title-section {
    padding: 2rem 1.5rem;
    border-radius: 20px;
  }

  .joke-main-title {
    font-size: 1.75rem;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .related-joke-card-full {
    padding: 1.5rem;
  }

  .cta-section-modern {
    padding: 3rem 1.5rem;
    border-radius: 24px;
  }

  .cta-title {
    font-size: 2rem;
  }

  .cta-description {
    font-size: 1rem;
  }

  .btn-cta {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .joke-title-section {
    padding: 1.5rem 1.25rem;
  }

  .joke-main-title {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .section-subtitle {
    font-size: 1rem;
  }

  .related-joke-card-full {
    padding: 1.25rem;
  }

  .cta-icon {
    font-size: 3rem;
  }

  .cta-title {
    font-size: 1.75rem;
  }
}

/* ============================================
   ACCESSIBILITY
   ============================================ */
@media (prefers-reduced-motion: reduce) {
  .bg-shape,
  .spinner-modern,
  .cta-icon,
  .cta-pattern,
  .card-shine,
  * {
    animation: none !important;
    transition: none !important;
  }
}
</style>