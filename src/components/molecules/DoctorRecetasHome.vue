<!-- DoctorRecetasHome.vue -->
<template>
  <HeaderApp pagename="doctor/crear" />
  <div class="flex justify-end mt-8">
    <button
      @click="crearReceta"
      class="bg-blue-950 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow"
    >
      Crear receta
    </button>
  </div>
  <!-- Mostrar loading mientras se cargan las recetas -->
  <div v-if="recetasStore.cargando" class="flex justify-center items-center mt-8">
    <span class="text-gray-500">Cargando recetas...</span>
  </div>

  <!-- Contenido: listado de recetas -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
    <div
      v-for="receta in paginatedItems"
      :key="receta.idReceta"
      class="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition min-h-[150px]"
      @click="abrirDetalle(receta)"
    >
      <img
        :src="receta.imagenReceta || 'https://via.placeholder.com/250'"
        alt="Imagen receta"
        class="w-full h-40 object-cover"
      />
      <div class="p-2 flex items-center justify-between">
        <h2 class="text-lg font-semibold">{{ receta.nombre }}</h2>
        <!-- Botón corazón -->
        <button
          class="text-red-500 hover:scale-110 transition"
          @click.stop="toggleFavorito(receta)"
        >
          <!-- <span class="material-icons">
              {{ receta. ? 'favorite' : 'favorite_border' }}
            </span> -->
        </button>
      </div>
    </div>
  </div>
  <!-- Paginación abajo -->
  <div class="flex justify-center mt-6" v-if="totalPages > 1">
    <paginate
      :page-count="totalPages"
      :click-handler="goToPage"
      :prev-text="'Anterior'"
      :next-text="'Siguiente'"
      :container-class="'flex space-x-2'"
      :page-class="'px-4 py-2 border rounded cursor-pointer text-gray-700 hover:bg-gray-200'"
      :active-class="'bg-blue-600 text-white font-semibold'"
      :prev-class="'px-4 py-2 border rounded cursor-pointer text-gray-700 hover:bg-gray-200'"
      :next-class="'px-4 py-2 border rounded cursor-pointer text-gray-700 hover:bg-gray-200'"
    />
  </div>

  <!-- Modal detalle -->
  <div
    v-if="recetaSeleccionada"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-xl w-11/12 max-w-3xl p-8 relative overflow-y-auto max-h-[90vh]">
<!-- Header del modal -->
<div class="flex justify-between items-center mb-6">
  <!-- Botón eliminar -->
  <button
    @click="eliminarReceta(recetaSeleccionada.idReceta)"
    class="text-red-600 hover:text-red-800 font-medium flex items-center gap-1 text-base"
  >
    <span class="material-icons text-base">delete</span>
    Eliminar
  </button>
  <!-- Botón cerrar -->
  <button
    @click="recetaSeleccionada = null"
    class="text-gray-500 hover:text-gray-800 text-xl font-bold leading-none"
  >
    ×
  </button>
</div>


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
            <li v-for="(i, idx) in ingredientesVisibles" :key="idx">
              {{ i.nombre }} - {{ i.cantidad || '-' }} {{ i.unidad || '' }}
            </li>
          </ul>

          <!-- Controles de paginación -->
          <div
            class="flex justify-center items-center mt-4 gap-6"
            v-if="totalPaginasIngredientes > 1"
          >
            <button
              @click="ingPagina--"
              :disabled="ingPagina === 0"
              class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              ←
            </button>
            <button
              @click="ingPagina++"
              :disabled="ingPagina === totalPaginasIngredientes - 1"
              class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              →
            </button>
          </div>
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Paginate from 'vuejs-paginate-next'
import { useRecetasPacienteStore } from '@/stores/VistaHomeRecetas'
import HeaderApp from './HeaderApp.vue'
import { usePagination } from '@/composables/pagination/usePagination'
import { toast } from 'vue3-toastify'
const search = ref('')
const router = useRouter()
const route = useRoute()
const pacienteId = Number(route.params.id) || 0
const tab = ref<'ingredientes' | 'preparacion'>('ingredientes')

const ingPagina = ref(0) // página actual en ingredientes
const ingredientesPorPagina = 9

const ingredientesVisibles = computed(() => {
  if (!recetaSeleccionada.value?.ingredientes) return []
  const start = ingPagina.value * ingredientesPorPagina
  return recetaSeleccionada.value.ingredientes.slice(start, start + ingredientesPorPagina)
})

const totalPaginasIngredientes = computed(() => {
  if (!recetaSeleccionada.value?.ingredientes) return 0
  return Math.ceil(recetaSeleccionada.value.ingredientes.length / ingredientesPorPagina)
})

const pasoPagina = ref(0) // página actual de pasos
const pasosPorPagina = 8

const pasosVisibles = computed(() => {
  if (!recetaSeleccionada.value?.pasosPreparacion) return []
  const start = pasoPagina.value * pasosPorPagina
  return recetaSeleccionada.value.pasosPreparacion.slice(start, start + pasosPorPagina)
})

const totalPaginas = computed(() => {
  if (!recetaSeleccionada.value?.pasosPreparacion) return 0
  return Math.ceil(recetaSeleccionada.value.pasosPreparacion.length / pasosPorPagina)
})

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
const toggleFavorito = (receta: any) => {
  receta.esFavorito = !receta.esFavorito
}
// Número máximo de recetas por página
const recetasPorPagina = 12

// Integrar paginación
const { currentPage, paginatedItems, totalPages, goToPage } = usePagination(
  computed(() => recetasFiltradas.value),
  recetasPorPagina
)
const eliminarReceta = async (id: number) => {
  if (confirm('¿Seguro que quieres eliminar esta receta?')) {
    try {
      await recetasStore.eliminarReceta(id)
      recetaSeleccionada.value = null // cerrar modal tras eliminar
      toast.success('Receta eliminada correctamente ✅')
    } catch (error) {
      console.error(error)
      toast.error('Error al eliminar la receta ❌')
    }
  } else {
    toast.info('Eliminación cancelada 🚫')
  }
}




</script>
