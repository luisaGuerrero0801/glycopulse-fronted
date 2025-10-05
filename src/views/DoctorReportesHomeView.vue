<!-- DoctorReportesHomeView.vue -->
<script setup lang="ts">
import { useRoute } from 'vue-router'
import NavbarApp from '@/components/molecules/NavbarApp.vue'

// Importamos el componente del informe de glucosa (ahora el correcto)
import DoctorReportesHome from '@/components/molecules/DoctorReportesHome.vue'

const route = useRoute()
// 👇 obtenemos el id del paciente desde la URL
const pacienteId = Number(route.params.id)
</script>

<template>
  <div class="grid grid-cols-6 gap-4 min-h-screen">
    <!-- Sidebar -->
    <div class="col-span-1">
      <NavbarApp
        :links="[
          { name: 'Pacientes', to: '/doctor/pacientes', icon: 'FolderPlusIcon' },
          // { name: 'Glucometrías', to: `/doctor/pacientes/${pacienteId}/glucosa`, icon: 'UserIcon' },
        //   { name: 'Recetas', to: `/doctor/recetas/${pacienteId}/crear`, icon: 'BeakerIcon' }
        ]"
      />
    </div>

    <!-- Contenido -->
    <div class="p-6 col-start-2 col-span-5">
      <div class="grid w-auto">
        <!-- Aquí mostramos el componente del informe -->
        <DoctorReportesHome :paciente-id="pacienteId" />
      </div>
    </div>
  </div>
</template>
