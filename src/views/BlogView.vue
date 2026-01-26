<template>
  <DefaultLayout>
    <div class="blog-view">
      <div class="blog-layout">
        <!-- Left Sidebar: Comedians List -->
        <div class="blog-sidebar-wrapper">
          <BlogSidebar />
        </div>

        <!-- Right Content: Blog Article -->
        <div class="blog-content-wrapper">
          <BlogContent />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import BlogSidebar from '@/components/blog/BlogSidebar.vue';
import BlogContent from '@/components/blog/BlogContent.vue';
import { updateSEO } from '@/utils/seo';
import { getComedianBySlug } from '@/data/comedians';

const route = useRoute();

// Update SEO based on current comedian
const updatePageSEO = () => {
  const slug = route.params.slug;
  
  if (slug) {
    const comedian = getComedianBySlug(slug);
    
    if (comedian) {
      updateSEO({
        title: `${comedian.name} - Biography & Comedy Career | Humoraq Blog`,
        description: `Explore the life and career of ${comedian.name}, ${comedian.shortBio}. Read about their famous works, comedy style, and achievements.`,
        keywords: `${comedian.name}, comedian biography, stand-up comedy, ${comedian.nationality} comedian, comedy history`,
        canonical: `https://humoraq.com/blogs/${slug}`
      });
    }
  } else {
    // Default SEO for blog home
    updateSEO({
      title: 'Famous Comedians Biographies | Humoraq Blog',
      description: 'Explore biographies of legendary comedians including Eddie Murphy, Charlie Chaplin, Jim Carrey, and more. Learn about their lives, careers, and impact on comedy.',
      keywords: 'famous comedians, comedian biographies, stand-up comedy history, comedy legends, humor blog',
      canonical: 'https://humoraq.com/blogs'
    });
  }
};

// Watch for route changes
watch(() => route.params.slug, () => {
  updatePageSEO();
});

onMounted(() => {
  updatePageSEO();
});
</script>

<style scoped>
.blog-view {
  min-height: calc(100vh - 200px);
  background: var(--bg-light, #f8f9fa);
}

.blog-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  height: calc(100vh - 72px); /* Subtract header height */
  overflow: hidden;
}

.blog-sidebar-wrapper {
  height: 100%;
  overflow-y: auto;
  background: var(--card-bg, #fff);
}

.blog-content-wrapper {
  height: 100%;
  overflow-y: auto;
  background: var(--card-bg, #fff);
}

/* Dark Mode */
.dark-mode .blog-view {
  background: #1a1d20;
}

.dark-mode .blog-sidebar-wrapper {
  background: var(--card-bg, #000);
}

.dark-mode .blog-content-wrapper {
  background: var(--card-bg, #000);
}

/* Responsive Layout */
@media (max-width: 991px) {
  .blog-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    height: auto;
  }

  .blog-sidebar-wrapper {
    max-height: 400px;
    overflow-y: auto;
  }

  .blog-content-wrapper {
    height: auto;
    overflow-y: visible;
  }
}

@media (max-width: 768px) {
  .blog-layout {
    grid-template-columns: 1fr;
  }

  .blog-sidebar-wrapper {
    max-height: 300px;
  }
}
</style>