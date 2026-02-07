<template>
  <DefaultLayout>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <!-- Page Header -->
          <div class="text-center mb-4">
            <h1 class="display-5 mb-2">Jokes of the Day – Today’s Funniest Jokes</h1>
          </div>

          <!-- NO CATEGORY FILTER - removed completely -->

          <!-- Joke Card with Fade Transition -->
          <div class="joke-spotlight-container" @mouseenter="pauseAutoRotation" @mouseleave="resumeAutoRotation">
            <Transition name="fade" mode="out-in">
              <!-- FIXED: Use local spotlightJoke instead of shared store currentJoke -->
              <JokeCard v-if="spotlightJoke" :key="spotlightJoke.id" :joke="spotlightJoke" class="mb-4" />
            </Transition>
          </div>

          <!-- Controls -->
          <div class="text-center">
            <div class="d-flex justify-content-center gap-3 mb-3">
              <button @click="toggleAutoRotation" class="btn btn-outline-secondary" :disabled="loading">
                <span v-if="isAutoRotationActive">
                  <i class="bi bi-pause-fill"></i> Pause
                </span>
                <span v-else>
                  <i class="bi bi-play-fill"></i> Resume
                </span>
              </button>

              <JokeButton @click="loadRandomJoke" :loading="loading" text="⏭ Next Joke" />
            </div>

            <!-- Timer Progress Bar -->
            <div v-if="isAutoRotationActive && !isPaused" class="progress" style="height: 4px;">
              <div class="progress-bar bg-primary" role="progressbar" :style="{ width: progressPercent + '%' }"></div>
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
  import JokeCard from '../components/JokeCard.vue';
  import JokeButton from '../components/JokeButton.vue';
  import { updateSEO } from '../utils/seo';
  import { trackSpotlightAction } from '../services/analyticsService';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  // FIXED: Import getRandomJoke directly instead of using Vuex
  import { getRandomJoke } from '../services/jokeService';

  const store = useStore();

  // FIXED: Use LOCAL state for Spotlight instead of shared Vuex store
  const spotlightJoke = ref(null);
  const loading = ref(false);

  // Local state (NO category filter)
  const isAutoRotationActive = ref(true);
  const isPaused = ref(false);
  const rotationTimer = ref(null);
  const progressTimer = ref(null);
  const currentDelay = ref(0);
  const elapsedTime = ref(0);

  // Get selected languages from preferences (this is config, not joke data)
  const selectedLanguages = computed(() => store.getters['preferences/selectedLanguages']);

  // Progress calculation
  const progressPercent = computed(() => {
    if (currentDelay.value === 0) return 0;
    return Math.min((elapsedTime.value / currentDelay.value) * 100, 100);
  });

  const remainingSeconds = computed(() => {
    const remaining = Math.ceil((currentDelay.value - elapsedTime.value) / 1000);
    return Math.max(remaining, 0);
  });

  // Calculate delay based on joke text length
  const calculateDelay = (joke) => {
    if (!joke || !joke.text) return 5000;
    const characterCount = joke.text.length;
    const delay = (characterCount * 40) + 2000;
    console.log(`Spotlight delay: ${characterCount} chars × 40ms + 2000ms = ${delay}ms`);
    return delay;
  };

  // FIXED: Load random joke into LOCAL state (doesn't touch Vuex store)
  const loadRandomJoke = async () => {
    console.log('=== Spotlight: Loading random joke (local state only) ===');
    stopAutoRotation();
    loading.value = true;

    try {
      let allJokes = [];

      // Fetch jokes for all selected languages
      for (const language of selectedLanguages.value) {
        const filters = {
          language: language,
          category: undefined // No category filter in Spotlight
        };

        console.log('Spotlight: Fetching with filters:', filters);

        const joke = await getRandomJoke(filters);
        if (joke) {
          allJokes.push(joke);
        }
      }

      console.log('Spotlight: Total jokes fetched:', allJokes.length);

      // Pick a random joke from all fetched jokes
      if (allJokes.length > 0) {
        const randomJoke = allJokes[Math.floor(Math.random() * allJokes.length)];
        // FIXED: Update LOCAL state only - doesn't affect JokeView!
        spotlightJoke.value = randomJoke;

        if (randomJoke) {
          trackSpotlightAction('next', randomJoke.id);
        }
      } else {
        spotlightJoke.value = null;
        console.warn('Spotlight: No jokes found for selected languages');
      }
    } catch (error) {
      console.error('Spotlight: Error loading random joke:', error);
      spotlightJoke.value = null;
    } finally {
      loading.value = false;
    }
  };

  const startAutoRotation = () => {
    if (!spotlightJoke.value) return;

    console.log('=== Spotlight: Starting auto-rotation ===');
    stopAutoRotation();

    currentDelay.value = calculateDelay(spotlightJoke.value);
    elapsedTime.value = 0;

    rotationTimer.value = setTimeout(() => {
      if (isAutoRotationActive.value && !isPaused.value) {
        trackSpotlightAction('auto_rotate', spotlightJoke.value?.id);
        loadRandomJoke();
      }
    }, currentDelay.value);

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
      trackSpotlightAction('resume');
    } else {
      stopAutoRotation();
      trackSpotlightAction('pause');
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

  // Watch for language changes
  watch(selectedLanguages, () => {
    console.log('=== Spotlight: Languages changed, loading new joke ===');
    loadRandomJoke();
  }, { deep: true });

  // FIXED: Watch LOCAL spotlightJoke for auto-rotation
  watch(spotlightJoke, (newJoke) => {
    if (newJoke && isAutoRotationActive.value && !isPaused.value) {
      startAutoRotation();
    }
  });

  onMounted(() => {
    updateSEO({
      title: 'Jokes of the Day: Today’s Funniest Jokes',
      description: 'Discover today’s funniest jokes, trending humor, and laugh-out-loud one-liners. Updated daily with fresh jokes to brighten your day.'
    });

    document.addEventListener('visibilitychange', handleVisibilityChange);
    loadRandomJoke();
  });

  onUnmounted(() => {
    console.log('=== Spotlight: Component unmounted - cleaning up timers ===');
    // IMPORTANT: Clean up timers when component is destroyed
    stopAutoRotation();
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  });
</script>

<style scoped>
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
</style>