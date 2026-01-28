<template>
  <DefaultLayout>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <router-link to="/categories" class="btn btn-outline-secondary mb-4">
            ← Back to Categories
          </router-link>

          <!-- Enhanced Title Section for SEO -->
          <div v-if="currentJoke" class="joke-title-section mb-4">
            <h1 class="joke-main-title">
              {{ currentJoke.title || generateDefaultTitle(currentJoke) }}
            </h1>
          </div>

          <!-- Main Joke Card -->
          <JokeCard 
            v-if="currentJoke" 
            :joke="currentJoke"
            :show-link="false"
            class="mb-4"
            :key="currentJoke.id"
          />

          <div v-else-if="!loading" class="alert alert-warning">
            Joke not found
          </div>

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <!-- Actions Section -->
          <div v-if="currentJoke" class="text-center mb-4">
            <JokeButton 
              @click="loadRandomJoke"
              text="Get Another Joke"
            />
          </div>

          <!-- NEW: Related Jokes Section for SEO -->
          <section v-if="currentJoke && !loading" class="related-jokes-section">
            <div class="section-header">
              <h2 class="section-title">
                Most Loved {{ getCategoryDisplayName(currentJoke) }} Jokes
              </h2>
              <span class="title-icon">⭐ ⭐ ⭐ ⭐ ⭐</span>
              <p class="section-subtitle">
                Discover more hilarious {{ getCategoryDisplayName(currentJoke).toLowerCase() }} jokes loved by our community
              </p>
            </div>

            <!-- Related Jokes Grid -->
            <div v-if="relatedJokesLoading" class="text-center py-4">
              <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">Loading related jokes...</span>
              </div>
            </div>

            <div v-else-if="relatedJokes.length > 0" class="related-jokes-grid">
              <article 
                v-for="joke in relatedJokes" 
                :key="joke.id"
                class="related-joke-card"
                @click="navigateToJoke(joke)"
                :aria-label="`Read joke: ${getJokePreview(joke, 50)}`"
              >
                <div class="card-content">
                  <!-- Category Badge -->
                  <div class="category-badges">
                    <span 
                      v-for="cat in getJokeCategories(joke).slice(0, 2)" 
                      :key="cat"
                      :class="`category-badge badge-${getCategoryColor(cat)}`"
                    >
                      <i :class="['bi', getCategoryIcon(cat)]"></i>
                    </span>
                  </div>

                  <!-- Joke Preview -->
                  <p 
                    class="joke-preview"
                    :dir="getTextDirection(joke.text)"
                    :class="getDirectionClass(joke.text)"
                  >
                    {{ getJokePreview(joke, 120) }}
                  </p>

                  <!-- Engagement Stats -->
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
                      Read more <i class="bi bi-arrow-right-short"></i>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <div v-else class="text-center text-muted py-4">
              <i class="bi bi-emoji-frown display-4 mb-3"></i>
              <p>No more {{ getCategoryDisplayName(currentJoke).toLowerCase() }} jokes available yet.</p>
              <router-link to="/categories" class="btn btn-outline-primary btn-sm mt-2">
                Browse Other Categories
              </router-link>
            </div>

            <!-- View All Link -->
            <div v-if="relatedJokes.length > 0" class="text-center mt-4">
              <router-link 
                :to="`/category/${getCategorySlug(currentJoke)}`"
                class="btn btn-outline-primary"
              >
                View All {{ getCategoryDisplayName(currentJoke) }} Jokes
                <i class="bi bi-arrow-right ms-2"></i>
              </router-link>
            </div>
          </section>

          <!-- Call-to-Action Section -->
          <div v-if="currentJoke" class="cta-section">
            <div class="cta-card">
              <div class="cta-background">
                <div class="cta-gradient"></div>
                <div class="cta-shapes">
                  <div class="shape shape-1"></div>
                  <div class="shape shape-2"></div>
                  <div class="shape shape-3"></div>
                </div>
              </div>
              <div class="cta-content">
                <div class="cta-icon">
                  <i class="bi bi-emoji-laughing"></i>
                </div>
                <h3 class="cta-title">
                  Got a joke to share?
                </h3>
                <p class="cta-description">
                  Join our community of humor enthusiasts! Share your favorite jokes and make the world laugh.
                </p>
                <router-link 
                  to="/submit" 
                  class="cta-button"
                >
                  <span class="cta-button-text">Share Your Joke</span>
                  <i class="bi bi-arrow-right cta-button-icon"></i>
                </router-link>
                <p class="cta-hint">
                  It only takes a minute ✨
                </p>
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

