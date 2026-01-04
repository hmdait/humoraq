import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import JokeView from '../views/JokeView.vue';
import CategoriesView from '../views/CategoriesView.vue';
import CategoryView from '../views/CategoryView.vue';
import SubmitView from '../views/SubmitView.vue';
import NotFoundView from '../views/NotFoundView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/joke/:id',
    name: 'joke',
    component: JokeView
    // Remove props: true to avoid passing params as props
  },
  {
    path: '/categories',
    name: 'categories',
    component: CategoriesView
  },
  {
    path: '/category/:slug',
    name: 'category',
    component: CategoryView,
    props: true
  },
  {
    path: '/submit',
    name: 'submit',
    component: SubmitView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;