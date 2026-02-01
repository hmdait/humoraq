<template>
  <button 
    @click="$emit('click')"
    :disabled="loading"
    class="btn-joke"
    :class="{ 'loading': loading }"
  >
    <span class="btn-content">
      <span v-if="loading" class="btn-loading">
        <span class="spinner-modern"></span>
        <span class="loading-text">Loading...</span>
      </span>
      <span v-else class="btn-text">
        {{ text }}
      </span>
    </span>
    <span class="btn-shine"></span>
  </button>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: '🎲 Get Random Joke'
  }
});

defineEmits(['click']);
</script>

<style scoped>
.btn-joke {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 16px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 16px rgba(102, 126, 234, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  text-decoration: none;
}

.btn-joke::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-joke:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 
    0 8px 24px rgba(102, 126, 234, 0.4),
    0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-joke:hover:not(:disabled)::before {
  opacity: 1;
}

.btn-joke:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 
    0 4px 16px rgba(102, 126, 234, 0.35),
    0 2px 8px rgba(0, 0, 0, 0.12);
}

.btn-joke:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-text {
  display: inline-block;
  transition: transform 0.2s ease;
}

.btn-joke:hover:not(:disabled) .btn-text {
  transform: scale(1.05);
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.spinner-modern {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  opacity: 0.9;
}

/* Shine effect on hover */
.btn-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transform: translateX(-100%) translateY(-100%) rotate(45deg);
  transition: transform 0.6s ease;
}

.btn-joke:hover:not(:disabled) .btn-shine {
  transform: translateX(100%) translateY(100%) rotate(45deg);
}

/* Loading state animation */
.btn-joke.loading {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 
      0 4px 16px rgba(102, 126, 234, 0.3),
      0 2px 8px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: 
      0 4px 20px rgba(102, 126, 234, 0.4),
      0 2px 10px rgba(0, 0, 0, 0.12);
  }
}

/* Dark mode */
.dark-mode .btn-joke {
  box-shadow: 
    0 4px 16px rgba(102, 126, 234, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark-mode .btn-joke:hover:not(:disabled) {
  box-shadow: 
    0 8px 24px rgba(102, 126, 234, 0.5),
    0 4px 12px rgba(0, 0, 0, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .btn-joke {
    padding: 0.875rem 2rem;
    font-size: 1rem;
    min-width: 180px;
  }
}

@media (max-width: 576px) {
  .btn-joke {
    width: 100%;
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .btn-joke,
  .btn-joke::before,
  .btn-text,
  .btn-shine,
  .spinner-modern {
    animation: none !important;
    transition: none !important;
  }
}
</style>