<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePacientesDoctorStore } from '@/stores/usePacientesDoctorStore'
import PacientesLista from '@/components/molecules/DoctorPacientes.vue'
import NavbarApp from '@/components/molecules/NavbarApp.vue'  // Importamos NavbarApp


const pacientesStore = usePacientesDoctorStore()
const { pacientesFiltrados, loading, error } = storeToRefs(pacientesStore)
const { fetchPacientesDoctor } = pacientesStore

onMounted(() => {
  fetchPacientesDoctor()
})
</script>

<template>
  <div class="grid grid-cols-6 gap-4">
    <div class="col-span-1">
       <NavbarApp :links="[
        { name: 'Pacientes', to: '/doctor/pacientes', icon: 'FolderPlusIcon' },
        { name: 'Glucometrias', to: '/doctor/pacientes', icon: 'UserIcon' },
        { name: 'Recetas', to: '/doctor/recetas/5/crear', icon: 'BeakerIcon' },
        // { name: 'Recetas Saludables', to: '/recetas-saludables', icon: 'BookOpenIcon' },
        // { name: 'Reportes', to: '#', icon: 'ChartBarIcon' }
      ]" />
    </div>
    <div class="p-6 col-start-2 col-span-5">
      <div class="grid w-auto">
        <PacientesLista :pacientes="pacientesFiltrados" :loading="loading" :error="error" />
      </div>
    </div>
  </div>
</template>
