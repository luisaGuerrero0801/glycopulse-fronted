<template>
  <div class="min-h-screen">
    <div class="flex justify-center items-center flex-col py-8">
      <h1 class="text-6xl font-bold titulo">
        <span v-if="loading">Cargando usuario...</span>
        ¡Hola, <span>{{ nombreUsuario }}</span>!
      </h1>
      <p class="text-gray-600 mt-2 sub-text">Elige una opción para gestionar el sistema:</p>
    </div>

    <div class="flex items-center justify-center px-6 py-11">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link to="/admin/users">
          <div
            class="bg-white text-blue-600 p-6 rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300"
          >
            <h2 class="text-xl font-bold flex items-center text-admin">
              <span class="material-icons mr-3">group</span> Usuarios
            </h2>
            <p class="mt-2 text-sm text-gray-500">Gestiona todos los usuarios registrados.</p>
          </div>
        </router-link>

        <router-link to="/admin/dashboard">
          <div
            class="bg-white text-blue-600 p-6 rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300"
          >
            <h2 class="text-xl font-bold flex items-center text-admin">
              <span class="material-icons mr-3">dashboard</span> Dashboard
            </h2>
            <p class="mt-2 text-sm text-gray-500">
              Visión general de las estadísticas del sistema.
            </p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useUsuariosStore } from '../../stores/donantes'
import { storeToRefs } from 'pinia'

const token = sessionStorage.getItem('token')
const rol = sessionStorage.getItem('rol')
const idUsuario = Number(sessionStorage.getItem('idUsuario'))

const usuariosStore = useUsuariosStore()
const { usuariosFiltrados, loading } = storeToRefs(usuariosStore)

onMounted(async () => {
  await usuariosStore.fetchUsuarios()
})

const nombreUsuario = computed(() => {
  const usuarioEncontrado = usuariosFiltrados.value.find((u) => u.idUsuario === idUsuario)
  return usuarioEncontrado ? usuarioEncontrado.nombresUsuario : 'Usuario'
})
</script>
