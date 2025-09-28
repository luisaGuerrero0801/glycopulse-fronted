<!-- DoctorRecetaCardView.vue -->
<script setup lang="ts">
import DoctorLayout from '@/components/molecules/DoctorLayout.vue'
import DoctorRecetaCard from '@/components/molecules/DoctorRecetaCard.vue'
import { TableCellsIcon, UserIcon, FolderIcon } from '@heroicons/vue/20/solid';
import NavbarApp from '@/components/molecules/NavbarApp.vue'  // Importamos NavbarApp

</script>



<template>
 
  <div class="grid grid-cols-6 gap-4">
    <div class="col-span-1">
       <NavbarApp :links="[
     { name: 'Pacientes', to: '/doctor/pacientes', icon: UserIcon},
        { name: 'Glucometrias', to: '/doctor/pacientes', icon:  FolderIcon },
        { name: 'Recetas', to: '/doctor/recetas/5/crear', icon: TableCellsIcon },
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
