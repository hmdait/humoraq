<template>
  <aside class="blog-sidebar">
    <div class="sidebar-header">
      <h2>Famous Comedians</h2>
      <p class="sidebar-subtitle">{{ comedians.length }} legendary figures</p>
    </div>

    <div class="search-box">
      <i class="bi bi-search"></i>
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search comedians..."
        class="search-input"
      />
    </div>

    <nav class="comedians-list">
      <router-link
        v-for="comedian in filteredComedians"
        :key="comedian.id"
        :to="`/blogs/${comedian.slug}`"
        class="comedian-item"
        :class="{ 'active': isActive(comedian.slug) }"
      >
        <div class="comedian-avatar">
          <img :src="comedian.image" :alt="comedian.name" loading="lazy" />
        </div>
        <div class="comedian-info">
          <h3 class="comedian-name">{{ comedian.name }}</h3>
          <p class="comedian-short-bio">{{ comedian.shortBio }}</p>
          <span class="comedian-year">{{ comedian.birthYear }}</span>
        </div>
      </router-link>

      <div v-if="filteredComedians.length === 0" class="no-results">
        <i class="bi bi-search"></i>
        <p>No comedians found</p>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { comedians } from '@/data/comedians';

const route = useRoute();
const searchQuery = ref('');

const filteredComedians = computed(() => {
  if (!searchQuery.value) return comedians;
  
  const query = searchQuery.value.toLowerCase();
  return comedians.filter(c => 
    c.name.toLowerCase().includes(query) ||
    c.shortBio.toLowerCase().includes(query)
  );
});

const isActive = (slug) => {
  return route.params.slug === slug;
};
</script>

<style scoped>
.blog-sidebar {
  width: 100%;
  height: 100%;
  background: var(--card-bg, #fff);
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 2rem 1.5rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.sidebar-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: var(--text-color, #0f1419);
}

.sidebar-subtitle {
  font-size: 0.875rem;
  color: #536471;
  margin: 0;
}

.search-box {
  position: relative;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.search-box i {
  position: absolute;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
  color: #536471;
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 0.9375rem;
  background: var(--bg-light, #f8f9fa);
  color: var(--text-color, #0f1419);
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  background: var(--card-bg, #fff);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.comedians-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
}

.comedian-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: var(--text-color, #0f1419);
  transition: background-color 0.2s ease;
  border-left: 3px solid transparent;
}

.comedian-item:hover {
  background: rgba(102, 126, 234, 0.05);
}

.comedian-item.active {
  background: rgba(102, 126, 234, 0.1);
  border-left-color: #667eea;
}

.comedian-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.comedian-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comedian-info {
  flex: 1;
  min-width: 0;
}

.comedian-name {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--text-color, #0f1419);
}

.comedian-short-bio {
  font-size: 0.8125rem;
  color: #536471;
  margin: 0 0 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.comedian-year {
  font-size: 0.75rem;
  color: #667eea;
  font-weight: 600;
}

.no-results {
  padding: 3rem 1.5rem;
  text-align: center;
  color: #536471;
}

.no-results i {
  font-size: 3rem;
  opacity: 0.3;
  margin-bottom: 1rem;
}

.no-results p {
  margin: 0;
  font-size: 0.9375rem;
}

/* Dark mode */
.dark-mode .blog-sidebar {
  background: var(--card-bg, #000);
  border-right-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .sidebar-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .sidebar-header h2 {
  color: var(--text-color, #e7e9ea);
}

.dark-mode .sidebar-subtitle {
  color: #71767b;
}

.dark-mode .search-box {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .search-input {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: var(--text-color, #e7e9ea);
}

.dark-mode .search-input:focus {
  background: var(--card-bg, #000);
  border-color: #667eea;
}

.dark-mode .comedian-item {
  color: var(--text-color, #e7e9ea);
}

.dark-mode .comedian-item:hover {
  background: rgba(102, 126, 234, 0.1);
}

.dark-mode .comedian-item.active {
  background: rgba(102, 126, 234, 0.15);
}

.dark-mode .comedian-name {
  color: var(--text-color, #e7e9ea);
}

.dark-mode .comedian-short-bio {
  color: #71767b;
}

/* Responsive */
@media (max-width: 991px) {
  .blog-sidebar {
    border-right: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }

  .dark-mode .blog-sidebar {
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  .sidebar-header {
    padding: 1.5rem 1rem 0.75rem;
  }

  .search-box {
    padding: 0.75rem 1rem;
  }

  .comedian-item {
    padding: 0.875rem 1rem;
  }
}
</style>