import { createRouter, createWebHistory } from 'vue-router';
import { isValidCategorySlug, getCategoryBySlug } from '@/config/categories';
import JokesFeedView from '../views/JokesFeedView.vue';
import SpotlightView from '../views/SpotlightView.vue';
import JokeView from '../views/JokeView.vue';
import CategoriesView from '../views/CategoriesView.vue';
import CategoryView from '../views/CategoryView.vue';
import SubmitView from '../views/SubmitView.vue';
import AboutView from '../views/AboutView.vue';
import VideosView from '../views/VideosView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import { trackPageView } from '../services/analyticsService';
import LegalView from '../views/LegalView.vue';

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
  // NEW: SEO-friendly joke URL - /{category}-jokes/{title-slug}-{id}
  {
    path: '/:categorySlug-jokes/:titleSlugWithId',
    name: 'joke-seo',
    component: JokeView,
    props: route => {
      // Extract ID from the titleSlugWithId parameter
      // Format: title-slug-{id} where ID is after the LAST hyphen
      const titleSlugWithId = route.params.titleSlugWithId;
      
      // Find the last hyphen and extract everything after it as the ID
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
      
      // Validate category slug
      if (isValidCategorySlug(categorySlug)) {
        const category = getCategoryBySlug(categorySlug);
        to.meta.title = `${category.label} Joke - Humoraq`;
        next();
      } else {
        // Invalid category, redirect to 404
        console.warn(`Invalid category slug in joke URL: ${categorySlug}`);
        next({ name: 'not-found' });
      }
    },
    meta: { title: 'Joke Details - Humoraq' }
  },
  // OLD FORMATS: Redirect to home (we can't generate title slug without fetching the joke)
  {
    path: '/joke/:id',
    redirect: () => {
      // Redirect to home - user can find the joke there
      // We can't create the new URL without fetching joke data
      return { name: 'home' };
    }
  },
  {
    path: '/joke-about-:categorySlug/:id',
    redirect: () => {
      // Redirect to home
      return { name: 'home' };
    }
  },
  {
    path: '/:categorySlug-jokes/:id',
    redirect: () => {
      // Redirect to home
      return { name: 'home' };
    }
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

// Update document title and track page views
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Humoraq';
  next();
});

router.afterEach((to, from) => {
  trackPageView(to.name, to.meta.title || 'Humoraq');
});

export default router;