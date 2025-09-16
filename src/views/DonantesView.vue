<script setup lang="ts">
import VistaInicial from '@/components/molecules/NavbarApp.vue'
import DonantesRh from '@/components/molecules/donors/Donantes.vue'
import HeaderApp from '@/components/molecules/HeaderApp.vue';
</script>

<template>
  <div class="w-full flex">
    <VistaInicial />
    <div class="w-full flex-col">
      <HeaderApp pagename="Donantes" />
      <DonantesRh />
    </div>
  </div>
</template>
