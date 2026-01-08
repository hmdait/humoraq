import { createRouter, createWebHistory } from 'vue-router';
import JokesFeedView from '../views/JokesFeedView.vue';
import SpotlightView from '../views/SpotlightView.vue';
import JokeView from '../views/JokeView.vue';
import CategoriesView from '../views/CategoriesView.vue';
import CategoryView from '../views/CategoryView.vue';
import SubmitView from '../views/SubmitView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import { trackPageView } from '../services/analyticsService'; // ADD THIS

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
    props: true,
    meta: { title: 'Category - Humoraq' }
  },
  {
    path: '/submit',
    name: 'submit',
    component: SubmitView,
    meta: { title: 'Submit a Joke - Humoraq' }
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

router.beforeEach((to, from, next) => {
  // Update page title
  document.title = to.meta.title || 'Humoraq';
  next();
});

// ADD THIS: Track page views after navigation
router.afterEach((to, from) => {
  trackPageView(to.name, to.meta.title || 'Humoraq');
});

export default router;