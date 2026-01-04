<template>
  <div class="d-flex flex-column min-vh-100">
    <HeaderNav />
    
    <main class="main-content flex-grow-1">
      <slot />
    </main>
    
    <FooterBar />
  </div>
</template>

<script setup>
import HeaderNav from '../components/HeaderNav.vue';
import FooterBar from '../components/FooterBar.vue';
</script>