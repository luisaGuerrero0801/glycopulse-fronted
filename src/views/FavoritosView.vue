<template>
  <div class="w-full flex flex-col p-4 bg-gray-100 min-h-screen">
    <!-- Encabezado centrado -->
    <div class="mb-4 flex flex-col items-center text-center">
      <h1 class="text-4xl font-bold flex items-center">🥪 Recetas Saludales</h1>
      <p class="text-gray-600 mt-2">Resumen de información actual</p>

      <RouterLink
        to="/admin/recipe"
        class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition"
      >
        Agregar Favorito
      </RouterLink>
    </div>

    <div class="w-full flex flex-col">
      <Favoritos />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Favoritos from '@/components/molecules/verTodasRecetas.vue'
</script>
