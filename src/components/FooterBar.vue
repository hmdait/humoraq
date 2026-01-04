<template>
  <footer class="footer-bar py-4 mt-5">
    <div class="container">
      <div class="row">
        <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
          <p class="mb-0 text-muted">
            &copy; {{ currentYear }} Humoraq. All rights reserved.
          </p>
        </div>
        <div class="col-md-6 text-center text-md-end">
          <p class="mb-0 text-muted">
            Made with ❤️ for laughter
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>