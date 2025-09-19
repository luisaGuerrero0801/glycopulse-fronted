<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useUsuariosStore } from '@/stores/donantes'
import { ref } from 'vue'
import CardRh from './CardRh.vue'
import ModalDonantes from '@/components/ui/ModalDonantes.vue'

// Obtenemos el store
const usuariosStore = useUsuariosStore()

// Definimos los refs con tipado explícito
const { filtros, ubicacionesUnicas } = storeToRefs(usuariosStore) as {
  filtros: Ref<{
    busqueda: string
    ubicacion: string
    grupoSanguineo: string
  }>
  ubicacionesUnicas: Ref<string[]>
}

const gruposSanguineos = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

// Función para limpiar filtros
const limpiarFiltros = () => {
  filtros.value.busqueda = ''
  filtros.value.ubicacion = ''
  filtros.value.grupoSanguineo = ''
}

// Estado para manejar el modal y el donante seleccionado
const mostrarModal = ref(false)
const donanteSeleccionado = ref(null)

// Función para manejar la selección de un donante
const handleDonanteSeleccionado = (donante: any) => {
  donanteSeleccionado.value = donante
  mostrarModal.value = true
}

// Función para cerrar el modal
const cerrarModal = () => {
  mostrarModal.value = false
  donanteSeleccionado.value = null
}
</script>

<template>
  <main class="container mx-auto py-4">

    <!-- Filtros -->
    <div class="flex flex-col md:flex-row items-end gap-4 mb-6 p-4 rounded-lg bg-white shadow-md">
      <!-- Campo de búsqueda -->
      <div class="flex-1 w-full">
        <label for="patient-search" class="text-lg font-medium text-gray-700">Paciente</label>
        <div class="relative mt-1">
          <input
            id="patient-search"
            type="text"
            placeholder="Buscar paciente"
            v-model="filtros.busqueda"
            class="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 pl-10"
          />
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>

      <!-- Selector de ubicación -->
      <div class="flex-1 w-full">
        <label for="location-select" class="text-lg font-medium text-gray-700">Ubicación</label>
        <select
          id="location-select"
          v-model="filtros.ubicacion"
          class="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 mt-1"
        >
          <option value="">Todas las ubicaciones</option>
          <option v-for="ubicacion in ubicacionesUnicas" :key="ubicacion" :value="ubicacion">
            {{ ubicacion }}
          </option>
        </select>
      </div>

      <!-- Selector de grupo sanguíneo -->
      <div class="flex-1 w-full">
        <label for="rh-select" class="text-lg font-medium text-gray-700">Grupo Sanguíneo</label>
        <select
          id="rh-select"
          v-model="filtros.grupoSanguineo"
          class="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 mt-1"
        >
          <option value="">Todos los tipos</option>
          <option v-for="grupo in gruposSanguineos" :key="grupo" :value="grupo">
            {{ grupo }}
          </option>
        </select>
      </div>

      <!-- Botón restablecer -->
      <button
        @click="limpiarFiltros"
        class="w-full text-lg md:w-auto bg-[var(--colorPrimarioButton)] text-white font-bold py-2 px-6 rounded-md hover:bg-[var(--colorSecundarioButton)] transition-colors flex items-center justify-center gap-2"
      >
        Restablecer
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 5V3L8 7l4 4V9c3.31 0 6 2.69 6 6a6 6 0 0 1-6 6c-2.21 0-4.15-1.2-5.19-3H4.62A8.001 8.001 0 0 0 20 15c0-4.42-3.58-8-8-8z"
          />
        </svg>
      </button>
    </div>

    <!-- CardRh y ModalDonantes -->
    <CardRh @donante-seleccionado="handleDonanteSeleccionado"/>
    
    <ModalDonantes 
      v-if="mostrarModal" 
      :donante="donanteSeleccionado" 
      @cerrar="cerrarModal"
    />

  </main>
</template>
