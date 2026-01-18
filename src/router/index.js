import { createRouter, createWebHistory } from 'vue-router';
import { isValidCategorySlug, slugToValue, getCategoryBySlug } from '@/config/categories'; // UPDATED
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
  {
    path: '/joke/:id',
    name: 'joke',
    component: JokeView,
    meta: { title: 'Joke Details - Humoraq' }
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
      slug: slugToValue(route.params.slug) // UPDATED: Convert slug to value
    }),
    // UPDATED: Validate category slug before navigation
    beforeEnter: (to, from, next) => {
      const slug = to.params.slug;

      if (isValidCategorySlug(slug)) {
        const category = getCategoryBySlug(slug);
        // Update meta with category info
        to.meta.title = `${category.label} Jokes - Humoraq`;
        to.meta.description = category.description;
        next();
      } else {
        // Invalid category - redirect to categories list
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
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { title: '404 - Humoraq' }
  },
  {
    path: '/legal',
    name: 'legal',
    component: LegalView,
    meta: { title: 'Privacy & Terms - Humoraq' }
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