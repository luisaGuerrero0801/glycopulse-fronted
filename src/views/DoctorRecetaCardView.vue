<!-- DoctorRecetaCardView.vue -->
<script setup lang="ts">
import DoctorLayout from '@/components/molecules/DoctorLayout.vue'
import DoctorRecetaCard from '@/components/molecules/DoctorRecetaCard.vue'
import HeaderApp from '@/components/molecules/HeaderApp.vue';

import NavbarApp from '@/components/molecules/NavbarApp.vue'  // Importamos NavbarApp

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
      <DoctorRecetaCard />
      </div>
    </div>
  </div>
</template>
