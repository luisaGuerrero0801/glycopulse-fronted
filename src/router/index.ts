import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (LoginView-[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LoginView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/',
      name: 'vistaInicial',
      // route level code-splitting
      // this generates a separate chunk (LoginView-[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LoginView.vue'),
      meta: {
        requiresAuth: false
      }
      
    },
    {
      path: '/recetas-saludables',
      name: 'recetasSaludables',
      component: () => import('../views/RecetasSaludablesView.vue'),
      meta: {
        requiresAuth: true 
      }
    },
  ]
})


export default router
