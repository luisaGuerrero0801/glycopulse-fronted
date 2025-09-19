<template>
  <div>
    <div v-if="loading" class="text-gray-500">Cargando pacientes...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="pacientes.length === 0" class="text-gray-500">
      No hay pacientes asignados.
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="p in pacientes"
        :key="p.id"
        class="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
      >
        <h3 class="font-semibold text-lg text-blue-900">{{ p.nombre }}</h3>
        <p><strong>Edad:</strong> {{ p.edad }}</p>
        <p><strong>Email:</strong> {{ p.email }}</p>
        <p><strong>Teléfono:</strong> {{ p.telefono }}</p>
        <p><strong>RH:</strong> {{ p.rh }}</p>
        <p><strong>Ubicación:</strong> {{ p.ubicacion }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  pacientes: any[]
  loading: boolean
  error: string
}>()
</script>
