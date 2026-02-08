// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';  // ✅ ADDED: Import store to fix "store is not defined" error
import { isValidCategorySlug, getCategoryBySlug } from '@/config/categories';
import { getAllComedianSlugs } from '@/data/comedians';
import JokesFeedView from '../views/JokesFeedView.vue';
import SpotlightView from '../views/SpotlightView.vue';
import JokeView from '../views/JokeView.vue';
import CategoriesView from '../views/CategoriesView.vue';
import CategoryView from '../views/CategoryView.vue';
import SubmitView from '../views/SubmitView.vue';
import AboutView from '../views/AboutView.vue';
import VideosView from '../views/VideosView.vue';
import BlogView from '../views/BlogView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import LegalView from '../views/LegalView.vue';
import { trackPageView } from '../services/analyticsService';
import { addHreflangTags, updateHtmlLang } from '@/utils/hreflang';

const routes = [
  {
    path: '/',
    name: 'home',
    component: JokesFeedView,
    meta: { title: 'Humoraq - Jokes Feed' }
  },
  {
    path: '/feed',
    redirect: '/'
  },
  {
    path: '/spotlight',
    name: 'spotlight',
    component: SpotlightView,
    meta: { title: 'Humoraq - Spotlight' }
  },
  
  // BLOG ROUTES
  {
    path: '/blogs',
    name: 'blogs',
    component: BlogView,
    meta: { 
      title: 'Famous Comedians Biographies - Humoraq Blog',
      description: 'Explore biographies of legendary comedians'
    }
  },
  {
    path: '/blogs/:slug',
    name: 'blog-comedian',
    component: BlogView,
    props: true,
    beforeEnter: (to, from, next) => {
      const slug = to.params.slug;
      const validSlugs = getAllComedianSlugs();
      
      if (validSlugs.includes(slug)) {
        next();
      } else {
        console.warn(`Invalid comedian slug: ${slug}`);
        next({ name: 'blogs' });
      }
    },
    meta: { title: 'Comedian Biography - Humoraq Blog' }
  },
  
  // SEO-friendly joke URL - /{category}-jokes/{title-slug}-{id}
  {
    path: '/:categorySlug-jokes/:titleSlugWithId',
    name: 'joke-seo',
    component: JokeView,
    props: route => {
      const titleSlugWithId = route.params.titleSlugWithId;
      const lastHyphenIndex = titleSlugWithId.lastIndexOf('-');
      const id = lastHyphenIndex !== -1 
        ? titleSlugWithId.substring(lastHyphenIndex + 1)
        : titleSlugWithId;
      
      return {
        id: id,
        categorySlug: route.params.categorySlug,
        titleSlug: titleSlugWithId
      };
    },
    beforeEnter: (to, from, next) => {
      const categorySlug = to.params.categorySlug;
      
      if (isValidCategorySlug(categorySlug)) {
        const category = getCategoryBySlug(categorySlug);
        to.meta.title = `${category.label} Joke - Humoraq`;
        next();
      } else {
        console.warn(`Invalid category slug in joke URL: ${categorySlug}`);
        next({ name: 'not-found' });
      }
    },
    meta: { title: 'Joke Details - Humoraq' }
  },
  
  // OLD FORMATS: Redirect to home
  {
    path: '/joke/:id',
    redirect: () => ({ name: 'home' })
  },
  {
    path: '/joke-about-:categorySlug/:id',
    redirect: () => ({ name: 'home' })
  },
  {
    path: '/:categorySlug-jokes/:id',
    redirect: () => ({ name: 'home' })
  },
  
  {
    path: '/categories',
    name: 'categories',
    component: CategoriesView,
    meta: { title: 'Browse Categories - Humoraq' }
  },
  {
    path: '/category/:slug',
    name: 'category',
    component: CategoryView,
    props: route => ({
      slug: route.params.slug
    }),
    beforeEnter: (to, from, next) => {
      const slug = to.params.slug;

      if (isValidCategorySlug(slug)) {
        const category = getCategoryBySlug(slug);
        to.meta.title = `${category.label} Jokes - Humoraq`;
        to.meta.description = category.description;
        next();
      } else {
        console.warn(`Invalid category slug: ${slug}`);
        next({ name: 'categories' });
      }
    },
    meta: { title: 'Category - Humoraq' }
  },
  {
    path: '/submit',
    name: 'submit',
    component: SubmitView,
    meta: { title: 'Submit a Joke - Humoraq' }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: { title: 'About Us - Humoraq' }
  },
  {
    path: '/videos',
    name: 'videos',
    component: VideosView,
    meta: { title: 'Funny Videos - Humoraq' }
  },
  {
    path: '/legal',
    name: 'legal',
    component: LegalView,
    meta: { title: 'Privacy & Terms - Humoraq' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { title: '404 - Humoraq' }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

// Update document title
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Humoraq';
  next();
});

// Track page views
router.afterEach((to) => {
  trackPageView(to.name, to.meta.title || 'Humoraq');
  
  // ✅ Optional: Add hreflang tags for multilingual SEO
  addHreflangTags(to.path);
  const currentLang = store.getters['preferences/selectedLanguage'] || 'en';
  updateHtmlLang(currentLang);
});

export default router;