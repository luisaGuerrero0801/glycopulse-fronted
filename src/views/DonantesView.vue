<script setup lang="ts">
import VistaInicial from '@/components/molecules/NavbarApp.vue'
import DonantesRh from '@/components/molecules/donors/Donantes.vue'
import HeaderApp from '@/components/molecules/HeaderApp.vue'
import LayoutContainer from '../layout/LayoutContainer.vue'
</script>

<template>
  <div class="w-full flex">
    <!-- Sidebar -->
    <VistaInicial />

   
    <div class="w-full flex-col">
      <HeaderApp pagename="Donantes" />
      <LayoutContainer>
        <DonantesRh />
      </LayoutContainer>
    </div>
  </div>
</template>
