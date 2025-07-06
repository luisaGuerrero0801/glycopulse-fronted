<template>
  <section>
    <div class="w-full flex justify-between items-center pt-4 pr-40 pb-2 pl-12">
      <div class="grid grid-cols-2 gap-32">
        <div>
          <span class="text-2xl font-normal text-blue-800 border-b-4 border-blue-800 p-2">
            Todas las Recetas
          </span>
        </div>
        <div>
          <span class="text-2xl font-normal text-gray-600"> Populares </span>
        </div>
      </div>
    </div>
    <hr class="border-t-4 border-gray-200 mx-12" />

    <div class="flex flex-col items-center justify-center min-h-[400px] p-5 w-full">
      <template v-if="recetasStore.loading">
        <p class="text-blue-800">Cargando recetas...</p>
      </template>

      <template v-else-if="recetasStore.error">
        <p class="text-red-500">{{ recetasStore.error }}</p>
      </template>

      <template v-else-if="recetasStore.recetas.length">
        <ul class="grid sm:grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <li
            v-for="receta in recetasStore.recetas"
            :key="receta.id"
            class="gap-4 text-blue-800 font-semibold rounded-lg w-52"
          >
            <img
              :src="receta.imagenReceta"
              alt="Imagen de receta"
              class="rounded-xl shadow-md w-60 h-52 object-cover"
            />
            <div class="flex justify-center p-1 gap-2">
              <span class="text-sm">{{ receta.nombreReceta }}</span>
            </div>
          </li>
        </ul>
      </template>

      <template v-else>
        <p class="text-blue-800 font-semibold mb-6">¡No hay recetas registradas!</p>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRecetasStore } from '@/stores/recetasTodas'

const recetasStore = useRecetasStore()

onMounted(async () => {
  await recetasStore.verTodasRecetas()
})
</script>
