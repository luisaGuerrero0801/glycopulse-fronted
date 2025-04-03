<script lang="ts" setup>
import { ref } from 'vue';

const searchPaciente = ref('');
const ubicacionSeleccionada = ref('');
const grupoSanguineoSeleccionado = ref('');

const ubicaciones = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla'];
const gruposSanguineos = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
</script>

<template>
  <div class="bg-gray-50 p-4 rounded-xl shadow-md flex justify-between items-center space-x-5 ml-20 mt-6 w-[1400px]">
    
    <div class="flex flex-col w-[32%]">
      <label class="text-gray-500 text-sm mb-1">Paciente</label>
      <div class="relative">
        <input 
          v-model="searchPaciente"
          type="text" 
          placeholder="Buscar paciente"
          class="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-300 text-gray-700"
        />
      </div>
    </div>

    <div class="flex flex-col w-[32%]">
      <label class="text-gray-500 text-sm mb-1">Ubicación</label>
      <select v-model="ubicacionSeleccionada" class="border rounded-lg px-3 py-2 w-full text-gray-700  text-center">
        <option value=""></option>
        <option v-for="ubicacion in ubicaciones" :key="ubicacion" :value="ubicacion">{{ ubicacion }}</option>
      </select>
    </div>

    <div class="flex flex-col w-[32%]">
      <label class="text-gray-500 text-sm mb-1">Grupo Sanguíneo</label>
      <select v-model="grupoSanguineoSeleccionado" class="border rounded-lg px-3 py-2 w-full text-gray-700  text-center">
        <option value=""></option>
        <option v-for="grupo in gruposSanguineos" :key="grupo" :value="grupo">{{ grupo }}</option>
      </select>
    </div>
  </div>
</template>
