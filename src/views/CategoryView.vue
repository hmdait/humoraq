<template>
  <DefaultLayout>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <router-link to="/categories" class="btn btn-outline-secondary mb-4">
            ← Back to Categories
          </router-link>

          <!-- Enhanced Header with SEO-optimized content -->
          <div class="category-header mb-4">
            <h1 class="display-5 mb-2">
              {{ categoryName }} Jokes
            </h1>
            <p class="lead text-muted" v-if="category">
              {{ getCategoryDescription() }}
            </p>
            <div class="category-meta text-muted">
              <small>
                <i class="bi bi-collection me-1"></i>
                {{ jokes.length }} {{ jokes.length === 1 ? 'joke' : 'jokes' }} available
                <span class="mx-2">•</span>
                <i class="bi bi-translate me-1"></i>
                Multiple languages
                <span class="mx-2">•</span>
                <i class="bi bi-clock-history me-1"></i>
                Updated regularly
              </small>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <!-- Jokes Grid -->
          <JokeGrid v-else-if="jokes.length > 0" :jokes="jokes" :preview-length="120" />

          <!-- Empty State -->
          <div v-else class="alert alert-info">
            <h5 class="alert-heading">No {{ categoryName.toLowerCase() }} jokes found</h5>
            <p class="mb-0">Try selecting more languages from the header or be the first to submit a {{ categoryName.toLowerCase() }} joke!</p>
            <hr>
            <router-link to="/submit" class="btn btn-primary btn-sm mt-2">
              Submit a {{ categoryName }} Joke
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
const categoryName = computed(() => category.value ? category.value.label : props.slug);
const categoryValue = computed(() => slugToValue(props.slug));

// Enhanced category descriptions for SEO
const getCategoryDescription = () => {
  if (!category.value) return '';
  
  // If category already has description, use it
  if (category.value.description) {
    return category.value.description;
  }
  
  // Otherwise provide SEO-friendly descriptions
  const descriptions = {
    'General': 'knock knock jokes: Explore our collection of general humor for everyone. From everyday situations to universal experiences that make us laugh.',
    'Tech': 'knock knock jokes: Hilarious jokes about technology, programming, coding, and the digital world. Perfect for developers, engineers, and tech enthusiasts!',
    'Work': 'knock knock jokes: Office humor and workplace jokes that every professional can relate to. Lighten up your work day with these funny work stories!',
    'Animals': 'knock knock jokes: Funny jokes about our furry, feathered, and finned friends. Perfect for pet lovers and animal enthusiasts!',
    'Food': 'knock knock jokes: Delicious humor about cooking, eating, restaurants, and all things culinary. Food jokes that will make you hungry for more laughs!',
    'Relationships': 'knock knock jokes: Humorous takes on dating, love, marriage, and relationships. Laugh about the ups and downs of romance!',
    'Family': 'knock knock jokes: Family-friendly, dad jokes 2026, jokes about parents, kids, siblings, and family life. Humor the whole family can enjoy together!',
    'School': 'knock knock jokes: Student life, teachers, homework, and educational humor. Perfect for anyone who\'s been through the school experience!',
    'Friends': 'knock knock jokes: Jokes about friendship, social situations, and hanging out with buddies. Share these with your best friends!',
    'Adult': 'knock knock jokes: Mature humor for adult audiences. Sophisticated jokes and witty humor for grown-ups.',
    'Sports': 'knock knock jokes: unny jokes about sports, athletes, games, and competition. Score big laughs with these sporting jokes!',
    'Old People': 'knock knock jokes: Lighthearted humor about aging, retirement, and senior life. Age is just a number, but these jokes are timeless!',
    'Women': 'knock knock jokes: Jokes celebrating women and female perspectives. Humor from a woman\'s point of view!',
    'Men': 'knock knock jokes: Jokes about guys and male perspectives. Laugh at the funny side of being a man!',
    'Kids': 'knock knock jokes: Fun, clean, and family-friendly kids jokes perfect for children, parents, and all ages.'
  };
  
  return descriptions[category.value.label] || 'Browse our collection of funny jokes in this category.';
};

// SEO optimization helpers
const generateCategorySEOTitle = () => {
  const name = categoryName.value;
  return `${name} Jokes - Funny ${name} Humor | Best ${name} Jokes 2026`;
};

const generateCategorySEODescription = () => {
  const name = categoryName.value.toLowerCase();
  const count = jokes.value.length;
  return `Discover ${count > 0 ? count + '+' : ''} funny ${name} jokes! Read the best ${name} humor in English, French, and Arabic. Short ${name} jokes, one-liners, and hilarious ${name} stories. Updated daily!`;
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
        'inLanguage': ['en', 'fr', 'ar'],
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
  
  // Initial SEO update
  updateSEO({
    title: `${categoryName.value || 'Category'} Jokes - Humoraq | Best Jokes 2026`,
    description: `Browse all ${(categoryName.value || props.slug || 'category').toLowerCase()} jokes. Funny and entertaining content in multiple languages.`,
    keywords: `${(categoryName.value || props.slug).toLowerCase()} jokes, funny jokes, humor`
  });
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