import { createRouter, createWebHistory } from 'vue-router'
import { loginStore } from '@/stores/login'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ===========================
    //  ADMIN
    // ===========================
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminPageView.vue'),
      meta: { requiresAuth: true, role: 'Admin' },
      children: [
        { path: 'users', name: 'AdminUsers', component: () => import('../views/UserListView.vue') },
        { path: 'panel', name: 'AdminPanel', component: () => import('../views/PanelView.vue') },
        { path: 'dashboard', name: 'AdminDashboard', component: () => import('../views/DashboardView.vue') },
        { path: 'notification', name: 'AdminNotification', component: () => import('../views/NotificationView.vue') },
        { path: 'support', name: 'AdminSupport', component: () => import('../views/NotificationView.vue') },
        { path: 'groups', name: 'AdminGroups', component: () => import('../views/GroupsView.vue') },
        { path: 'rol', name: 'AdminRol', component: () => import('../views/RolView.vue') },
        { path: 'recipe', name: 'AdminRecipe', component: () => import('../views/CreateRecipeView.vue') },
        { path: 'favoritos', name: 'AdminFav', component: () => import('../views/FavoritosView.vue') },
        { path: 'doctores/nuevo', name: 'FormDoctorAdmin', component: () => import('../views/FormDoctorAdminView.vue') }
      ]
    },

    // ===========================
    //  LOGIN / REGISTRO
    // ===========================
    { path: '/', name: 'login', component: () => import('../views/LoginView.vue'), meta: { requiresAuth: false } },
    { path: '/verify', name: 'verify', component: () => import('../views/VerifyAccountView.vue'), meta: { requiresAuth: false } },
    { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue'), meta: { requiresAuth: false } },
    { path: '/recover', name: 'recover', component: () => import('../views/RecoverAccountView.vue'), meta: { requiresAuth: false } },
    { path: '/reset-password', name: 'reset-password', component: () => import('../views/ResetPasswordView.vue'), meta: { requiresAuth: false } },

    // ===========================
    //  DOCTOR
    // ===========================
    {
      path: '/doctor',
      name: 'doctor',
      component: () => import('@/views/DoctorPageView.vue'),
      meta: { requiresAuth: true, role: 'Doctor' },
      children: [
        {
          path: 'pacientes',
          name: 'DoctorPacientes',
          component: () => import('@/views/DoctorPacientesView.vue'),
          meta: { requiresAuth: true, role: 'Doctor' }
        },
        {
          path: 'pacientes/:id/glucometrias',
          name: 'DoctorGlucometry',
          component: () => import('@/views/glucometries/GlucometriasDoctor.vue'),
          meta: { requiresAuth: true, role: 'Doctor' }
        },
        {
          path: ':id/recetas',
          name: 'DoctorRecetasHome',
          component: () => import('@/views/DoctorRecetasHomeView.vue'),
          meta: { requiresAuth: true, role: 'Doctor' }
        },
        {
          path: 'recetas/:id/crear',
          name: 'DoctorRecetaCard',
          component: () => import('@/views/DoctorRecetaCardView.vue'),
          meta: { requiresAuth: true, role: 'Doctor' }
        },
        {
          path: 'pacientes/:id/reportes',
          name: 'DoctorReportesHome',
          component: () => import('@/views/DoctorReportesHomeView.vue'),
          meta: { requiresAuth: true, role: 'Doctor' }
        }
      ]
    },

    // ===========================
    // 🔹 PACIENTE
    // ===========================
    {
      path: '/glucometrias',
      name: 'glucometrias',
      component: () => import('../views/glucometries/GlucometriasPaciente.vue'),
      meta: { requiresAuth: true, role: 'Paciente' }
    },
    {
      path: '/reportes',
      name: 'reportes',
      component: () => import('../views/Reportes/ReportesView.vue'),
      meta: { requiresAuth: true, role: 'Paciente' }
    },

    // ===========================
    //  OTROS
    // ===========================
    {
      path: '/recetas-saludables/recetas/:id/crear',
      name: 'recetasSaludables',
      component: () => import('../views/RecetasSaludablesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/donantes',
      name: 'donantes',
      component: () => import('../views/DonantesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/asignar',
      name: 'Asignar',
      component: () => import('../views/UsuarioDoctorAsignarView.vue'),
      meta: { requiresAuth: true }
    },

    // ===========================
    //  LEGALES
    // ===========================
    { path: '/condiciones', name: 'Condiciones', component: () => import('../views/policies/CondicionesView.vue') },
    { path: '/privacidad', name: 'PoliticaPrivacidad', component: () => import('../views/policies/PoliticaPrivacidadView.vue') },
    { path: '/terminos', name: 'TerminosCondiciones', component: () => import('../views/policies/TerminosCondicionesView.vue') }
  ]
})


// ===========================
//  GUARD DE SEGURIDAD
// ===========================
router.beforeEach((to, from, next) => {
  const login = loginStore()
  login.initStore()

  const token = login.token
  const rol = login.rol // Puede ser 'Admin', 'Doctor', 'Paciente'

  //  Si la ruta requiere autenticación y no hay token
  if (to.meta.requiresAuth && !token) {
    return next('/')
  }

  //  Si la ruta requiere un rol específico
  if (to.meta.role && to.meta.role !== rol) {
    if (rol === 'Admin') return next('/admin/panel')
    if (rol === 'Doctor') return next('/doctor/pacientes')
    if (rol === 'Paciente') return next('/glucometrias')
    return next('/')
  }

  next()
})

export default router
