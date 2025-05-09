<script lang="ts" setup>
import { storeToRefs } from 'pinia' 
import { useUsuariosStore } from '@/stores/donantes'
const usuariosStore = useUsuariosStore()
const { filtros, ubicacionesUnicas } = storeToRefs(usuariosStore)

const gruposSanguineos = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
</script>

<template>
  <div class="bg-gray-50 p-4 rounded-xl shadow-md flex justify-between items-center space-x-5 ml-20 mt-6 w-[1400px]">
    <!-- Campo de búsqueda -->
    <div class="flex flex-col w-[32%]">
      <label class="text-gray-500 text-sm mb-1">Search</label>
      <div class="relative">
        <input
          v-model="filtros.busqueda"
          type="text"
          placeholder="Buscar paciente"
          class="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-300 text-gray-700"
        />
      </div>
    </div>

    <!-- Selector de ubicación -->
    <div class="flex flex-col w-[32%]">
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
    <div class="flex flex-col w-[32%]">
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
  </div>
</template>
