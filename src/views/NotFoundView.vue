<template>
  <DefaultLayout>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-6 text-center">
          <div class="py-5">
            <h1 class="display-1 fw-bold">404</h1>
            <p class="display-6 mb-4">😢 Page Not Found</p>
            <p class="lead text-muted mb-4">
              Looks like this page went to get more jokes and never came back!
            </p>
            <router-link to="/" class="btn btn-primary btn-lg">
              Go Home
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { onMounted } from 'vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { updateSEO } from '../utils/seo';

onMounted(() => {
  updateSEO({
    title: '404 - Page Not Found - Humoraq',
    description: 'The page you are looking for does not exist.'
  });
});
</script>