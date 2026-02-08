<template>
  <DefaultLayout>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          
          <!-- Hero Header -->
          <div class="spotlight-hero text-center mb-5">
            <div class="mb-3">
              <i class="bi bi-star-fill spotlight-icon"></i>
            </div>
            <h1 class="display-5 fw-bold mb-3">{{ t('spotlight.hero.title') }}</h1>
            <p class="lead text-muted">{{ t('spotlight.hero.description') }}</p>
          </div>

          <!-- Joke Card with Fade Transition -->
          <div class="joke-spotlight-container" @mouseenter="pauseAutoRotation" @mouseleave="resumeAutoRotation">
            
            <!-- Loading State -->
            <div v-if="loading && !spotlightJoke" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">{{ t('spotlight.loading') }}</span>
              </div>
            </div>

            <!-- Joke Card -->
            <Transition name="fade" mode="out-in" v-else-if="spotlightJoke">
              <JokeCard :key="spotlightJoke.id" :joke="spotlightJoke" class="mb-4" />
            </Transition>

            <!-- Empty State -->
            <div v-else class="alert alert-info text-center">
              <i class="bi bi-info-circle me-2"></i>
              {{ t('spotlight.empty') }}
            </div>
          </div>

          <!-- Controls -->
          <div class="text-center mb-4" v-if="spotlightJoke">
            <div class="d-flex justify-content-center gap-3 mb-3">
              <button 
                @click="toggleAutoRotation" 
                class="btn btn-outline-primary"
                :disabled="loading"
              >
                <span v-if="isAutoRotationActive">
                  <i class="bi bi-pause-fill"></i> Pause
                </span>
                <span v-else>
                  <i class="bi bi-play-fill"></i> Resume
                </span>
              </button>

              <button 
                @click="loadRandomJoke" 
                class="btn btn-primary"
                :disabled="loading"
              >
                <span v-if="loading">
                  <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                  Loading...
                </span>
                <span v-else>
                  <i class="bi bi-skip-forward-fill"></i> Next Joke
                </span>
              </button>
            </div>

            <!-- Timer Progress Bar -->
            <div v-if="isAutoRotationActive && !isPaused" class="progress" style="height: 4px;">
              <div 
                class="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                role="progressbar" 
                :style="{ width: progressPercentage + '%' }"
              ></div>
            </div>
            <small v-if="isAutoRotationActive && !isPaused" class="text-muted">
              Next joke in {{ remainingSeconds }}s
            </small>
          </div>

        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import JokeCard from '@/components/JokeCard.vue';
import { updateDynamicSEO } from '@/utils/dynamicSEO';
import { t, currentLanguage } from '@/i18n';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '@/services/firebase';

const store = useStore();

// State
const spotlightJoke = ref(null);
const loading = ref(false);
const isAutoRotationActive = ref(true);
const isPaused = ref(false);
const rotationTimer = ref(null);
const progressTimer = ref(null);
const currentDelay = ref(8000); // Default 8 seconds
const elapsedTime = ref(0);

// Get selected languages from store
const selectedLanguages = computed(() => store.getters['preferences/selectedLanguages']);

// Progress calculation
const progressPercentage = computed(() => {
  return Math.min((elapsedTime.value / currentDelay.value) * 100, 100);
});

const remainingSeconds = computed(() => {
  const remaining = Math.ceil((currentDelay.value - elapsedTime.value) / 1000);
  return Math.max(remaining, 0);
});

// Calculate delay based on joke text length
const calculateDelay = (joke) => {
  if (!joke || !joke.text) return 8000;
  const characterCount = joke.text.length;
  // 50ms per character + 3 second base
  const delay = Math.max((characterCount * 50) + 3000, 5000);
  console.log(`Spotlight delay: ${characterCount} chars → ${delay}ms`);
  return delay;
};

