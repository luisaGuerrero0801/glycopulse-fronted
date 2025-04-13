<script setup lang="ts">
defineProps({
  fecha: String,
  hora: String,
  glucosa: Number,
  comentario: String
})
</script>

<template>
    <div class="bg-white p-4 rounded-md shadow space-y-4">
      <div class="flex justify-between">
        <div>
          <p class="text-sm text-gray-500">Fecha Glucometría</p>
          <p class="text-base font-medium">{{ fecha }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Hora</p>
          <p class="text-base font-medium">{{ hora }}</p>
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500">Nivel de Glucosa</p>
        <p class="text-base font-medium">{{ glucosa }} mg/dL</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">Comentario</p>
        <p class="text-base">{{ comentario }}</p>
      </div>
    </div>
  </template>
  
