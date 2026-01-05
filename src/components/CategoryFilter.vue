<template>
  <div class="card mb-4">
    <div class="card-body">
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label fw-semibold">Language</label>
          <select 
            :value="selectedLanguage"
            @change="handleLanguageChange"
            class="form-select"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
          </select>
        </div>
        
        <div class="col-md-6">
          <label class="form-label fw-semibold">Category</label>
          <select 
            :value="category"
            @change="$emit('update:category', $event.target.value)"
            class="form-select"
          >
            <option value="">All Categories</option>
            <option value="tech">Tech</option>
            <option value="work">Work</option>
            <option value="animals">Animals</option>
            <option value="food">Food</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

defineProps({
  category: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:category', 'language-changed']);

const store = useStore();

// CRITICAL: Always read from Vuex store
const selectedLanguage = computed(() => store.getters['preferences/selectedLanguage']);

// CRITICAL: Update Vuex store on change
const handleLanguageChange = (event) => {
  const newLanguage = event.target.value;
  store.dispatch('preferences/setLanguage', newLanguage);
  
  // Emit event to notify parent component
  emit('language-changed', newLanguage);
};
</script>