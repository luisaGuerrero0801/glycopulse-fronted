<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useUsuariosStore } from '@/stores/donantes'
import type { Ref } from 'vue'

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
</script>

<template>
  <div class="flex justify-center w-full mt-6 px-4">
    <div class="bg-gray-50 p-4 rounded-xl shadow-md flex flex-col md:flex-row md:items-end md:justify-between gap-4 w-full max-w-[1200px]">
      
      <!-- Campo de búsqueda -->
      <div class="flex flex-col w-full md:w-1/3">
        <label class="text-gray-500 text-sm mb-1">Search</label>
        <input
          v-model="filtros.busqueda"
          type="text"
          placeholder="Buscar paciente"
          class="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-300 text-gray-700"
        />
      </div>

      <!-- Selector de ubicación -->
      <div class="flex flex-col w-full md:w-1/3">
        <label class="text-gray-500 text-sm mb-1">Ubicacion</label>
        <select
          v-model="filtros.ubicacion"
          class="border rounded-lg px-3 py-2 w-full text-gray-700 text-center"
        >
          <option value="">Todas las ubicaciones</option>
          <option v-for="ubicacion in ubicacionesUnicas" :key="ubicacion" :value="ubicacion">
            {{ ubicacion }}
          </option>
        </select>
      </div>

      <!-- Selector de grupo sanguíneo -->
      <div class="flex flex-col w-full md:w-1/3">
        <label class="text-gray-500 text-sm mb-1">Grupo Sanguineo</label>
        <select
          v-model="filtros.grupoSanguineo"
          class="border rounded-lg px-3 py-2 w-full text-gray-700 text-center"
        >
          <option value="">Todos los tipos</option>
          <option v-for="grupo in gruposSanguineos" :key="grupo" :value="grupo">
            {{ grupo }}
          </option>
        </select>
      </div>

      <!-- Botón para limpiar filtros -->
      <div class="flex justify-center md:justify-end w-full md:w-auto">
        <button
          @click="limpiarFiltros"
          class="bg-[var(--colorPrimarioButton)] text-white px-4 py-2 text-sm rounded-lg hover:bg-[var(--colorSecundarioButton)] transition"
        >
          Restablecer filtros
        </button>
      </div>

    </div>
  </div>
</template>
