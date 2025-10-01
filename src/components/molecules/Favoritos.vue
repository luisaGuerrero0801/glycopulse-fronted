<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <!-- Tabs principales -->
  <div class="flex justify-center mt-6 space-x-4">
    <button
      :class="[
        'px-4 py-2 rounded-lg font-medium',
        tabPrincipal === 'populares'
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      ]"
      @click="tabPrincipal = 'populares'"
    >
      Populares
    </button>
    <button
      :class="[
        'px-4 py-2 rounded-lg font-medium',
        tabPrincipal === 'favoritos'
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      ]"
      @click="tabPrincipal = 'favoritos'"
    >
      Favoritos
    </button>
  </div>
  <div v-if="recetasStore.cargando" class="flex justify-center items-center mt-8">
    <span class="text-gray-500">Cargando recetas...</span>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
    <div
      v-for="receta in recetasPaginadas"
      :key="receta.idReceta"
      class="bg-white h-[90%] bg rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition"
      @click="abrirDetalle(receta)"
    >
      <img
        :src="receta.imagenReceta || 'https://via.placeholder.com/250'"
        alt="Imagen receta"
        class="w-full h-40 object-cover"
      />
      <div class="p-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold">{{ receta.nombre }}</h2>
   
        <button
          class="text-red-500 hover:scale-110 transition"
          @click.stop="toggleFavorito(receta)"
        >
          <span class="material-icons">
            {{ receta.esFavorito ? 'favorite' : 'favorite_border' }}
          </span>
        </button>
      </div>
    </div>
  </div>


  <div class="flex justify-center mt-6">
    <paginate
      :page-count="totalPages"
      :click-handler="goToPage"
      :prev-text="'Anterior'"
      :next-text="'Siguiente'"
      :container-class="'flex space-x-2'"
      :page-class="'px-4 py-2 border rounded cursor-pointer text-lg text-gray-700 font-bold hover:bg-[var(--colorSecundarioButton)] transition'"
      :active-class="'bg-[var(--colorPrimarioButton)] text-white font-semibold'"
      :prev-class="'px-4 py-2 border rounded cursor-pointer text-lg text-gray-700 hover:bg-gray-200 transition'"
      :next-class="'px-4 py-2 border rounded cursor-pointer text-lg text-gray-700 hover:bg-gray-200 transition'"
    />
  </div>


  <div
    v-if="recetaSeleccionada"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-xl w-11/12 max-w-3xl p-8 relative overflow-y-auto max-h-[90vh]">
      <button
        @click="recetaSeleccionada = null"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
      >
        ×
      </button>

     
      <div class="flex border-b mb-4">
        <button
          :class="[
            'px-4 py-2 text-sm font-medium',
            tab === 'ingredientes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          ]"
          @click="tab = 'ingredientes'"
        >
          Ingredientes
        </button>
        <button
          :class="[
            'px-4 py-2 text-sm font-medium',
            tab === 'preparacion' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          ]"
          @click="tab = 'preparacion'"
        >
          Preparación
        </button>
      </div>

      <div v-if="tab === 'ingredientes'">
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

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-100 rounded-xl p-4 text-center mb-4">
          <div>
            <p class="text-sm font-medium text-gray-500">Nivel</p>
            <p class="text-lg font-semibold text-indigo-700">{{ recetaSeleccionada.nivel }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Porciones</p>
            <p class="text-lg font-semibold text-indigo-700">{{ recetaSeleccionada.porciones }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Calorías</p>
            <p class="text-lg font-semibold text-indigo-700">{{ recetaSeleccionada.calorias }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Tiempo</p>
            <p class="text-lg font-semibold text-indigo-700">{{ recetaSeleccionada.tiempo }}</p>
          </div>
        </div>

        <div v-if="recetaSeleccionada.ingredientes?.length">
          <h3 class="text-lg font-bold mb-2">Ingredientes:</h3>
          <ul class="list-disc pl-5 space-y-1 text-lg text-gray-700">
            <li v-for="(i, idx) in ingredientesVisibles" :key="idx">
              {{ i.nombre }} - {{ i.cantidad || '-' }} {{ i.unidad || '' }}
            </li>
          </ul>

          <div class="flex justify-center items-center mt-4 gap-6" v-if="totalPaginasIngredientes > 1">
            <button @click="ingPagina--" :disabled="ingPagina === 0" class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">←</button>
            <button @click="ingPagina++" :disabled="ingPagina === totalPaginasIngredientes - 1" class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">→</button>
          </div>
        </div>
      </div>

      
      <div v-if="tab === 'preparacion'">
        <h3 class="text-lg text-gray-700 font-bold mb-2">Preparación:</h3>
        <div v-if="recetaSeleccionada.pasosPreparacion?.length">
          <ol class="list-decimal pl-5 space-y-2 text-lg text-gray-700">
            <li v-for="(paso, idx) in pasosVisibles" :key="idx">
              {{ paso.descripcion }}
            </li>
          </ol>

         
          <div class="flex justify-between items-center mt-4">
            <button @click="pasoPagina--" :disabled="pasoPagina === 0" class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">←</button>
            <button @click="pasoPagina++" :disabled="pasoPagina === totalPaginas - 1" class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">→</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Paginate from 'vuejs-paginate-next'

import { useRecetasPacienteStore } from '@/stores/VistaHomeRecetas'

const router = useRouter()
const route = useRoute()
const pacienteId = Number(route.params.id) || 0

const search = ref('')
const tabPrincipal = ref<'populares' | 'favoritos'>('populares') // <-- NUEVO
const tab = ref<'ingredientes' | 'preparacion'>('ingredientes')
const recetaSeleccionada = ref<null | any>(null)

const ingPagina = ref(0)
const ingredientesPorPagina = 9

const pasoPagina = ref(0)
const pasosPorPagina = 8

const currentPage = ref(1)
const itemsPerPage = 12

const recetasStore = useRecetasPacienteStore()

onMounted(() => {
  if (pacienteId) {
    recetasStore.fetchRecetasPaciente(pacienteId)
  }
})



// Filtrado según tab principal
const recetasFiltradas = computed(() => {
  let recetas = recetasStore.recetas
  if (tabPrincipal.value === 'favoritos') {
    recetas = recetas.filter((r) => r.esFavorito)
  }
  return recetas
})


const totalPages = computed(() =>
  Math.ceil(recetasFiltradas.value.length / itemsPerPage)
)

const recetasPaginadas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return recetasFiltradas.value.slice(start, start + itemsPerPage)
})

const goToPage = (page: number) => {
  currentPage.value = page
}


const ingredientesVisibles = computed(() => {
  if (!recetaSeleccionada.value?.ingredientes) return []
  const start = ingPagina.value * ingredientesPorPagina
  return recetaSeleccionada.value.ingredientes.slice(start, start + ingredientesPorPagina)
})

const totalPaginasIngredientes = computed(() => {
  if (!recetaSeleccionada.value?.ingredientes) return 0
  return Math.ceil(recetaSeleccionada.value.ingredientes.length / ingredientesPorPagina)
})

const pasosVisibles = computed(() => {
  if (!recetaSeleccionada.value?.pasosPreparacion) return []
  const start = pasoPagina.value * pasosPorPagina
  return recetaSeleccionada.value.pasosPreparacion.slice(start, start + pasosPorPagina)
})

const totalPaginas = computed(() => {
  if (!recetaSeleccionada.value?.pasosPreparacion) return 0
  return Math.ceil(recetaSeleccionada.value.pasosPreparacion.length / pasosPorPagina)
})

const abrirDetalle = (receta: any) => {
  recetaSeleccionada.value = receta
  ingPagina.value = 0
  pasoPagina.value = 0
}

const toggleFavorito = (receta: any) => {
  receta.esFavorito = !receta.esFavorito
}
</script>

<style scoped>
.material-icons {
  font-size: 24px;
}
</style>
