<template>
  <DefaultLayout>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <router-link to="/categories" class="btn btn-outline-secondary mb-4">
            {{ t('category.backButton') }}
          </router-link>

          <!-- Enhanced Header with SEO-optimized content -->
          <div class="category-header mb-4">
            <h1 class="display-5 mb-2">
              {{ categoryTitle }}
            </h1>
            <p class="lead text-muted" v-if="category">
              ⭐⭐⭐⭐⭐ 5/5 - {{ getCategoryDescription() }}
            </p>
            <div class="category-meta text-muted">
              <small>
                <i class="bi bi-collection me-1"></i>
                {{ jokes.length }} {{ jokes.length === 1 ? t('category.jokeCount.singular') : t('category.jokeCount.plural') }}
                <span class="mx-2">•</span>
                <i class="bi bi-translate me-1"></i>
                {{ t('category.meta.multipleLanguages') }}
                <span class="mx-2">•</span>
                <i class="bi bi-clock-history me-1"></i>
                {{ t('category.meta.updatedRegularly') }}
              </small>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{{ t('category.loading') }}</span>
            </div>
          </div>

          <!-- Jokes Grid -->
          <JokeGrid v-else-if="jokes.length > 0" :jokes="jokes" :preview-length="120" />

          <!-- Empty State -->
          <div v-else class="alert alert-info">
            <h5 class="alert-heading">{{ t('category.empty.title', { category: categoryName.toLowerCase() }) }}</h5>
            <p class="mb-0">{{ t('category.empty.description', { category: categoryName.toLowerCase() }) }}</p>
            <hr>
            <router-link to="/submit" class="btn btn-primary btn-sm mt-2">
              {{ t('category.empty.submitButton', { category: categoryName }) }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { getCategoryBySlug, slugToValue } from '@/config/categories';
import JokeGrid from '../components/JokeGrid.vue';
import { updateSEO } from '../utils/seo';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { t, currentLanguage } from '@/i18n';

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
});

const store = useStore();

const jokes = computed(() => store.getters['jokes/jokes']);
const loading = computed(() => store.getters['jokes/loading']);
const selectedLanguages = computed(() => store.getters['preferences/selectedLanguages']);

const category = computed(() => getCategoryBySlug(props.slug));
const categoryName = computed(() => category.value ? t(`categoryNames.${category.value.value}`) : props.slug);
const categoryTitle = computed(() => category.value ? t(`categories.titles.${category.value.value}`) : props.slug);
const categoryValue = computed(() => slugToValue(props.slug));

// Get category description (translated)
const getCategoryDescription = () => {
  if (!category.value) return '';
  
  return t(`categories.descriptions.${category.value.value}`);
};

// SEO optimization helpers (using seo.js translations)
const generateCategorySEOTitle = () => {
  if (!category.value) return 'Category Jokes';
  
  const lang = currentLanguage.value;
  const categoryKey = category.value.value.replace(/\s+/g, ''); // Remove spaces: "Old People" -> "OldPeople"
  
  return t(`seo.categories.title.${categoryKey}`, lang);
};

const generateCategorySEODescription = () => {
  if (!category.value) return '';
  
  const lang = currentLanguage.value;
  const categoryKey = category.value.value.replace(/\s+/g, ''); // Remove spaces
  
  return t(`seo.categories.description.${categoryKey}`, lang);
};

const generateCategorySEOKeywords = () => {
  const name = categoryName.value.toLowerCase();
  return `${name} jokes, funny ${name} jokes, ${name} humor, best ${name} jokes 2026, short ${name} jokes, ${name} one liners, ${name} jokes in english, ${name} jokes in french, ${name} jokes to tell friends, clean ${name} jokes`;
};

const addCategoryStructuredData = () => {
  if (jokes.value.length === 0) return;
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      // ItemList Schema
      {
        '@type': 'ItemList',
        'name': `${categoryName.value} Jokes`,
        'description': getCategoryDescription(),
        'url': `https://humoraq.com/category/${props.slug}`,
        'numberOfItems': jokes.value.length,
        'itemListElement': jokes.value.slice(0, 10).map((joke, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'url': `https://humoraq.com/joke/${joke.id}`,
          'name': joke.title || joke.text.substring(0, 60) + '...'
        }))
      },
      // BreadcrumbList Schema
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
            'name': 'Categories',
            'item': 'https://humoraq.com/categories'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': categoryName.value,
            'item': `https://humoraq.com/category/${props.slug}`
          }
        ]
      },
      // CollectionPage Schema
      {
        '@type': 'CollectionPage',
        'name': `${categoryName.value} Jokes Collection`,
        'description': getCategoryDescription(),
        'url': `https://humoraq.com/category/${props.slug}`,
        'inLanguage': ['en', 'fr', 'es', 'ar'],
        'isPartOf': {
          '@type': 'WebSite',
          'name': 'Humoraq',
          'url': 'https://humoraq.com'
        }
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

const updateCategorySEO = () => {
  const title = generateCategorySEOTitle();
  const description = generateCategorySEODescription();
  const keywords = generateCategorySEOKeywords();
  
  updateSEO({
    title,
    description,
    keywords,
    canonical: `https://humoraq.com/category/${props.slug}`,
    ogImage: `https://humoraq.com/og-category-${props.slug}.png`
  });
  
  // Add structured data
  addCategoryStructuredData();
};

const loadJokes = async () => {
  if (categoryValue.value) {
    await store.dispatch('jokes/fetchJokesByCategory', categoryValue.value);
  } else {
    console.error('Invalid category slug:', props.slug);
  }
};

// Watch for language changes from GLOBAL state
watch(selectedLanguages, () => {
  console.log('=== Languages changed, reloading category ===');
  loadJokes();
}, { deep: true });

// Watch for language UI changes
watch(currentLanguage, () => {
  console.log('=== UI Language changed, updating SEO ===');
  updateCategorySEO();
});

// Watch for route changes
watch(() => props.slug, () => {
  loadJokes();
  updateCategorySEO();
});

// Watch jokes to update SEO when loaded
watch(jokes, () => {
  updateCategorySEO();
});

onMounted(() => {
  loadJokes();
  updateCategorySEO();
});
</script>

<style scoped>
.category-header {
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 1.5rem;
}

.category-meta {
  font-size: 0.9rem;
}

.category-meta i {
  color: var(--primary-color);
}

.dark-mode .category-header {
  border-bottom-color: var(--border-color);
}
</style>