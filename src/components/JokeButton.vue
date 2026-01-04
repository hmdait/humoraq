<template>
  <button 
    @click="$emit('click')"
    :disabled="loading"
    class="btn btn-primary btn-lg btn-joke"
  >
    <span v-if="loading">
      <span class="spinner-border spinner-border-sm me-2" role="status"></span>
      Loading...
    </span>
    <span v-else>
      {{ text }}
    </span>
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