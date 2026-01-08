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

        <!-- Language & Category Filter -->
        <CategoryFilter 
          v-model:category="currentCategory"
          @language-changed="handleLanguageChange"
        />

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
import CategoryFilter from '../components/CategoryFilter.vue';
import { updateSEO } from '../utils/seo';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { trackSpotlightAction } from '../services/analyticsService';

const store = useStore();

// Local state
const currentCategory = ref('');
const isAutoRotationActive = ref(true);
const isPaused = ref(false);
const rotationTimer = ref(null);
const progressTimer = ref(null);
const currentDelay = ref(0);
const elapsedTime = ref(0);

// Computed properties from Vuex
const currentJoke = computed(() => store.getters['jokes/currentJoke']);
const loading = computed(() => store.getters['jokes/loading']);
const selectedLanguage = computed(() => store.getters['preferences/selectedLanguage']);

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

// Load random joke
const loadRandomJoke = async () => {
  console.log('=== Loading random joke ===');
  stopAutoRotation();
  store.dispatch('jokes/setCategory', currentCategory.value);
  await store.dispatch('jokes/fetchRandomJoke');
  
  if (currentJoke.value) {
    trackSpotlightAction('next', currentJoke.value.id);
  }
  
  if (isAutoRotationActive.value && !isPaused.value) {
    startAutoRotation();
  }
};

// Start auto-rotation timer
const startAutoRotation = () => {
  if (!currentJoke.value) return;
  
  console.log('=== Starting auto-rotation ===');
  stopAutoRotation();
  
  currentDelay.value = calculateDelay(currentJoke.value);
  elapsedTime.value = 0;
  
  console.log(`Next rotation in ${currentDelay.value}ms`);
  
  rotationTimer.value = setTimeout(() => {
    if (isAutoRotationActive.value && !isPaused.value) {
      // ADD THIS
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

// Stop auto-rotation timer
const stopAutoRotation = () => {
  console.log('=== Stopping auto-rotation ===');
  
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

// Toggle auto-rotation on/off
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
// Pause on hover
const pauseAutoRotation = () => {
  console.log('=== Paused (hover) ===');
  isPaused.value = true;
};

// Resume on mouse leave
const resumeAutoRotation = () => {
  console.log('=== Resumed (hover end) ===');
  if (isAutoRotationActive.value) {
    isPaused.value = false;
  }
};

// Handle visibility change (tab switching)
const handleVisibilityChange = () => {
  if (document.hidden) {
    console.log('=== Tab hidden - pausing ===');
    isPaused.value = true;
  } else {
    console.log('=== Tab visible - resuming ===');
    if (isAutoRotationActive.value) {
      isPaused.value = false;
    }
  }
};

// Handle language change
const handleLanguageChange = () => {
  console.log('Language changed to:', selectedLanguage.value);
  loadRandomJoke();
};

// Watch for language or category changes
watch([selectedLanguage, currentCategory], () => {
  loadRandomJoke();
});

// Watch for joke changes to restart timer
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
  console.log('=== Spotlight unmounted ===');
  stopAutoRotation();
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<style scoped>
/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Joke Spotlight Container */
.joke-spotlight-container {
  min-height: 250px;
  position: relative;
}

/* Progress bar styling */
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