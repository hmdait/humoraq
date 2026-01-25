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

          <JokeCard 
            v-if="currentJoke" 
            :joke="currentJoke"
            :show-link="false"
            class="mb-4"
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

          <!-- Call-to-Action Section -->
          <div v-if="currentJoke" class="cta-section">
            <div class="card border-primary shadow-sm">
              <div class="card-body text-center p-4">
                <h5 class="card-title mb-3">
                  Got a joke to share? 😄
                </h5>
                <p class="card-text text-muted mb-3">
                  Make someone laugh today! Share your favorite joke with our community.
                </p>
                <router-link 
                  to="/submit" 
                  class="btn btn-primary btn-lg"
                >
                  ✍️ Share Your Favorite Joke
                </router-link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import JokeCard from '../components/JokeCard.vue';
import JokeButton from '../components/JokeButton.vue';
import { updateSEO } from '../utils/seo';
import { trackJokeView } from '../services/analyticsService';
import { getCategoryLabel } from '@/config/categories';

const router = useRouter();
const route = useRoute();
const store = useStore();

const currentJoke = computed(() => store.getters['jokes/currentJoke']);
const loading = computed(() => store.getters['jokes/loading']);
const selectedLanguage = computed(() => store.getters['preferences/selectedLanguage']);

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

const getCategoryIcon = (joke) => {
  if (Array.isArray(joke.categories) && joke.categories.length > 0) {
    const { getCategoryIcon: getIcon } = require('@/config/categories');
    return getIcon(joke.categories[0]);
  } else if (joke.category) {
    const { getCategoryIcon: getIcon } = require('@/config/categories');
    return getIcon(joke.category);
  }
  return 'bi-chat-square-text';
};

const getLanguageFullName = (code) => {
  const names = { en: 'English', fr: 'Français', ar: 'العربية' };
  return names[code] || 'English';
};

const getAuthorName = (author) => {
  if (!author || !author.name) return 'Anonymous';
  return author.name;
};

const loadRandomJoke = async () => {
  console.log('=== JokeView: loadRandomJoke called ===');
  console.log('JokeView: Current language:', selectedLanguage.value);
  
  await store.dispatch('jokes/setCategory', '');
  await store.dispatch('jokes/fetchRandomJoke');
  
  if (currentJoke.value) {
    router.push(`/joke/${currentJoke.value.id}`);
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
  }
};

// SEO Enhancement Functions
const generateSEOTitle = (joke) => {
  if (!joke) return 'Joke - Humoraq';
  
  // Get category name (handle both array and single category)
  let categoryName = 'General';
  if (Array.isArray(joke.categories) && joke.categories.length > 0) {
    categoryName = getCategoryLabel(joke.categories[0]);
  } else if (joke.category) {
    categoryName = getCategoryLabel(joke.category);
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
  
  return `${categoryName} jokes, funny ${categoryName} jokes, ${categoryName} jokes in ${languageName}, short ${categoryName} jokes, best ${categoryName} jokes 2026, ${categoryName} humor, ${categoryName} one liners`;
};

const addJokeStructuredData = (joke) => {
  if (!joke) return;
  
  // Get first category
  let category = 'General';
  if (Array.isArray(joke.categories) && joke.categories.length > 0) {
    category = joke.categories[0];
  } else if (joke.category) {
    category = joke.category;
  }
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      // CreativeWork Schema for the Joke
      {
        '@type': 'CreativeWork',
        '@id': `https://humoraq.com/joke/${joke.id}`,
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
      // Breadcrumb Schema
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
            'item': `https://humoraq.com/category/${category.toLowerCase()}`
          },
          {
            '@type': 'ListItem',
            'position': 4,
            'name': 'Joke',
            'item': `https://humoraq.com/joke/${joke.id}`
          }
        ]
      }
    ]
  };
  
  // Remove existing structured data
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }
  
  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
};

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await loadJokeById(String(newId));
      
      if (currentJoke.value && currentJoke.value.text) {
        const title = generateSEOTitle(currentJoke.value);
        const description = generateSEODescription(currentJoke.value);
        const keywords = generateSEOKeywords(currentJoke.value);
        
        // Update meta tags
        updateSEO({
          title,
          description,
          keywords,
          canonical: `https://humoraq.com/joke/${currentJoke.value.id}`,
          ogImage: 'https://humoraq.com/og-joke-image.png'
        });
        
        // Add structured data
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
/* ============================================
   ENHANCED TITLE SECTION FOR SEO
   ============================================ */
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
  margin: 0 0 1rem 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.joke-meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.meta-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  transition: all 0.2s ease;
}

.meta-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.meta-badge i {
  font-size: 1rem;
}

.category-badge {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  color: #667eea;
  border-color: #667eea;
}

.language-badge {
  background: linear-gradient(135deg, rgba(13, 202, 240, 0.1), rgba(13, 110, 253, 0.1));
  color: #0dcaf0;
  border-color: #0dcaf0;
}

.author-badge {
  background: linear-gradient(135deg, rgba(25, 135, 84, 0.1), rgba(32, 201, 151, 0.1));
  color: #198754;
  border-color: #198754;
}

/* Dark mode */
.dark-mode .joke-title-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-left-color: #6ea8fe;
}

.dark-mode .joke-main-title {
  color: var(--text-color, #e7e9ea);
}

.dark-mode .meta-badge {
  background: rgba(44, 48, 52, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .category-badge {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
  color: #9ec5fe;
  border-color: #6ea8fe;
}

.dark-mode .language-badge {
  background: linear-gradient(135deg, rgba(13, 202, 240, 0.2), rgba(13, 110, 253, 0.2));
  color: #6edff6;
  border-color: #0dcaf0;
}

.dark-mode .author-badge {
  background: linear-gradient(135deg, rgba(25, 135, 84, 0.2), rgba(32, 201, 151, 0.2));
  color: #75b798;
  border-color: #198754;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .joke-title-section {
    padding: 1.5rem;
  }

  .joke-main-title {
    font-size: 1.5rem;
  }

  .meta-badge {
    font-size: 0.8125rem;
    padding: 0.375rem 0.75rem;
  }
}

@media (max-width: 576px) {
  .joke-title-section {
    padding: 1.25rem;
  }

  .joke-main-title {
    font-size: 1.25rem;
  }

  .joke-meta-info {
    gap: 0.5rem;
  }

  .meta-badge {
    font-size: 0.75rem;
    padding: 0.375rem 0.625rem;
  }

  .meta-badge i {
    font-size: 0.875rem;
  }
}

/* ============================================
   CTA SECTION (existing styles)
   ============================================ */
/* CTA Section Styling */
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

/* Dark mode support */
.dark-mode .cta-section .card {
  background-color: var(--card-bg);
  border-color: var(--primary-color);
}

.dark-mode .cta-section .card:hover {
  box-shadow: 0 8px 25px rgba(13, 110, 253, 0.3) !important;
}

/* Fade-in animation */
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

/* Responsive adjustments */
@media (max-width: 576px) {
  .cta-section .btn {
    min-width: 100%;
    font-size: 0.95rem;
  }

  .cta-section .card-body {
    padding: 1.5rem !important;
  }
}
</style>