<script setup lang="ts">
defineProps({
  fecha: String,
  hora: String,
  glucosa: Number,
  comentario: String
})
</script>

<template>
  <div class="bg-white p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl shadow-lg space-y-5 sm:space-y-6 md:space-y-7 lg:space-y-8 w-full max-w-[700px] mx-auto">

    <div class="flex flex-col sm:flex-row justify-between gap-4">
      <div class="flex flex-col">
        <p class="text-sm sm:text-base text-gray-500">Fecha Glucometría</p>
        <p class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">{{ fecha }}</p>
      </div>
      <div class="flex flex-col">
        <p class="text-sm sm:text-base text-gray-500">Hora</p>
        <p class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">{{ hora }}</p>
      </div>
    </div>


    <div>
      <p class="text-sm sm:text-base text-gray-500">Nivel de Glucosa</p>
      <p class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">{{ glucosa }} mg/dL</p>
    </div>

   
    <div>
      <p class="text-sm sm:text-base text-gray-500">Comentario</p>
      <p class="text-base sm:text-lg md:text-xl text-gray-700 break-words">{{ comentario }}</p>
    </div>
  </div>
</template>
