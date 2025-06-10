import { createRouter, createWebHistory } from 'vue-router';
import { loginStore } from '@/stores/login';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
  {
  path: '/admin',
  name: 'admin',
  component: () => import('../views/AdminPageView.vue'),
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: 'users',
      name: 'AdminUsers',
      component: () => import('../views/UserListView.vue'), 
    },
    {
      path: 'panel',
      name: 'AdminPanel',
      component: () => import('../views/PanelView.vue'),
    },
    
    {
      path: 'dashboard',
      name: 'AdminDashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    
    
    {
      path: 'notification',
      name: 'AdminNotification',
      component: () => import('../views/NotificationView.vue'),
    },
    {
      path: 'support',
      name: 'AdminSupport',
      component: () => import('../views/NotificationView.vue'),
    },
    {
      path: 'groups',
      name: 'AdminGroups',
      component: () => import('../views/NotificationView.vue'),
    },
    {
      path: 'rol',
      name: 'AdminRol',
      component: () => import('../views/RolView.vue'),
    },
  ],
}
,
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
    {
      path: '/glucometria',
      name: 'vistaInicial',
      // route level code-splitting
      // this generates a separate chunk (LoginView-[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/GlucometryView.vue'),
      meta: {
        requiresAuth: true
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
    {
      path: '/glucometrias',
      name: 'glucometrias',
      component: () => import('../views/GlucometriasPaciente.vue'),
      meta: {
        requiresAuth: true 
      }
    },
    {
      path: '/donantes',
      name: 'donantes',
      // route level code-splitting
      // this generates a separate chunk (LoginView-[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/DonantesView.vue'),
      meta: {
        requiresAuth: true
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
