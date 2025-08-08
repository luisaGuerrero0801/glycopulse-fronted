<!-- PacientesLista.vue -->
<template>
  <div>
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 inline-block"></div>
      <p class="mt-2 text-gray-600">Cargando pacientes...</p>
    </div>

    <div v-else class="bg-white shadow-md rounded overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-200 text-gray-700">
          <tr>
            <th class="text-left p-4">Nombre</th>
            <th class="text-left p-4">Edad</th>
            <th class="text-left p-4">Email</th>
            <th class="text-left p-4">Teléfono</th>
            <th class="text-left p-4">RH</th>
          </tr>
        </thead>
        <tbody>
          <PacienteCard
            v-for="paciente in pacientes"
            :key="paciente.id"
            :paciente="paciente"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import PacienteCard from '@/components/molecules/PacienteCard.vue'

defineProps<{
  pacientes: any[]
  loading: boolean
}>()
</script>
