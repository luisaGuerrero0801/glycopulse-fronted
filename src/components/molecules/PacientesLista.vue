<template>
  <div>
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 inline-block"></div>
      <p class="mt-2 text-gray-600">Cargando pacientes...</p>
    </div>

    <div v-else>
      <PacienteCard
        v-for="paciente in pacientes"
        :key="paciente.id"
        :paciente="paciente"
        @mostrarGlucometrias="irAGlucometrias"
      />
    </div>
  </div>
</template>


<script setup lang="ts">
import PacienteCard from './PacienteCard.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

defineProps<{
  pacientes: any[]
  loading: boolean
}>()

const router = useRouter()

// Función que redirige a la vista de glucometrías del paciente
const irAGlucometrias = (pacienteId: number) => {
  router.push({ name: 'DoctorGlucometry', params: { id: pacienteId } })
}
</script>
