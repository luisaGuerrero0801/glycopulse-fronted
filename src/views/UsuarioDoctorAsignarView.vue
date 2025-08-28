<script setup lang="ts">
import UsuarioDoctorAsignar from '@/components/molecules/Patient/UsuarioDoctorAsignar.vue';
import VistaInicial from '@/components/molecules/NavbarApp.vue'
import HeaderApp from '@/components/molecules/HeaderApp.vue';
</script>



<template>
  <div class="w-full flex">
    <VistaInicial />
    <div class="w-full flex-col">
      <HeaderApp pagename="Asignar Cita" />
     <UsuarioDoctorAsignar />
    </div>
  </div>
</template>