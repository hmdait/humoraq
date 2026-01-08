<template>
  <div class="card feed-post mb-4 shadow-sm">
    <div class="card-body">
      <!-- Header -->
      <div class="feed-post-header mb-3">
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <div class="avatar-circle me-3">
              {{ getAuthorInitial(joke.author) }}
            </div>
            <div>
              <h6 class="mb-0 fw-bold">{{ getAuthorName(joke.author) }}</h6>
              <small class="text-muted">
                {{ formatDate(joke.createdAt) }}
                <span class="mx-1">•</span>
                <span :class="`badge bg-${getCategoryColor(joke.category)} badge-sm`">
                  {{ getCategoryName(joke.category) }}
                </span>
                <span class="mx-1">•</span>
                <span class="badge bg-secondary badge-sm">
                  {{ getLanguageName(joke.language) }}
                </span>
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Title (if exists) -->
      <h5 v-if="joke.title" class="feed-post-title mb-2">{{ joke.title }}</h5>

      <!-- Joke Text -->
      <p class="feed-post-text mb-3">{{ joke.text }}</p>

      <!-- Footer with stats and actions -->
      <div class="feed-post-footer">
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex gap-3">
            <button 
              class="btn btn-sm btn-link text-decoration-none p-0 like-btn"
              :class="{ 'liked': hasLiked }"
              @click="handleLike"
              :disabled="isLiking"
            >
              <span class="heart-icon">{{ hasLiked ? '❤️' : '🤍' }}</span>
              <span class="ms-1">{{ localLikes }}</span>
            </button>
            <span class="text-muted">
              <small>👁️ {{ joke.views || 0 }} views</small>
            </span>
          </div>
          <router-link 
            :to="`/joke/${joke.id}`" 
            class="btn btn-sm btn-outline-primary"
          >
            View Details
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { likeJoke } from '../services/jokeService';

const props = defineProps({
  joke: {
    type: Object,
    required: true
  }
});

const localLikes = ref(props.joke.likes || 0);
const hasLiked = ref(false);
const isLiking = ref(false);

onMounted(() => {
  const likedJokes = JSON.parse(localStorage.getItem('likedJokes') || '[]');
  hasLiked.value = likedJokes.includes(props.joke.id);
});

const handleLike = async () => {
  if (hasLiked.value || isLiking.value) return;

  isLiking.value = true;

  try {
    localLikes.value += 1;
    hasLiked.value = true;

    await likeJoke(props.joke.id);

    const likedJokes = JSON.parse(localStorage.getItem('likedJokes') || '[]');
    likedJokes.push(props.joke.id);
    localStorage.setItem('likedJokes', JSON.stringify(likedJokes));
  } catch (error) {
    console.error('Failed to like joke:', error);
    localLikes.value -= 1;
    hasLiked.value = false;
  } finally {
    isLiking.value = false;
  }
};

const getAuthorName = (author) => {
  if (!author || !author.name) return 'Anonymous';
  return author.name;
};

const getAuthorInitial = (author) => {
  const name = getAuthorName(author);
  return name.charAt(0).toUpperCase();
};

const getCategoryName = (slug) => {
  const categories = {
    tech: 'Tech',
    work: 'Work',
    animals: 'Animals',
    food: 'Food',
    general: 'General'
  };
  return categories[slug] || slug;
};

const getCategoryColor = (slug) => {
  const colors = {
    tech: 'primary',
    work: 'success',
    animals: 'warning',
    food: 'danger',
    general: 'info'
  };
  return colors[slug] || 'secondary';
};

const getLanguageName = (code) => {
  const languages = {
    en: 'EN',
    fr: 'FR',
    ar: 'AR'
  };
  return languages[code] || code.toUpperCase();
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'Just now';
  
  // Handle Firestore Timestamp
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};
</script>

<style scoped>
.feed-post {
  transition: box-shadow 0.3s ease;
}

.feed-post:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.dark-mode .feed-post:hover {
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.05);
}

.avatar-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.25rem;
}

.feed-post-title {
  color: var(--text-color);
  font-weight: 600;
}

.feed-post-text {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-color);
  white-space: pre-wrap;
}

.badge-sm {
  font-size: 0.7rem;
  padding: 0.25em 0.5em;
}

.like-btn {
  color: #6c757d;
  transition: all 0.2s ease;
  font-weight: 500;
}

.like-btn:hover:not(.liked) {
  color: #dc3545;
  transform: scale(1.05);
}

.like-btn.liked {
  color: #dc3545;
}

.like-btn:disabled {
  opacity: 0.6;
  cursor: wait;
}

.heart-icon {
  font-size: 1.1rem;
}
</style>