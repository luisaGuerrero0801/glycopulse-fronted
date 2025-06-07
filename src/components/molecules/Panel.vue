<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex justify-center items-center flex-col py-8">
      <h1 class="text-4xl font-bold">👋 ¡Hola, Admin!</h1>
      <p class="text-gray-600 mt-2">Elige una opción para gestionar el sistema:</p>
    </div>

    <div class="flex items-center justify-center px-6 py-11">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link to="/admin/users">
          <div
            class="bg-white text-blue-600 p-6 rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300"
          >
            <h2 class="text-xl font-bold flex items-center">
              <span class="material-icons mr-3">group</span> Usuarios
            </h2>
            <p class="mt-2 text-sm text-gray-500">Gestiona todos los usuarios registrados.</p>
          </div>
        </router-link>

        <router-link to="/admin/notification">
          <div
            class="bg-white text-blue-600 p-6 rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300"
          >
            <h2 class="text-xl font-bold flex items-center">
              <span class="material-icons mr-3">notifications</span> Notificaciones
            </h2>
            <p class="mt-2 text-sm text-gray-500">
              Tienes
              <span class="font-bold text-red-600">{{ notificaciones }}</span> nuevas
              notificaciones.
            </p>
          </div>
        </router-link>

        <router-link to="/admin/dashboard">
          <div
            class="bg-white text-blue-600 p-6 rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300"
          >
            <h2 class="text-xl font-bold flex items-center">
              <span class="material-icons mr-3">dashboard</span> Dashboard
            </h2>
            <p class="mt-2 text-sm text-gray-500">
              Visión general de las estadísticas del sistema.
            </p>
          </div>
        </router-link>

        <router-link to="/admin/support">
          <div
            class="bg-white text-blue-600 p-6 rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300"
          >
            <h2 class="text-xl font-bold flex items-center">
              <span class="material-icons mr-3">headset_mic</span> Soporte
            </h2>
            <p class="mt-2 text-sm text-gray-500">Accede al centro de ayuda y soporte técnico.</p>
          </div>
        </router-link>

        <router-link to="/admin/rol">
          <div
            class="bg-white text-blue-600 p-6 rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300"
          >
            <h2 class="text-xl font-bold flex items-center">
              <span class="material-icons mr-3">shield</span> Roles
            </h2>
            <p class="mt-2 text-sm text-gray-500">Gestiona los roles y permisos de los usuarios.</p>
          </div>
        </router-link>

        <router-link to="/admin/groups">
          <div
            class="bg-white text-blue-600 p-6 rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300"
          >
            <h2 class="text-xl font-bold flex items-center">
              <span class="material-icons mr-3">group_work</span> Grupos
            </h2>
            <p class="mt-2 text-sm text-gray-500">Organiza a los usuarios en grupos específicos.</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const notificaciones = ref(3) // Puedes cambiar este valor o conectarlo a una API
</script>