// FIXED: Load random joke with proper Firestore query
const loadRandomJoke = async () => {
  console.log('🎯 Spotlight: Loading random joke for languages:', selectedLanguages.value);
  stopAutoRotation();
  loading.value = true;

  try {
    const allJokes = [];
    
    // Fetch jokes for each selected language
    for (const language of selectedLanguages.value) {
      console.log(`📚 Fetching jokes for language: ${language}`);
      
      const q = query(
        collection(db, 'jokes'),
        where('status', '==', 'published'),
        where('language', '==', language),
        limit(20) // Get 20 random jokes per language
      );

      const snapshot = await getDocs(q);
      
      snapshot.forEach((doc) => {
        allJokes.push({
          id: doc.id,
          ...doc.data()
        });
      });
    }

    console.log(`✅ Spotlight: Fetched ${allJokes.length} total jokes`);

    if (allJokes.length > 0) {
      // Pick a random joke from all fetched jokes
      const randomIndex = Math.floor(Math.random() * allJokes.length);
      const selectedJoke = allJokes[randomIndex];
      
      spotlightJoke.value = selectedJoke;
      
      // Calculate delay and start auto-rotation
      currentDelay.value = calculateDelay(selectedJoke);
      
      if (isAutoRotationActive.value && !isPaused.value) {
        startAutoRotation();
      }
      
      console.log(`✅ Spotlight: Loaded joke ${selectedJoke.id} (${selectedJoke.language})`);
    } else {
      console.warn('⚠️ Spotlight: No jokes found for selected languages');
      spotlightJoke.value = null;
    }
  } catch (error) {
    console.error('❌ Spotlight: Error loading joke:', error);
    spotlightJoke.value = null;
  } finally {
    loading.value = false;
  }
};

const startAutoRotation = () => {
  if (!spotlightJoke.value) return;

  console.log('▶️ Spotlight: Starting auto-rotation');
  stopAutoRotation();

  elapsedTime.value = 0;

  // Timer for next joke
  rotationTimer.value = setTimeout(() => {
    if (isAutoRotationActive.value && !isPaused.value) {
      console.log('🔄 Spotlight: Auto-rotating to next joke');
      loadRandomJoke();
    }
  }, currentDelay.value);

  // Progress bar update timer
  progressTimer.value = setInterval(() => {
    if (!isPaused.value) {
      elapsedTime.value += 100;
    }
  }, 100);
};

const stopAutoRotation = () => {
  if (rotationTimer.value) {
    clearTimeout(rotationTimer.value);
    rotationTimer.value = null;
  }
  if (progressTimer.value) {
    clearInterval(progressTimer.value);
    progressTimer.value = null;
  }
  elapsedTime.value = 0;
};

const toggleAutoRotation = () => {
  isAutoRotationActive.value = !isAutoRotationActive.value;

  if (isAutoRotationActive.value) {
    isPaused.value = false;
    startAutoRotation();
    console.log('▶️ Spotlight: Auto-rotation resumed');
  } else {
    stopAutoRotation();
    console.log('⏸️ Spotlight: Auto-rotation paused');
  }
};

const pauseAutoRotation = () => {
  isPaused.value = true;
};

const resumeAutoRotation = () => {
  if (isAutoRotationActive.value) {
    isPaused.value = false;
  }
};

const handleVisibilityChange = () => {
  if (document.hidden) {
    isPaused.value = true;
  } else {
    if (isAutoRotationActive.value) {
      isPaused.value = false;
    }
  }
};

// SEO update function
const updateSpotlightSEO = () => {
  const lang = currentLanguage.value;
  
  updateDynamicSEO({
    title: t('seo.spotlightTitle', lang),
    description: t('seo.spotlightDescription', lang),
    keywords: t('seo.spotlightKeywords', lang),
    lang: lang,
    ogLocale: lang === 'en' ? 'en_US' : lang === 'fr' ? 'fr_FR' : lang === 'es' ? 'es_ES' : 'ar_AR'
  });
};

// Watch for language changes
watch(currentLanguage, updateSpotlightSEO);

watch(selectedLanguages, () => {
  console.log('🌍 Spotlight: Languages changed, loading new joke');
  loadRandomJoke();
}, { deep: true });

// Watch spotlight joke for auto-rotation restart
watch(spotlightJoke, (newJoke) => {
  if (newJoke && isAutoRotationActive.value && !isPaused.value) {
    startAutoRotation();
  }
});

onMounted(() => {
  updateSpotlightSEO();
  document.addEventListener('visibilitychange', handleVisibilityChange);
  loadRandomJoke();
});

onUnmounted(() => {
  console.log('🧹 Spotlight: Cleaning up timers');
  stopAutoRotation();
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<style scoped>
/* Hero Section */
.spotlight-hero {
  padding: 2rem 0;
}

.spotlight-icon {
  font-size: 3rem;
  color: #ffc107;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.joke-spotlight-container {
  min-height: 250px;
  position: relative;
}

/* Progress Bar */
.progress {
  border-radius: 4px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
}

.dark-mode .progress {
  background-color: rgba(255, 255, 255, 0.1);
}

.progress-bar {
  transition: width 0.1s linear;
}

/* Buttons */
.btn {
  min-width: 120px;
}

/* Responsive */
@media (max-width: 576px) {
  .spotlight-icon {
    font-size: 2.5rem;
  }
  
  .display-5 {
    font-size: 2rem;
  }
  
  .btn {
    min-width: 100px;
    font-size: 0.9rem;
  }
}
</style>