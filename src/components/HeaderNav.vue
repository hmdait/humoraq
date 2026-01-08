<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
    <div class="container">
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <img 
          src="@/assets/logo.png" 
          alt="Humoraq Logo" 
          class="navbar-logo me-2"
        />
        <span class="brand-name">Humoraq</span>
      </router-link>
      
      <div class="d-flex align-items-center order-lg-2">
        <ThemeToggle class="me-2" />
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
      
      <div class="collapse navbar-collapse order-lg-1" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/spotlight" class="nav-link">Spotlight</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/categories" class="nav-link">Categories</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/submit" class="nav-link">Submit</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import ThemeToggle from './ThemeToggle.vue';
</script>

<style scoped>
.navbar-logo {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.brand-name {
  font-weight: bold;
  font-size: 1.25rem;
}

@media (max-width: 576px) {
  .navbar-logo {
    height: 32px;
  }
  
  .brand-name {
    font-size: 1.1rem;
  }
}
</style>