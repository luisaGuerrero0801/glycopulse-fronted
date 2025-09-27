<!-- DoctorRecetasHomeView.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Barra superior -->
    <div class="flex items-center justify-between gap-4 px-6 py-4 bg-white shadow-sm">
      <h1 class="text-2xl font-bold text-[#374473]">Recetas</h1>
      <div class="flex items-center gap-3">
        <!-- Buscador -->
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
    <!-- Mostrar loading mientras se cargan las recetas -->
<div v-if="recetasStore.cargando" class="flex justify-center items-center mt-8">
  <span class="text-gray-500">Cargando recetas...</span>
</div>


    <!-- Contenido: listado de recetas -->
    <div class="flex flex-wrap justify-center gap-6 p-6">
      <div
        v-for="receta in recetasFiltradas"
        :key="receta.idReceta"
        class="w-64 bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition"
        @click="abrirDetalle(receta)"
      >
        <img
          :src="receta.imagenReceta || 'https://via.placeholder.com/250'"
          alt="Imagen receta"
          class="w-full h-40 object-cover"
        />
        <div class="p-4">
          <h2 class="text-lg font-semibold mb-2">{{ receta.nombre }}</h2>
          <p class="text-gray-600 truncate">{{ receta.descripcion }}</p>
        </div>
      </div>
    </div>

    <!-- Modal detalle -->
    <div
      v-if="recetaSeleccionada"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl w-11/12 max-w-xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          @click="recetaSeleccionada = null"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          ×
        </button>
        <img
          :src="recetaSeleccionada.imagenReceta || 'https://via.placeholder.com/250'"
          class="w-full h-48 object-cover rounded mb-4"
        />
        <h2 class="text-2xl font-bold mb-2">{{ recetaSeleccionada.nombre }}</h2>
        <p class="mb-2">{{ recetaSeleccionada.descripcion }}</p>
        <p class="mb-1"><strong>Nivel:</strong> {{ recetaSeleccionada.nivel }}</p>
        <p class="mb-1"><strong>Porciones:</strong> {{ recetaSeleccionada.porciones }}</p>
        <p class="mb-1"><strong>Calorías:</strong> {{ recetaSeleccionada.calorias }}</p>
        <p class="mb-1"><strong>Tiempo:</strong> {{ recetaSeleccionada.tiempo }}</p>

        <div v-if="recetaSeleccionada.ingredientes?.length" class="mt-4">
          <h3 class="font-semibold mb-1">Ingredientes:</h3>
          <ul class="list-disc pl-5">
            <li v-for="(i, idx) in recetaSeleccionada.ingredientes" :key="idx">
              {{ i.nombre }} - {{ i.cantidad || '-' }} {{ i.unidad || '' }}
            </li>
          </ul>
        </div>
<div v-if="recetasStore.error" class="text-red-500 text-center mt-4">
  {{ recetasStore.error }}
</div>

        <div v-if="recetaSeleccionada.pasosPreparacion?.length" class="mt-4">
          <h3 class="font-semibold mb-1">Pasos:</h3>
          <ol class="list-decimal pl-5">
            <li v-for="(p, idx) in recetaSeleccionada.pasosPreparacion" :key="idx">
              {{ p.descripcion }}
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import iconoUsuario from '@/assets/iconoC.png'
import { useRecetasPacienteStore } from '@/stores/VistaHomeRecetas'

const showMenu = ref(false)
const search = ref('')
const router = useRouter()
const route = useRoute()
const pacienteId = Number(route.params.id) || 0


const toggleMenu = () => {
  showMenu.value = !showMenu.value
}
const cerrarSesion = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
const crearReceta = () => {
  router.push({ name: 'DoctorRecetaCard', params: { id: pacienteId } })
}

const recetasStore = useRecetasPacienteStore()
const recetaSeleccionada = ref<null | any>(null)

onMounted(() => {
  if (pacienteId) {
    recetasStore.fetchRecetasPaciente(pacienteId)
  }
})
const recetasFiltradas = computed(() =>
  recetasStore.recetas.filter((r) => r.nombre.toLowerCase().includes(search.value.toLowerCase()))
)

const abrirDetalle = (receta: any) => {
  recetaSeleccionada.value = receta
}
</script>
