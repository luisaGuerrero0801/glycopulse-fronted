<template>
  <div class="flex min-h-screen overflow-hidden">
    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 bottom-0 w-64 bg-blue-950 text-white p-4 z-10">
       <div class="flex items-center space-x-2 mb-8">
        <img :src="logo" alt="Logo GlycoPulse" class="w-8 h-8 object-contain" />
        <h1 class="text-xl font-bold">GlycoPulse</h1>
      </div>
      <nav class="space-y-4">
        <RouterLink to="/doctor/search" class="block hover:text-blue-200"> Buscar</RouterLink>
        <RouterLink to="/doctor/pacientes" class="block hover:text-blue-200"> Pacientes</RouterLink>
        <RouterLink to="/doctor/glucometria" class="block hover:text-blue-200"> Glucometrias</RouterLink>
        <RouterLink to="/doctor/recetas" class="block hover:text-blue-200">Recetas</RouterLink>
        <RouterLink to="/logout" class="block hover:text-red-300">Cerrar sesión</RouterLink>
      </nav>
    </aside>

    <!-- Main Content -->
<main class="ml-64 flex-1 bg-gray-100 pt-0 px-6 pb-6">
  <slot />
</main>

  </div>
</template>
<script setup lang="ts">
import logo from '@/assets/7.png'
</script>
