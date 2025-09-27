<script setup lang="ts">
import DoctorLayout from '@/components/molecules/DoctorLayout.vue'
import DoctorRecetasHome from '@/components/molecules/DoctorRecetasHome.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 👇 aquí obtenemos el id del paciente desde la URL
const pacienteId = Number(route.params.id)

const crearReceta = () => {
  router.push({ name: 'DoctorRecetaCard', params: { id: pacienteId } })
}
</script>

<template>
  <div class="w-full flex">
    <DoctorLayout />
    <div class="w-full flex flex-col relative bg-gray-50 p-6">
      <DoctorRecetasHome @crear-receta="crearReceta" />
    </div>
  </div>
</template>
