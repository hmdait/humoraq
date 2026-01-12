<template>
  <div class="video-grid">
    <div class="row g-4">
      <div
        v-for="video in videos"
        :key="video.id"
        class="col-12 col-sm-6 col-lg-4 col-xl-3"
      >
        <VideoCard :video="video" />
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-if="videos.length === 0 && !loading" class="empty-state text-center py-5">
      <i class="bi bi-camera-video display-1 text-muted mb-3"></i>
      <h4 class="text-muted">No videos available</h4>
      <p class="text-muted">Check back later for new content!</p>
    </div>
  </div>
</template>

<script setup>
import VideoCard from './VideoCard.vue';

defineProps({
  videos: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.video-grid {
  width: 100%;
}

.empty-state {
  padding: 4rem 2rem;
}

.empty-state i {
  font-size: 4rem;
  opacity: 0.3;
}

.empty-state h4 {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-size: 1rem;
}

/* Responsive grid gaps */
@media (max-width: 576px) {
  .row.g-4 {
    gap: 1.5rem !important;
  }
}
</style>