// Helper functions for title section
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

const getJokePreview = (joke, maxLength) => {
  if (!joke || !joke.text) return '';
  
  if (joke.text.length <= maxLength) return joke.text;
  
  const truncated = joke.text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
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

// Load related jokes by category, sorted by likes
const loadRelatedJokes = async (joke) => {
  if (!joke) return;
  
  relatedJokesLoading.value = true;
  
  try {
    // Get primary category
    const primaryCategory = Array.isArray(joke.categories) && joke.categories.length > 0
      ? joke.categories[0]
      : joke.category || 'General';
    
    console.log('Loading related jokes for category:', primaryCategory);
    
    // Fetch jokes from all selected languages
    let allJokes = [];
    
    for (const language of selectedLanguages.value) {
      const jokes = await getJokesByCategory(primaryCategory, language);
      allJokes = [...allJokes, ...jokes];
    }
    
    // Filter out current joke
    allJokes = allJokes.filter(j => j.id !== joke.id);
    
    // Sort by likes (descending)
    allJokes.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    
    // Take top 10
    relatedJokes.value = allJokes.slice(0, 10);
    
    console.log(`Loaded ${relatedJokes.value.length} related jokes`);
  } catch (error) {
    console.error('Error loading related jokes:', error);
    relatedJokes.value = [];
  } finally {
    relatedJokesLoading.value = false;
  }
};

const loadRandomJoke = async () => {
  console.log('=== JokeView: loadRandomJoke called ===');
  console.log('JokeView: Current language:', selectedLanguage.value);
  
  await store.dispatch('jokes/setCategory', '');
  await store.dispatch('jokes/fetchRandomJoke');
  
  if (currentJoke.value) {
    // Generate SEO-friendly URL with category and title
    const url = getJokeUrl(currentJoke.value);
    router.push(url);
  }
};

const loadJokeById = async (jokeId) => {
  console.log('=== JokeView: loadJokeById called ===');
  console.log('JokeView: Loading joke ID:', jokeId);
  
  await store.dispatch('jokes/fetchJokeById', jokeId);
  
  if (currentJoke.value) {
    trackJokeView(
      currentJoke.value.id, 
      currentJoke.value.category, 
      currentJoke.value.language
    );
    
    // Load related jokes after main joke is loaded
    await loadRelatedJokes(currentJoke.value);
  }
};

// SEO Enhancement Functions
const generateSEOTitle = (joke) => {
  if (!joke) return 'Joke - Humoraq';
  
  let categoryName = 'General';
  if (Array.isArray(joke.categories) && joke.categories.length > 0) {
    categoryName = getCategoryLabel(joke.categories[0]);
  } else if (joke.category) {
    categoryName = getCategoryLabel(joke.category);
  }
  
  if (joke.title && joke.title.trim()) {
    return `${joke.title} | ${categoryName} Jokes | Humoraq`;
  }
  
  const preview = joke.text.substring(0, 40).trim();
  return `${categoryName} Joke: ${preview}... | Humoraq`;
};

const generateSEODescription = (joke) => {
  if (!joke) return 'View and enjoy jokes from Humoraq';
  
  let categoryName = 'General';
  if (Array.isArray(joke.categories) && joke.categories.length > 0) {
    categoryName = getCategoryLabel(joke.categories[0]);
  } else if (joke.category) {
    categoryName = getCategoryLabel(joke.category);
  }
  
  const languageName = { en: 'English', fr: 'French', ar: 'Arabic' }[joke.language] || 'English';
  const preview = joke.text.substring(0, 140).trim();
  
  return `${categoryName} joke in ${languageName}: "${preview}..." Read more funny ${categoryName.toLowerCase()} jokes on Humoraq!`;
};

const generateSEOKeywords = (joke) => {
  if (!joke) return 'funny jokes, best jokes, humor';
  
  let categoryName = 'general';
  if (Array.isArray(joke.categories) && joke.categories.length > 0) {
    categoryName = getCategoryLabel(joke.categories[0]).toLowerCase();
  } else if (joke.category) {
    categoryName = getCategoryLabel(joke.category).toLowerCase();
  }
  
  const languageName = { en: 'english', fr: 'french', ar: 'arabic' }[joke.language] || 'english';
  
  let keywords = `${categoryName} jokes, funny ${categoryName} jokes, ${categoryName} jokes in ${languageName}`;
  
  if (joke.title && joke.title.trim()) {
    const titleWords = joke.title.toLowerCase().split(' ').slice(0, 3).join(' ');
    keywords += `, ${titleWords}, ${titleWords} joke`;
  }
  
  keywords += `, short ${categoryName} jokes, best ${categoryName} jokes 2026, ${categoryName} humor`;
  
  return keywords;
};

const addJokeStructuredData = (joke) => {
  if (!joke) return;
  
  let category = 'General';
  if (Array.isArray(joke.categories) && joke.categories.length > 0) {
    category = joke.categories[0];
  } else if (joke.category) {
    category = joke.category;
  }
  
  const categorySlug = getCategorySlug(joke);
  const titleSlug = generateJokeSlug(joke);
  const jokeUrl = `https://humoraq.com/${categorySlug}-jokes/${titleSlug}-${joke.id}`;
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': jokeUrl,
        'headline': joke.title || `Funny ${getCategoryLabel(category)} Joke`,
        'text': joke.text,
        'inLanguage': joke.language === 'ar' ? 'ar' : joke.language === 'fr' ? 'fr' : 'en',
        'genre': category,
        'author': {
          '@type': 'Person',
          'name': joke.author?.name || 'Anonymous'
        },
        'datePublished': joke.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        'dateModified': joke.updatedAt?.toDate?.()?.toISOString() || joke.createdAt?.toDate?.()?.toISOString(),
        'interactionStatistic': [
          {
            '@type': 'InteractionCounter',
            'interactionType': 'https://schema.org/LikeAction',
            'userInteractionCount': joke.likes || 0
          },
          {
            '@type': 'InteractionCounter',
            'interactionType': 'https://schema.org/ViewAction',
            'userInteractionCount': joke.views || 0
          }
        ],
        'publisher': {
          '@type': 'Organization',
          'name': 'Humoraq',
          'url': 'https://humoraq.com',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://humoraq.com/logo.png'
          }
        }
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://humoraq.com'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Jokes',
            'item': 'https://humoraq.com/feed'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': getCategoryLabel(category),
            'item': `https://humoraq.com/category/${categorySlug}`
          },
          {
            '@type': 'ListItem',
            'position': 4,
            'name': joke.title || 'Joke',
            'item': jokeUrl
          }
        ]
      }
    ]
  };
  
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }
  
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
};

