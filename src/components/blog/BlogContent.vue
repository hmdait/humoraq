<template>
  <article class="blog-content" v-if="comedian">
    <!-- Hero Section -->
    <div class="blog-hero">
      <div class="hero-image-wrapper">
        <img :src="comedian.image" :alt="comedian.name" class="hero-image" />
      </div>
      <div class="hero-overlay">
        <div class="hero-badge">{{ comedian.nationality }}</div>
        <h1 class="hero-title">{{ comedian.name }}</h1>
        <p class="hero-subtitle">{{ comedian.shortBio }}</p>
        <div class="hero-meta">
          <span class="meta-item">
            <i class="bi bi-calendar3"></i>
            Born {{ comedian.birthYear }}
          </span>
          <span class="meta-separator">•</span>
          <span class="meta-item">
            <i class="bi bi-flag"></i>
            {{ comedian.nationality }}
          </span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="article-container">
      <!-- Table of Contents -->
      <aside class="table-of-contents">
        <h3>Contents</h3>
        <nav>
          <a href="#biography" class="toc-link">Biography</a>
          <a href="#style" class="toc-link">Comedy Style</a>
          <a href="#works" class="toc-link">Famous Works</a>
          <a href="#achievements" class="toc-link">Achievements</a>
        </nav>
      </aside>

      <!-- Article Body -->
      <div class="article-body">
        <!-- Biography Section -->
        <section id="biography" class="content-section">
          <h2 class="section-title">
            <i class="bi bi-person-circle"></i>
            Biography
          </h2>
          <div class="section-content">
            <p v-for="(paragraph, index) in bioGraphs" :key="index" class="paragraph">
              {{ paragraph }}
            </p>
          </div>
        </section>

        <!-- Comedy Style Section -->
        <section id="style" class="content-section">
          <h2 class="section-title">
            <i class="bi bi-palette"></i>
            Comedy Style
          </h2>
          <div class="section-content">
            <div class="style-card">
              <p class="style-description">{{ comedian.style }}</p>
            </div>
          </div>
        </section>

        <!-- Famous Works Section -->
        <section id="works" class="content-section">
          <h2 class="section-title">
            <i class="bi bi-film"></i>
            Famous Works
          </h2>
          <div class="section-content">
            <ul class="works-list">
              <li v-for="(work, index) in comedian.famousWorks" :key="index" class="work-item">
                <i class="bi bi-check-circle-fill"></i>
                {{ work }}
              </li>
            </ul>
          </div>
        </section>

        <!-- Achievements Section -->
        <section id="achievements" class="content-section">
          <h2 class="section-title">
            <i class="bi bi-trophy"></i>
            Awards & Achievements
          </h2>
          <div class="section-content">
            <div class="achievements-grid">
              <div v-for="(achievement, index) in comedian.achievements" :key="index" class="achievement-card">
                <i class="bi bi-award"></i>
                <span>{{ achievement }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Share Section -->
        <div class="article-footer">
          <div class="share-section">
            <h3>Share this article</h3>
            <div class="share-buttons">
              <button @click="share('twitter')" class="share-btn twitter">
                <i class="bi bi-twitter-x"></i>
              </button>
              <button @click="share('facebook')" class="share-btn facebook">
                <i class="bi bi-facebook"></i>
              </button>
              <button @click="share('linkedin')" class="share-btn linkedin">
                <i class="bi bi-linkedin"></i>
              </button>
              <button @click="copyLink" class="share-btn copy">
                <i class="bi bi-link-45deg"></i>
              </button>
            </div>
          </div>

          <!-- Back to List -->
          <router-link to="/blogs" class="back-link">
            <i class="bi bi-arrow-left"></i>
            Back to all comedians
          </router-link>
        </div>
      </div>
    </div>
  </article>

  <!-- Empty State -->
  <div v-else class="empty-state">
    <i class="bi bi-journal-text"></i>
    <h2>Select a Comedian</h2>
    <p>Choose a comedian from the sidebar to read their biography</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { getComedianBySlug } from '@/data/comedians';

const route = useRoute();

const comedian = computed(() => {
  if (!route.params.slug) return null;
  return getComedianBySlug(route.params.slug);
});

const bioGraphs = computed(() => {
  if (!comedian.value) return [];
  return comedian.value.bio.split('\n\n').filter(p => p.trim());
});

const share = (platform) => {
  const url = window.location.href;
  const text = `Check out ${comedian.value.name} on Humoraq`;
  
  let shareUrl = '';
  switch(platform) {
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      break;
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      break;
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      break;
  }
  
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  } catch (error) {
    console.error('Failed to copy link:', error);
  }
};
</script>

<style scoped>
.blog-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: var(--card-bg, #fff);
}

