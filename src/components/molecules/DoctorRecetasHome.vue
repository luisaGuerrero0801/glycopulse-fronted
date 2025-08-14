<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import iconoUsuario from '@/assets/iconoC.png'

const showMenu = ref(false)
const search = ref('')
const router = useRouter()
const emit = defineEmits(['crear-receta'])
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const cerrarSesion = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const crearReceta = () => {
  emit('crear-receta') // Ajusta la ruta si necesitas
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Barra superior -->
    <div class="flex items-center justify-between gap-4 px-6 py-4 bg-white shadow-sm">
      <h1 class="text-2xl font-bold text-[#374473]">Recetas</h1>

      <div class="flex items-center gap-3">
        <!-- Input de búsqueda con icono -->
        <div class="relative">
          <input
            v-model="search"
            type="text"
            placeholder="Buscar"
            class="w-64 border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        <!-- Botón superior derecho -->
        <button
          @click="crearReceta"
          class="bg-blue-950 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow"
        >
          Crear recetas
        </button>

        <!-- Menú usuario -->
        <div class="relative">
          <img
            :src="iconoUsuario"
            alt="Usuario"
            class="w-10 h-10 rounded-full object-cover cursor-pointer border border-gray-300"
            @click="toggleMenu"
          />
          <div
            v-if="showMenu"
            class="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50"
          >
            <button
              @click="cerrarSesion"
              class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido centrado -->
    <div class="flex flex-1 items-center justify-center">
      <button
        @click="crearReceta"
        class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg shadow-lg"
      >
        Crear receta
      </button>
    </div>
  </div>
</template>
