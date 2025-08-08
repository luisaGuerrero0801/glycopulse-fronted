<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePacientesDoctorStore } from '@/stores/usePacientesDoctorStore'
import PacientesLista from '@/components/molecules/DoctorPacientes.vue'

const pacientesStore = usePacientesDoctorStore()
const {
  pacientesFiltrados,
  loading,
  error
} = storeToRefs(pacientesStore)
const { fetchPacientesDoctor } = pacientesStore

onMounted(() => {
  fetchPacientesDoctor()
})
</script>

<template>
  <div class="p-6">
    <PacientesLista
      :pacientes="pacientesFiltrados"
      :loading="loading"
      :error="error"
    />
  </div>
</template>
