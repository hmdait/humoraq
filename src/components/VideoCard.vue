<template>
  <div class="video-card">
    <div class="video-wrapper">
      <iframe
        :src="embedUrl"
        :title="video.title"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        loading="lazy"
        class="video-iframe"
      ></iframe>
    </div>
    
    <div class="video-info">
      <h5 class="video-title mb-2">{{ video.title }}</h5>
      
      <!-- Open on YouTube link -->
      <a 
        :href="directUrl" 
        target="_blank" 
        rel="noopener noreferrer"
        class="external-link text-muted"
      >
        <i class="bi bi-youtube me-1"></i>
        <small>Watch on YouTube</small>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getYouTubeEmbedUrl, getYouTubeUrl } from '@/services/videoService';

const props = defineProps({
  video: {
    type: Object,
    required: true
  }
});

// Support both videoId and embedId field names
const videoId = computed(() => props.video.videoId || props.video.embedId || '');
const embedUrl = computed(() => getYouTubeEmbedUrl(videoId.value));
const directUrl = computed(() => getYouTubeUrl(videoId.value));
</script>

<style scoped>
.video-card {
  background: var(--card-bg, #fff);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.video-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  background-color: #000;
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 0;
}

.video-info {
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.video-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color, #333);
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

.external-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s ease;
  align-self: flex-start;
}

.external-link:hover {
  color: #ff0000 !important; /* YouTube red */
}

.external-link i {
  font-size: 1rem;
}

/* Dark mode */
.dark-mode .video-card {
  background: var(--card-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark-mode .video-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.dark-mode .video-title {
  color: var(--text-color);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .video-info {
    padding: 0.75rem;
  }
  
  .video-title {
    font-size: 0.9rem;
  }
}
</style>