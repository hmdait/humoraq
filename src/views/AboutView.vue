<template>
  <default-layout>
    <!-- Animated Background -->
    <div class="about-background">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
    </div>

    <div class="container py-5 position-relative">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          
          <!-- Hero Section -->
          <div class="hero-section text-center mb-5" data-aos="fade-up">
            <h1 class="hero-title mb-3">
              {{ t('about.hero.title') }} <span class="gradient-text">Humoraq</span>
            </h1>
            <div class="icon-bounce mb-4">
              <i class="bi bi-emoji-laughing"></i>
            </div>
            <p class="hero-subtitle">
              {{ t('about.hero.subtitle') }}
            </p>
          </div>

          <!-- What is Humoraq -->
          <section class="mb-5" data-aos="fade-up" data-aos-delay="100">
            <div class="glass-card">
              <div class="card-glow"></div>
              <div class="card-content">
                <h2 class="section-title mb-4">
                  <span class="title-icon">
                    <i class="bi bi-chat-heart"></i>
                  </span> {{ t('about.whatIs.title') }}
                </h2>
                <p class="section-text mb-3">
                  {{ t('about.whatIs.paragraph1') }}
                </p>
                <p class="section-text mb-0">
                  {{ t('about.whatIs.paragraph2') }}
                </p>
              </div>
            </div>
          </section>

          <!-- Mission -->
          <section class="mb-5" data-aos="fade-up" data-aos-delay="200">
            <div class="glass-card">
              <div class="card-glow"></div>
              <div class="card-content">
                <h2 class="section-title mb-4">
                  <span class="title-icon">
                    <i class="bi bi-bullseye"></i>
                  </span> {{ t('about.mission.title') }}
                </h2>
                <p class="section-text highlight-text mb-0">
                  {{ t('about.mission.description') }}
                </p>
              </div>
            </div>
          </section>

          <!-- Features -->
          <section class="mb-5" data-aos="fade-up" data-aos-delay="300">
            <div class="glass-card">
              <div class="card-glow"></div>
              <div class="card-content">
                <h2 class="section-title mb-4">
                  <span class="title-icon">
                    <i class="bi bi-stars"></i>
                  </span> {{ t('about.features.title') }}
                </h2>
                <div class="features-grid">
                  <div class="feature-item">
                    <div class="feature-icon">
                      <i class="bi bi-translate"></i>
                    </div>
                    <h3 class="feature-title">{{ t('about.features.multiLanguage') }}</h3>
                    <p class="feature-text">{{ t('about.features.multiLanguageDesc') }}</p>
                  </div>
                  <div class="feature-item">
                    <div class="feature-icon">
                      <i class="bi bi-people-fill"></i>
                    </div>
                    <h3 class="feature-title">{{ t('about.features.community') }}</h3>
                    <p class="feature-text">{{ t('about.features.communityDesc') }}</p>
                  </div>
                  <div class="feature-item">
                    <div class="feature-icon">
                      <i class="bi bi-grid-3x3-gap-fill"></i>
                    </div>
                    <h3 class="feature-title">{{ t('about.features.categories') }}</h3>
                    <p class="feature-text">{{ t('about.features.categoriesDesc') }}</p>
                  </div>
                  <div class="feature-item">
                    <div class="feature-icon">
                      <i class="bi bi-arrow-repeat"></i>
                    </div>
                    <h3 class="feature-title">{{ t('about.features.daily') }}</h3>
                    <p class="feature-text">{{ t('about.features.dailyDesc') }}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Vision -->
          <section class="mb-5" data-aos="fade-up" data-aos-delay="400">
            <div class="glass-card">
              <div class="card-glow"></div>
              <div class="card-content">
                <h2 class="section-title mb-4">
                  <span class="title-icon">
                    <i class="bi bi-rocket-takeoff"></i>
                  </span> {{ t('about.vision.title') }}
                </h2>
                <p class="section-text mb-4">
                  {{ t('about.vision.description') }}
                </p>
                <div class="vision-grid">
                  <div class="vision-item">
                    <span class="vision-icon">
                      <i class="bi bi-person-circle"></i>
                    </span>
                    <div class="vision-content">
                      <strong>{{ t('about.vision.profiles') }}</strong> {{ t('about.vision.profilesDesc') }}
                    </div>
                  </div>
                  <div class="vision-item">
                    <span class="vision-icon">
                      <i class="bi bi-chat-dots-fill"></i>
                    </span>
                    <div class="vision-content">
                      <strong>{{ t('about.vision.comments') }}</strong> {{ t('about.vision.commentsDesc') }}
                    </div>
                  </div>
                  <div class="vision-item">
                    <span class="vision-icon">
                      <i class="bi bi-trophy-fill"></i>
                    </span>
                    <div class="vision-content">
                      <strong>{{ t('about.vision.leaderboards') }}</strong> {{ t('about.vision.leaderboardsDesc') }}
                    </div>
                  </div>
                  <div class="vision-item">
                    <span class="vision-icon">
                      <i class="bi bi-palette-fill"></i>
                    </span>
                    <div class="vision-content">
                      <strong>{{ t('about.vision.memes') }}</strong> {{ t('about.vision.memesDesc') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  </default-layout>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { t, currentLanguage } from '@/i18n';
import { updateDynamicSEO } from '@/utils/dynamicSEO';

// SEO update function
const updateAboutSEO = () => {
  const lang = currentLanguage.value;
  
  updateDynamicSEO({
    title: t('seo.aboutTitle', lang),
    description: t('seo.aboutDescription', lang),
    keywords: t('seo.aboutKeywords', lang),
    lang: lang,
    ogLocale: lang === 'en' ? 'en_US' : lang === 'fr' ? 'fr_FR' : lang === 'es' ? 'es_ES' : 'ar_AR'
  });
};

// Watch for language changes
watch(currentLanguage, updateAboutSEO);

onMounted(() => {
  updateAboutSEO();
});
</script>

<style scoped>
/* Animated Background */
.about-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  top: 60%;
  right: 15%;
  animation-delay: 5s;
}

.shape-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  bottom: 15%;
  left: 20%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(180deg); }
}

/* Hero Section */
.hero-section {
  padding: 3rem 0;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: var(--text-color);
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.icon-bounce {
  font-size: 4rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #6c757d;
}

/* Glass Card */
.glass-card {
  position: relative;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.dark-mode .glass-card {
  background: rgba(44, 48, 52, 0.7);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

/* Section Styles */
.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 12px;
  font-size: 1.5rem;
}

.section-text {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--text-color);
}

.highlight-text {
  font-size: 1.25rem;
  font-weight: 500;
  color: #667eea;
}

.dark-mode .highlight-text {
  color: #9ec5fe;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-item {
  text-align: center;
}

.feature-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.feature-text {
  font-size: 1rem;
  color: #6c757d;
}

/* Vision Grid */
.vision-grid {
  display: grid;
  gap: 1.5rem;
}

.vision-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.dark-mode .vision-item {
  background: rgba(102, 126, 234, 0.1);
}

.vision-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.vision-content {
  font-size: 1rem;
  color: var(--text-color);
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .glass-card {
    padding: 1.5rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>