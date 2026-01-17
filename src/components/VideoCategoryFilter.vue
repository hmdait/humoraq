<template>
  <div
    class="category-filter mb-4"
    @mouseenter="open"
    @mouseleave="close"
  >
    <!-- HEADER -->
    <div class="filter-header d-flex justify-content-between align-items-center mb-3">
      <h5 class="mb-0 d-flex align-items-center gap-2">
        <i class="bi bi-funnel"></i>
        Filter by Category
        <span v-if="selectedCategories.length > 0" class="badge bg-primary">
          {{ selectedCategories.length }}
        </span>
      </h5>

      <button 
        v-if="selectedCategories.length > 0"
        class="btn btn-sm btn-outline-secondary"
        @click.stop="clearAll"
      >
        <i class="bi bi-x-circle me-1"></i>
        Clear All
      </button>
    </div>

    <!-- CONTENT (hover-controlled) -->
    <transition name="fade-slide">
      <div v-show="isOpen" class="filter-content">
        <div class="categories-grid">
          <div
            v-for="category in categories"
            :key="category.value"
            class="category-checkbox"
          >
            <input
              :id="`category-${category.slug}`"
              type="checkbox"
              :checked="isSelected(category.value)"
              @change="toggleCategory(category.value)"
              class="form-check-input"
            />
            <label
              :for="`category-${category.slug}`"
              class="category-label"
              :class="{ active: isSelected(category.value) }"
            >
              <span class="category-name">{{ category.label }}</span>
              <span v-if="isSelected(category.value)" class="check-icon">
                <i class="bi bi-check-circle-fill"></i>
              </span>
            </label>
          </div>
        </div>

        <!-- Selected info -->
        <div v-if="selectedCategories.length > 0" class="selected-info mt-3">
          <div class="alert alert-primary d-flex align-items-center mb-0">
            <i class="bi bi-filter-circle me-2"></i>
            <span>
              Showing <strong>{{ selectedCategories.length }}</strong>
              {{ selectedCategories.length === 1 ? 'category' : 'categories' }}
            </span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { getAllCategories } from '@/config/categories'; // UPDATED: Use unified config

const store = useStore();
const isOpen = ref(false);

// Mobile detection → open by default
onMounted(() => {
  if (window.matchMedia('(hover: none)').matches) {
    isOpen.value = true;
  }
});

const open = () => (isOpen.value = true);
const close = () => (isOpen.value = false);

// UPDATED: Get categories from unified config
const categories = getAllCategories();

const selectedCategories = computed(() => store.getters['videos/selectedCategories']);

const isSelected = (value) => 
  store.getters['videos/isCategorySelected'](value);

const toggleCategory = (value) => 
  store.dispatch('videos/toggleCategory', value);

const clearAll = () => 
  store.dispatch('videos/clearCategories');
</script>

<style scoped>
.category-filter {
  padding: 1rem;
  background: var(--card-bg, #fff);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-header h5 {
  color: var(--text-color, #333);
  font-weight: 600;
  font-size: 1rem;
}

.filter-header .badge {
  font-size: 0.7rem;
  padding: 0.25em 0.45em;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

.category-checkbox {
  position: relative;
}

.category-checkbox input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.category-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border: 2px solid #dee2e6;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--card-bg, #fff);
  min-height: 80px;
  position: relative;
}

.category-label:hover {
  border-color: #0d6efd;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
}

.category-label.active {
  border-color: #0d6efd;
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.1), rgba(13, 110, 253, 0.05));
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
}

.category-icon {
  font-size: 1.6rem;
  margin-bottom: 0.25rem;
}

.category-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-color, #333);
  text-align: center;
}

.check-icon {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: #0d6efd;
  font-size: 1.2rem;
}

.selected-info .alert {
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  border-left: 4px solid #0d6efd;
}

/* Dark mode */
.dark-mode .category-filter {
  background: var(--card-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark-mode .category-label {
  border-color: #495057;
  background: var(--card-bg);
}

.dark-mode .category-label:hover {
  border-color: #0d6efd;
}

.dark-mode .category-label.active {
  border-color: #0d6efd;
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.2), rgba(13, 110, 253, 0.1));
}

.dark-mode .category-name {
  color: var(--text-color);
}

.dark-mode .selected-info .alert {
  background-color: rgba(13, 110, 253, 0.1);
  border-color: rgba(13, 110, 253, 0.3);
  color: #6ea8fe;
}

/* Animation */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.filter-content {
  margin-top: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}

@media (max-width: 576px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>