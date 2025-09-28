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
        @mostrarGlucometrias="mostrarGlucometrias"
      />
    </div>
    <GlucometryView
      v-if="pacienteSeleccionadoId"
      :pacienteId="pacienteSeleccionadoId"
    />

  </div>
</template>


<script setup lang="ts">
import PacienteCard from '@/components/molecules/PacienteCard.vue'
import GlucometryView from '@/views/glucometries/GlucometryView.vue';
import { ref } from 'vue'

defineProps<{
  pacientes: any[]
  loading: boolean
}>()

const pacienteSeleccionadoId = ref<number|null>(null)

const mostrarGlucometrias = (pacienteId: number) => {
  pacienteSeleccionadoId.value = pacienteId
}
</script>
