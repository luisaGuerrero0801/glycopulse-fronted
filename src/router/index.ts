import { createRouter, createWebHistory } from 'vue-router'
import { loginStore } from '@/stores/login'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ========== RUTAS PÚBLICAS ==========
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
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
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/recover',
      name: 'recover',
      component: () => import('../views/RecoverAccountView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../views/ResetPasswordView.vue'),
      meta: { requiresAuth: false }
    },

    // ========== POLÍTICAS Y TÉRMINOS ==========
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

    // ========== RUTAS DE PACIENTE ==========
    {
      path: '/paciente',
      meta: { requiresAuth: true, allowedRoles: ['paciente'] },
      children: [
        {
          path: 'recetas-saludables/recetas/:id/crear',
          name: 'recetasSaludables',
          component: () => import('../views/RecetasSaludablesView.vue'),
        },
        {
          path: 'reportes',
          name: 'reportes',
          component: () => import('../views/Reportes/ReportesView.vue'),
        },
        {
          path: 'glucometrias',
          name: 'glucometrias',
          component: () => import('../views/glucometries/GlucometriasPaciente.vue'),
        },
        {
          path: 'donantes',
          name: 'donantes',
          component: () => import('../views/DonantesView.vue'),
        },
        {
          path: 'asignar',
          name: 'Asignar',
          component: () => import('../views/UsuarioDoctorAsignarView.vue'),
        },
        {
          path: 'favoritos',
          name: 'AdminFav',
          component: () => import('../views/FavoritosView.vue'),
        },
      ]
    },

    // ========== RUTAS DE DOCTOR ==========
    {
      path: '/doctor',
      meta: { requiresAuth: true, allowedRoles: ['doctor'] },
      children: [
        {
          path: 'pacientes',
          name: 'DoctorPacientes',
          component: () => import('@/views/DoctorPacientesView.vue'),
        },
        {
          path: 'pacientes/:id/glucometrias',
          name: 'DoctorGlucometry',
          component: () => import('@/views/glucometries/GlucometriasDoctor.vue'),
        },
        {
          path: ':id/recetas',
          name: 'DoctorRecetasHome',
          component: () => import('@/views/DoctorRecetasHomeView.vue'),
        },
        {
          path: 'recetas/:id/crear',
          name: 'DoctorRecetaCard',
          component: () => import('@/views/DoctorRecetaCardView.vue'),
        },
        {
          path: 'pacientes/:id/reportes',
          name: 'DoctorReportesHome',
          component: () => import('../views/DoctorReportesHomeView.vue'),
        },
      ]
    },

    // ========== RUTAS DE ADMINISTRADOR ==========
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminPageView.vue'),
      meta: { requiresAuth: true, allowedRoles: ['admin'] },
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
          path: 'doctores/nuevo',
          name: 'FormDoctorAdmin',
          component: () => import('../views/FormDoctorAdminView.vue')
        }
      ]
    },

    // ========== RUTA DE FALLBACK ==========
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const login = loginStore()
  login.initStore() // mantener sesión al recargar

  const token = login.token
  const userRole = login.rol // 'paciente', 'doctor', 'admin'

  const requiresAuth = to.meta.requiresAuth as boolean
  const allowedRoles = (to.meta.allowedRoles || []) as string[]

  // Si la ruta requiere autenticación y no hay token
  if (requiresAuth && !token) {
    return next('/')
  }

  // Si la ruta requiere autenticación y tiene token
  if (requiresAuth && token) {
    // Si la ruta tiene roles específicos y el usuario no tiene un rol permitido
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      // Redirigir según el rol del usuario
      switch (userRole) {
        case 'paciente':
          return next('/paciente/reportes') // o la ruta principal del paciente
        case 'doctor':
          return next('/doctor/pacientes')
        case 'admin':
          return next('/admin/panel')
        default:
          return next('/')
      }
    }
  }

  // Si está autenticado y trata de acceder a login/register, redirigir según su rol
  if (token && ['/', '/register', '/login'].includes(to.path)) {
    switch (userRole) {
      case 'paciente':
        return next('/paciente/reportes')
      case 'doctor':
        return next('/doctor/pacientes')
      case 'admin':
        return next('/admin/panel')
      default:
        next()
    }
  }

  next()
})

export default router