/* Hero Section */
.blog-hero {
  position: relative;
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.hero-image-wrapper {
  position: absolute;
  inset: 0;
  opacity: 0.5;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 3rem 2rem 2rem;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
}

.hero-badge {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 20px;
  margin-bottom: 1rem;
  width: fit-content;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1rem 0;
  text-shadow: 0 1px 4px rgba(0,0,0,0.3);
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.8);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-separator {
  opacity: 0.5;
}

/* Article Container */
.article-container {
  display: flex;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

/* Table of Contents */
.table-of-contents {
  position: sticky;
  top: 2rem;
  width: 200px;
  flex-shrink: 0;
  align-self: flex-start;
}

.table-of-contents h3 {
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #536471;
  margin: 0 0 1rem 0;
}

.toc-link {
  display: block;
  padding: 0.5rem 0;
  font-size: 0.9375rem;
  color: var(--text-color, #0f1419);
  text-decoration: none;
  border-left: 2px solid transparent;
  padding-left: 1rem;
  transition: all 0.2s ease;
}

.toc-link:hover {
  color: #667eea;
  border-left-color: #667eea;
}

/* Article Body */
.article-body {
  flex: 1;
  max-width: 800px;
}

.content-section {
  margin-bottom: 3rem;
  scroll-margin-top: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color, #0f1419);
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(0, 0, 0, 0.08);
}

.section-title i {
  color: #667eea;
  font-size: 1.75rem;
}

.section-content {
  color: var(--text-color, #0f1419);
  line-height: 1.8;
}

.paragraph {
  font-size: 1.0625rem;
  margin: 0 0 1.5rem 0;
  text-align: justify;
}

/* Style Card */
.style-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
  border-left: 4px solid #667eea;
  padding: 1.5rem;
  border-radius: 8px;
}

.style-description {
  font-size: 1.125rem;
  font-style: italic;
  color: var(--text-color, #0f1419);
  margin: 0;
}

/* Works List */
.works-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.work-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 0;
  font-size: 1.0625rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.work-item:last-child {
  border-bottom: none;
}

.work-item i {
  color: #667eea;
  font-size: 1.25rem;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

/* Achievements Grid */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.achievement-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  transition: all 0.2s ease;
}

.achievement-card:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.achievement-card i {
  font-size: 1.5rem;
  color: #667eea;
  flex-shrink: 0;
}

.achievement-card span {
  font-size: 0.9375rem;
  line-height: 1.4;
}

/* Article Footer */
.article-footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 2px solid rgba(0, 0, 0, 0.08);
}

.share-section {
  margin-bottom: 2rem;
}

.share-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.share-buttons {
  display: flex;
  gap: 0.75rem;
}

.share-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.share-btn:hover {
  transform: scale(1.1);
}

.share-btn.twitter {
  background: #000;
  color: #fff;
}

.share-btn.facebook {
  background: #1877f2;
  color: #fff;
}

.share-btn.linkedin {
  background: #0077b5;
  color: #fff;
}

.share-btn.copy {
  background: #536471;
  color: #fff;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--bg-light, #f8f9fa);
  color: var(--text-color, #0f1419);
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.back-link:hover {
  background: #667eea;
  color: #fff;
}

/* Empty State */
.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: #536471;
}

.empty-state i {
  font-size: 5rem;
  opacity: 0.3;
  margin-bottom: 1.5rem;
}

.empty-state h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color, #0f1419);
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  font-size: 1rem;
  margin: 0;
}

/* Dark Mode */
.dark-mode .blog-content {
  background: var(--card-bg, #000);
}

.dark-mode .section-title {
  color: var(--text-color, #e7e9ea);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .section-content {
  color: var(--text-color, #e7e9ea);
}

.dark-mode .paragraph {
  color: var(--text-color, #e7e9ea);
}

.dark-mode .style-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
}

.dark-mode .style-description {
  color: var(--text-color, #e7e9ea);
}

.dark-mode .work-item {
  border-bottom-color: rgba(255, 255, 255, 0.05);
}

.dark-mode .achievement-card {
  background: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.2);
}

.dark-mode .achievement-card:hover {
  background: rgba(102, 126, 234, 0.15);
}

.dark-mode .article-footer {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .back-link {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-color, #e7e9ea);
}

.dark-mode .back-link:hover {
  background: #667eea;
  color: #fff;
}

.dark-mode .toc-link {
  color: var(--text-color, #e7e9ea);
}

.dark-mode .empty-state h2 {
  color: var(--text-color, #e7e9ea);
}

/* Responsive */
@media (max-width: 1199px) {
  .table-of-contents {
    display: none;
  }

  .article-container {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-overlay {
    padding: 2rem 1.5rem 1.5rem;
  }

  .article-container {
    padding: 2rem 1rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .paragraph {
    font-size: 1rem;
    text-align: left;
  }

  .achievements-grid {
    grid-template-columns: 1fr;
  }
}
</style>