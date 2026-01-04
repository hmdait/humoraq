import { ref, computed } from 'vue';
import { 
  getJokeById, 
  getRandomJoke, 
  getJokesByCategory,
  getJokesByLanguage,
  getCategoryCount as getCount,
  getCategories 
} from '../services/jokeService';

export function useJokes() {
  // Create local refs for each component instance
  const currentJoke = ref(null);
  const jokes = ref([]);
  const loading = ref(false);
  const currentLanguage = ref('en');
  const currentCategory = ref('');

  const loadRandomJoke = async () => {
    loading.value = true;
    try {
      const filters = {
        language: currentLanguage.value,
        category: currentCategory.value || undefined
      };
      currentJoke.value = await getRandomJoke(filters);
    } catch (error) {
      console.error('Error loading random joke:', error);
      currentJoke.value = null;
    } finally {
      loading.value = false;
    }
  };

  const loadJokeById = async (id) => {
    loading.value = true;
    try {
      currentJoke.value = await getJokeById(id);
    } catch (error) {
      console.error('Error loading joke:', error);
      currentJoke.value = null;
    } finally {
      loading.value = false;
    }
  };

  const loadJokesByCategory = async (category) => {
    loading.value = true;
    try {
      jokes.value = await getJokesByCategory(category, currentLanguage.value);
    } catch (error) {
      console.error('Error loading jokes by category:', error);
      jokes.value = [];
    } finally {
      loading.value = false;
    }
  };

  const loadJokesByLanguage = async (language) => {
    loading.value = true;
    try {
      jokes.value = await getJokesByLanguage(language);
    } catch (error) {
      console.error('Error loading jokes by language:', error);
      jokes.value = [];
    } finally {
      loading.value = false;
    }
  };

  const categories = computed(() => getCategories());

  const getCategoryCount = async (categorySlug) => {
    try {
      return await getCount(categorySlug, currentLanguage.value);
    } catch (error) {
      console.error('Error getting category count:', error);
      return 0;
    }
  };

  const getCategoryName = (slug) => {
    const category = categories.value.find(c => c.slug === slug);
    return category ? category.name : slug;
  };

  return {
    currentJoke,
    jokes,
    loading,
    currentLanguage,
    currentCategory,
    categories,
    loadRandomJoke,
    loadJokeById,
    loadJokesByCategory,
    loadJokesByLanguage,
    getCategoryCount,
    getCategoryName
  };
}