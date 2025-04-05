<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import VistaInicial from '@/components/molecules/NavbarApp.vue'
import HeaderApp from '@/components/molecules/HeaderApp.vue'
import VerGlucometrias from '@/components/molecules/VerGlucometrias.vue'
import Favoritos from '@/components/molecules/favoritos.vue'
</script>

<template>
  <div class="w-full flex">
    <VistaInicial />
    <div class="w-full flex-col">
      <HeaderApp pagename="Glucometria" />
      <VerGlucometrias />
    </div>
  
  </div>
</template>
