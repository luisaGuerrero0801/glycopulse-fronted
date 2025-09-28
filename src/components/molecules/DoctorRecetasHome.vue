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
        </div>
      </div>
    </div>

<!-- Modal detalle -->
<div v-if="recetaSeleccionada" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-xl w-11/12 max-w-3xl p-8 relative overflow-y-auto max-h-[90vh]">
    <button
      @click="recetaSeleccionada = null"
      class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
    >
      ×
    </button>

    <!-- Tabs -->
    <div class="flex border-b mb-4">
      <button
        :class="[
          'px-4 py-2 text-sm font-medium',
          tab === 'ingredientes'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        ]"
        @click="tab = 'ingredientes'"
      >
        Ingredientes
      </button>
      <button
        :class="[
          'px-4 py-2 text-sm font-medium',
          tab === 'preparacion'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        ]"
        @click="tab = 'preparacion'"
      >
        Preparación
      </button>
    </div>

    <!-- INGREDIENTES -->
    <div v-if="tab === 'ingredientes'">
      <!-- Imagen + info -->
      <div class="flex flex-col md:flex-row gap-4 mb-4">
        <img
          :src="recetaSeleccionada.imagenReceta || 'https://via.placeholder.com/250'"
          class="w-full md:w-1/2 h-42 object-cover rounded"
        />
        <div class="flex-1">
          <h2 class="text-2xl font-bold mb-2">{{ recetaSeleccionada.nombre }}</h2>
          <p class="text-lg text-gray-700">{{ recetaSeleccionada.descripcion }}</p>
        </div>
      </div>

      <!-- Barra con nivel, porciones, calorías, tiempo -->
      <div
        class="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-100 rounded-xl p-4 text-center mb-4"
      >
        <div>
          <p class="text-sm font-medium text-gray-500">Nivel</p>
          <p class="text-lg font-semibold text-indigo-700">
            {{ recetaSeleccionada.nivel }}
          </p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Porciones</p>
          <p class="text-lg font-semibold text-indigo-700">
            {{ recetaSeleccionada.porciones }}
          </p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Calorías</p>
          <p class="text-lg font-semibold text-indigo-700">
            {{ recetaSeleccionada.calorias }}
          </p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Tiempo</p>
          <p class="text-lg font-semibold text-indigo-700">
            {{ recetaSeleccionada.tiempo }}
          </p>
        </div>
      </div>

      <!-- Lista de ingredientes -->
      <div v-if="recetaSeleccionada.ingredientes?.length">
        <h3 class="text-lg font-bold mb-2">Ingredientes:</h3>
        <ul class="list-disc pl-5 space-y-1 text-lg text-gray-700">
          <li v-for="(i, idx) in recetaSeleccionada.ingredientes" :key="idx">
            {{ i.nombre }} - {{ i.cantidad || '-' }} {{ i.unidad || '' }}
          </li>
        </ul>
      </div>
    </div>
<!-- PREPARACIÓN -->
<div v-if="tab === 'preparacion'">
  <h3 class="text-lg text-gray-700 font-bold mb-2">Preparación:</h3>

  <div v-if="recetaSeleccionada.pasosPreparacion?.length">
    <ol class="list-decimal pl-5 space-y-2 text-lg text-gray-700">
      <li v-for="(paso, idx) in pasosVisibles" :key="idx">
        {{ paso.descripcion }}
      </li>
    </ol>

    <!-- Controles de paginación -->
    <div class="flex justify-between items-center mt-4">
      <button
        @click="pasoPagina--"
        :disabled="pasoPagina === 0"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        ←
      </button>
      <button
        @click="pasoPagina++"
        :disabled="pasoPagina === totalPaginas - 1"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
       →
      </button>
    </div>
  </div>
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
const tab = ref<'ingredientes' | 'preparacion'>('ingredientes')
const pasoPagina = ref(0) // página actual de pasos
const pasosPorPagina = 7

const pasosVisibles = computed(() => {
  if (!recetaSeleccionada.value?.pasosPreparacion) return []
  const start = pasoPagina.value * pasosPorPagina
  return recetaSeleccionada.value.pasosPreparacion.slice(start, start + pasosPorPagina)
})

const totalPaginas = computed(() => {
  if (!recetaSeleccionada.value?.pasosPreparacion) return 0
  return Math.ceil(recetaSeleccionada.value.pasosPreparacion.length / pasosPorPagina)
})


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