// Watch for route changes
watch(
  () => route.params.titleSlugWithId,
  async (titleSlugWithId, oldTitleSlugWithId) => {
    if (!titleSlugWithId || titleSlugWithId === oldTitleSlugWithId) return;
    
    const jokeId = titleSlugWithId.substring(titleSlugWithId.lastIndexOf('-') + 1);
    
    if (jokeId) {
      console.log('=== JokeView: Route changed, loading new joke:', jokeId);
      
      await loadJokeById(String(jokeId));
      
      if (currentJoke.value && currentJoke.value.text) {
        const title = generateSEOTitle(currentJoke.value);
        const description = generateSEODescription(currentJoke.value);
        const keywords = generateSEOKeywords(currentJoke.value);
        const canonicalUrl = `https://humoraq.com${getJokeUrl(currentJoke.value)}`;
        
        updateSEO({
          title,
          description,
          keywords,
          canonical: canonicalUrl,
          ogImage: 'https://humoraq.com/og-joke-image.png'
        });
        
        addJokeStructuredData(currentJoke.value);
      }
    }
  },
  { immediate: true }
);

onMounted(() => {
  updateSEO({
    title: 'Funny Joke - Humoraq | Best Jokes 2026',
    description: 'Read funny jokes from our community. Short jokes, one-liners, and humor in multiple languages.',
    keywords: 'funny jokes, best jokes, short jokes, one line jokes, humor, comedy'
  });
});
</script>

<style scoped>
/* Existing styles */
.joke-title-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
  border-left: 4px solid #667eea;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.5s ease;
}

.joke-main-title {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-color, #0f1419);
  margin: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.dark-mode .joke-title-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-left-color: #6ea8fe;
}

