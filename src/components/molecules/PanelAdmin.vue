<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex justify-center items-center flex-col py-8">
      <h1 class="text-4xl font-bold">
        👋 
        <span v-if="loading">Cargando usuario...</span>
        <span v-else>¡Hola, {{ nombreUsuario }}!</span>
      </h1>
      <p class="text-gray-600 mt-2">Elige una opción para gestionar el sistema:</p>
    </div>

    <div class="flex items-center justify-center px-6 py-11">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link to="/admin/users">
          <div class="bg-white text-blue-600 p-6 rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300">
            <h2 class="text-xl font-bold flex items-center">
              <span class="material-icons mr-3">group</span> Usuarios
            </h2>
            <p class="mt-2 text-sm text-gray-500">Gestiona todos los usuarios registrados.</p>
          </div>
        </router-link>

        <router-link to="/admin/notification">
          <div class="bg-white text-blue-600 p-6 rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300">
            <h2 class="text-xl font-bold flex items-center">
              <span class="material-icons mr-3">notifications</span> Notificaciones
            </h2>
            <p class="mt-2 text-sm text-gray-500">
              Tienes <span class="font-bold text-red-600">{{ notificaciones }}</span> nuevas notificaciones.
            </p>
          </div>
        </router-link>

        <router-link to="/admin/dashboard">
          <div class="bg-white text-blue-600 p-6 rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300">
            <h2 class="text-xl font-bold flex items-center">
              <span class="material-icons mr-3">dashboard</span> Dashboard
            </h2>
            <p class="mt-2 text-sm text-gray-500">Visión general de las estadísticas del sistema.</p>
          </div>
        </router-link>


        <router-link to="/admin/recipe">
          <div class="bg-white text-blue-600 p-6 rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300">
            <h2 class="text-xl font-bold flex items-center">
              <span class="material-icons mr-3">add_circle</span> Crear Receta
            </h2>
            <p class="mt-2 text-sm text-gray-500">Crear Receta.</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useUsuariosStore } from '../../stores/donantes'
import { storeToRefs } from 'pinia'
import { useNotificacionesStore } from '@/stores/notificaciones'
import { toast } from 'vue3-toastify'


const token = sessionStorage.getItem('token')
const rol = sessionStorage.getItem('rol')
const idUsuario = Number(sessionStorage.getItem('idUsuario'))

const usuariosStore = useUsuariosStore()
const { usuariosFiltrados, loading, error } = storeToRefs(usuariosStore)

const notificacionesStore = useNotificacionesStore()

onMounted(async () => {
  // 1. Cargar usuarios antes de usarlos
  await usuariosStore.fetchUsuarios()

  // 2. Mostrar notificaciones emergentes si no han sido leídas
  notificacionesStore.lista.forEach((n) => {
    if (n.emergente && !n.leido) {
      const clave = `toastMostrado-${n.mensaje}`

      if (!sessionStorage.getItem(clave)) {
        toast.info(n.mensaje, {
          autoClose: 4000,
          position: 'top-right'
        })
        sessionStorage.setItem(clave, 'true')
      }
    }
  })
  
  if (rol === 'Admin') {
    setTimeout(() => {
    }, 7000)
  }
})

const nombreUsuario = computed(() => {
  const usuarioEncontrado = usuariosFiltrados.value.find(u => u.idUsuario === idUsuario)
  return usuarioEncontrado ? usuarioEncontrado.nombresUsuario : 'Usuario'
})

const notificaciones = computed(() => 
  notificacionesStore.lista.filter(n => !n.leido).length
)
</script>
