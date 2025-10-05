import { createRouter, createWebHistory } from 'vue-router'
import { loginStore } from '@/stores/login'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminPageView.vue'),
      meta: {
        requiresAuth: true /**cambiar a true */
      },
      children: [
        {
          path: 'users',
          name: 'AdminUsers',
          component: () => import('../views/UserListView.vue')
        },
        {
          path: 'panel',
          name: 'AdminPanel',
          component: () => import('../views/PanelView.vue')
        },

        {
          path: 'dashboard',
          name: 'AdminDashboard',
          component: () => import('../views/DashboardView.vue')
        },

      
        {
          path: 'groups',
          name: 'AdminGroups',
          component: () => import('../views/GroupsView.vue')
        },
        {
          path: 'rol',
          name: 'AdminRol',
          component: () => import('../views/RolView.vue')
        },

        {
          path: 'recipe',
          name: 'AdminRecipe',
          component: () => import('../views/CreateRecipeView.vue')
        },
        {
          path: 'favoritos',
          name: 'AdminFav',
          component: () => import('../views/FavoritosView.vue')
        },
        {
          path: 'doctores/nuevo',
          name: 'FormDoctorAdmin',
          component: () => import('../views/FormDoctorAdminView.vue')
        }
      ]
    },
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
      path: '/verify',
      name: 'verify',
      component: () => import('../views/VerifyAccountView.vue'),
      meta: { requiresAuth: false }
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
      path: '/reset-password',
      name: 'reset-password',
      // route level code-splitting
      // this generates a separate chunk (LoginView-[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ResetPasswordView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/recetas-saludables/recetas/:id/crear',
      name: 'recetasSaludables',
      component: () => import('../views/RecetasSaludablesView.vue'),
      meta: {
        requiresAuth: true /**cambiar a true */
      }
    },
    {
      path: '/reportes',
      name: 'reportes',
      component: () => import('../views/Reportes/ReportesView.vue'),
      meta: {
        requiresAuth: true /**cambiar a true */
      }
    },
    {
      path: '/glucometrias',
      name: 'glucometrias',
      component: () => import('../views/glucometries/GlucometriasPaciente.vue'),
      meta: {
        requiresAuth: true /**cambiar a true */
      }
    },
    {
      path: '/doctor/pacientes',
      name: 'DoctorPacientes',
      component: () => import('@/views/DoctorPacientesView.vue'),
      meta: { requiresAuth: false, role: 'doctor' }
    },
    {
      path: '/doctor/pacientes/:id/glucometrias',
      name: 'DoctorGlucometry',
      component: () => import('@/views/glucometries/GlucometriasDoctor.vue'),
      meta: { requiresAuth: true, role: 'doctor' }
    },
    {
      path: '/doctor/:id/recetas',
      name: 'DoctorRecetasHome',
      component: () => import('@/views/DoctorRecetasHomeView.vue'),
      meta: { requiresAuth: false, role: 'doctor' }
    },

    // 🔹 Vista de creación de receta (Card)
    {
      path: '/doctor/recetas/:id/crear',
      name: 'DoctorRecetaCard',
      component: () => import('@/views/DoctorRecetaCardView.vue'),
      meta: { requiresAuth: false, role: 'doctor' }
    },
    {
  path: '/doctor/pacientes/:id/reportes',
  name: 'DoctorReportesHome',
  component: () => import('../views/DoctorReportesHomeView.vue'),
  meta: {  requiresAuth: true, role: 'doctor'
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
        requiresAuth: true /**cambiar a true */
      }
    },

    {
      path: '/asignar',
      name: 'Asignar',
      component: () => import('../views/UsuarioDoctorAsignarView.vue'),
      meta: { requiresAuth: true }
    },



    // terminos y condiciones 

    {
    path: '/condiciones',
    name: 'Condiciones',
    component: () => import('../views/policies/CondicionesView.vue'),
  },
  {
    path: '/privacidad',
    name: 'PoliticaPrivacidad',
    component: () => import('../views/policies/PoliticaPrivacidadView.vue'),
  },
  {
    path: '/terminos',
    name: 'TerminosCondiciones',
    component: () => import('../views/policies/TerminosCondicionesView.vue'),
  
  },
  ]
})

router.beforeEach((to, from, next) => {
  const login = loginStore()
  login.initStore() // mantener sesión al recargar

  const token = login.token
  const rol = login.rol

  const requiresAuth = to.meta.requiresAuth
  const allowedRoles = (to.meta.allowedRoles || []) as string[]

  if (requiresAuth && !token) {
    return next('/')
  }

  if (requiresAuth && allowedRoles.length && !allowedRoles.includes(rol)) {
    return next('/')
  }

  next()
})

export default router
