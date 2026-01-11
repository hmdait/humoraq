<template>
  <DefaultLayout>
    <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <!-- Page Header -->
        <div class="text-center mb-4">
          <h1 class="display-4 mb-2">✨ Spotlight</h1>
          <p class="lead text-muted">Jokes that rotate automatically</p>
        </div>

        <!-- NO CATEGORY FILTER - removed completely -->

        <!-- Joke Card with Fade Transition -->
        <div 
          class="joke-spotlight-container"
          @mouseenter="pauseAutoRotation"
          @mouseleave="resumeAutoRotation"
        >
          <Transition name="fade" mode="out-in">
            <JokeCard 
              v-if="currentJoke" 
              :key="currentJoke.id"
              :joke="currentJoke"
              class="mb-4"
            />
          </Transition>
        </div>

        <!-- Controls -->
        <div class="text-center">
          <div class="d-flex justify-content-center gap-3 mb-3">
            <button 
              @click="toggleAutoRotation"
              class="btn btn-outline-secondary"
              :disabled="loading"
            >
              <span v-if="isAutoRotationActive">⏸️ Pause</span>
              <span v-else>▶️ Resume</span>
            </button>
            
            <JokeButton 
              @click="loadRandomJoke"
              :loading="loading"
              text="⏭️ Next Joke"
            />
          </div>

          <!-- Timer Progress Bar -->
          <div v-if="isAutoRotationActive && !isPaused" class="progress" style="height: 4px;">
            <div 
              class="progress-bar bg-primary"
              role="progressbar"
              :style="{ width: progressPercent + '%' }"
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
import JokeCard from '../components/JokeCard.vue';
import JokeButton from '../components/JokeButton.vue';
import { updateSEO } from '../utils/seo';
import { trackSpotlightAction } from '../services/analyticsService';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const store = useStore();

// Local state (NO category filter)
const isAutoRotationActive = ref(true);
const isPaused = ref(false);
const rotationTimer = ref(null);
const progressTimer = ref(null);
const currentDelay = ref(0);
const elapsedTime = ref(0);

// Get data from GLOBAL Vuex state
const currentJoke = computed(() => store.getters['jokes/currentJoke']);
const loading = computed(() => store.getters['jokes/loading']);
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
  console.log(`Delay calculation: ${characterCount} chars × 40ms + 2000ms = ${delay}ms`);
  return delay;
};

// Load random joke (NO category - uses GLOBAL languages)
const loadRandomJoke = async () => {
  console.log('=== Loading random joke ===');
  stopAutoRotation();
  
  // Clear category and fetch (will use GLOBAL languages from Vuex)
  await store.dispatch('jokes/setCategory', '');
  await store.dispatch('jokes/fetchRandomJoke');
  
  if (currentJoke.value) {
    trackSpotlightAction('next', currentJoke.value.id);
  }
  
  if (isAutoRotationActive.value && !isPaused.value) {
    startAutoRotation();
  }
};

const startAutoRotation = () => {
  if (!currentJoke.value) return;
  
  console.log('=== Starting auto-rotation ===');
  stopAutoRotation();
  
  currentDelay.value = calculateDelay(currentJoke.value);
  elapsedTime.value = 0;
  
  rotationTimer.value = setTimeout(() => {
    if (isAutoRotationActive.value && !isPaused.value) {
      trackSpotlightAction('auto_rotate', currentJoke.value?.id);
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

// Watch for language changes from GLOBAL state
watch(selectedLanguages, () => {
  console.log('=== Languages changed, loading new joke ===');
  loadRandomJoke();
}, { deep: true });

watch(currentJoke, (newJoke) => {
  if (newJoke && isAutoRotationActive.value && !isPaused.value) {
    startAutoRotation();
  }
});

onMounted(() => {
  console.log('=== Spotlight mounted ===');
  
  updateSEO({
    title: 'Spotlight - Humoraq',
    description: 'Watch jokes rotate automatically with our spotlight feature!'
  });
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  loadRandomJoke();
});

onUnmounted(() => {
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
