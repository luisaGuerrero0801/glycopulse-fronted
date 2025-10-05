<script setup lang="ts">
// import DoctorLayout from '@/components/molecules/DoctorLayout.vue'
import DoctorRecetasHome from '@/components/molecules/DoctorRecetasHome.vue'
import { useRouter, useRoute } from 'vue-router'
import NavbarApp from '@/components/molecules/NavbarApp.vue' // Importamos NavbarApp

const router = useRouter()
const route = useRoute()

// 👇 aquí obtenemos el id del paciente desde la URL
const pacienteId = Number(route.params.id)

const crearReceta = () => {
  router.push({ name: 'DoctorRecetaCard', params: { id: pacienteId } })
}
</script>


<template>
  <div class="grid grid-cols-6 gap-4">
    <div class="col-span-1">
      <NavbarApp
        :links="[
          { name: 'Pacientes', to: '/doctor/pacientes', icon: 'FolderPlusIcon' },
          // { name: 'Glucometrias', to: '/doctor/#', icon: 'UserIcon' },
          // { name: 'Recetas', to: '/doctor/recetas/5/crear', icon: 'BeakerIcon' }
          // { name: 'Recetas Saludables', to: '/recetas-saludables', icon: 'BookOpenIcon' },
          // { name: 'Reportes', to: '#', icon: 'ChartBarIcon' }
        ]"
      />
    </div>
    <div class="p-6 col-start-2 col-span-5">
      <div class="grid w-auto">
       <DoctorRecetasHome @crear-receta="crearReceta" />
      </div>
    </div>
  </div>
</template>
