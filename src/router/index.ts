import { createRouter, createWebHistory } from 'vue-router';
import { loginStore } from '@/stores/login';

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
      path: '/recetas-saludables',
      name: 'recetasSaludables',
      component: () => import('../views/RecetasSaludablesView.vue'),
      meta: {
        requiresAuth: true ,
        allowedRoles: ['Paciente']
      }
    },
    {
      path: '/glucometrias',
      name: 'glucometrias',
      component: () => import('../views/GlucometriasPaciente.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['Paciente']
      }
    },
    {
      path: '/register',
      name: 'register',
      // route level code-splitting
      // this generates a separate chunk (LoginView-[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RegisterView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/recover',
      name: 'recover',
      // route level code-splitting
      // this generates a separate chunk (LoginView-[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RecoverAccountView.vue'),
      meta: {
        requiresAuth: false
      }
    },
  ]
});

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token');
  const rol = sessionStorage.getItem('rol') ?? '';
  const requiresAuth = to.meta.requiresAuth;
  const allowedRoles = (to.meta.allowedRoles || []) as string [] ;

  if(requiresAuth && !token){
    return next('/');
  }

  if(requiresAuth && allowedRoles.length && !allowedRoles.includes( rol )) {
    return next('/');
  }

  next();
  
});

export default router;
