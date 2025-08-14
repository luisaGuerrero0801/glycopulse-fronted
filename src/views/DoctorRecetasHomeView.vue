<script setup lang="ts">
import DoctorLayout from '@/components/molecules/DoctorLayout.vue'
import DoctorRecetasHome from '@/components/molecules/DoctorRecetasHome.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const irACrearReceta = () => {
  router.push({ name: 'DoctorRecetaCard' })
}
</script>

<template>
  <div class="w-full flex">
    <DoctorLayout />
    <div class="w-full flex flex-col relative bg-gray-50 p-6">
      <DoctorRecetasHome @crear-receta="irACrearReceta" />
    </div>
  </div>
</template>