.dark-mode .joke-main-title {
  color: var(--text-color, #e7e9ea);
}

/* NEW: Related Jokes Section Styles */
.related-jokes-section {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 2px solid rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.6s ease;
}

.dark-mode .related-jokes-section {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.section-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color, #0f1419);
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.title-icon {
  font-size: 1.5rem;
}

.section-subtitle {
  font-size: 1rem;
  color: #536471;
  margin: 0;
}

.dark-mode .section-title {
  color: var(--text-color, #e7e9ea);
}

.dark-mode .section-subtitle {
  color: #71767b;
}

/* Related Jokes Grid */
.related-jokes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.related-joke-card {
  background: var(--card-bg, #fff);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.related-joke-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.related-joke-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: rgba(102, 126, 234, 0.3);
}

.related-joke-card:hover::before {
  transform: scaleX(1);
}

.dark-mode .related-joke-card {
  background: var(--card-bg, #2c3034);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .related-joke-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  border-color: rgba(102, 126, 234, 0.5);
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 180px;
}

/* Category Badges */
.category-badges {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 0.875rem;
}

.badge-primary { background: rgba(13, 110, 253, 0.1); color: #0d6efd; }
.badge-success { background: rgba(25, 135, 84, 0.1); color: #198754; }
.badge-danger { background: rgba(220, 53, 69, 0.1); color: #dc3545; }
.badge-warning { background: rgba(255, 193, 7, 0.1); color: #ffc107; }
.badge-info { background: rgba(13, 202, 240, 0.1); color: #0dcaf0; }
.badge-secondary { background: rgba(108, 117, 125, 0.1); color: #6c757d; }
.badge-dark { background: rgba(33, 37, 41, 0.1); color: #212529; }

.dark-mode .badge-primary { background: rgba(13, 110, 253, 0.2); color: #6ea8fe; }
.dark-mode .badge-success { background: rgba(25, 135, 84, 0.2); color: #75b798; }
.dark-mode .badge-danger { background: rgba(220, 53, 69, 0.2); color: #ea868f; }
.dark-mode .badge-warning { background: rgba(255, 193, 7, 0.2); color: #ffc107; }
.dark-mode .badge-info { background: rgba(13, 202, 240, 0.2); color: #6edff6; }
.dark-mode .badge-secondary { background: rgba(108, 117, 125, 0.2); color: #adb5bd; }
.dark-mode .badge-dark { background: rgba(255, 255, 255, 0.2); color: #f8f9fa; }

/* Joke Preview */
.joke-preview {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-color, #0f1419);
  margin: 0 0 auto 0;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
}

.dark-mode .joke-preview {
  color: var(--text-color, #e7e9ea);
}

/* RTL Support */
.rtl-text.joke-preview {
  text-align: right !important;
  direction: rtl !important;
}

.ltr-text.joke-preview {
  text-align: left !important;
  direction: ltr !important;
}

/* Card Footer */
.card-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  margin-top: 1rem;
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
  color: #536471;
  font-weight: 500;
}

.stat-item i {
  font-size: 1rem;
}

.stat-item:first-child i {
  color: #f91880;
}

.stat-item:nth-child(2) i {
  color: #1d9bf0;
}

.dark-mode .stat-item {
  color: #71767b;
}

.read-more {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: auto;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1d9bf0;
  transition: gap 0.2s ease;
}

.related-joke-card:hover .read-more {
  gap: 0.5rem;
}

.read-more i {
  font-size: 1.25rem;
}

/* CTA Section */
.cta-section {
  margin-top: 2rem;
  animation: fadeInUp 0.5s ease;
}

.cta-section .card {
  border-width: 2px;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

.cta-section .card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(13, 110, 253, 0.2) !important;
}

.cta-section .card-title {
  font-weight: 600;
  color: var(--text-color);
}

.cta-section .btn {
  min-width: 200px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.cta-section .btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
}

.dark-mode .cta-section .card {
  background-color: var(--card-bg);
  border-color: var(--primary-color);
}

.dark-mode .cta-section .card:hover {
  box-shadow: 0 8px 25px rgba(13, 110, 253, 0.3) !important;
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

/* Responsive Design */
@media (max-width: 768px) {
  .joke-title-section {
    padding: 1.5rem;
  }

  .joke-main-title {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 1.5rem;
    flex-direction: column;
  }

  .section-subtitle {
    font-size: 0.9375rem;
  }

  .related-jokes-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .card-content {
    min-height: 160px;
  }
}

@media (max-width: 576px) {
  .joke-title-section {
    padding: 1.25rem;
  }

  .joke-main-title {
    font-size: 1.25rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .cta-section .btn {
    min-width: 100%;
    font-size: 0.95rem;
  }

  .cta-section .card-body {
    padding: 1.5rem !important;
  }

  .joke-preview {
    font-size: 0.875rem;
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }
}
</style>