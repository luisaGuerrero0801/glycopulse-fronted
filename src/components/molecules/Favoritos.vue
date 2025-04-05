<template>
  <section>
    <div class="w-full flex justify-between items-center pt-4 pr-40 pb-2 pl-12">
      <div class="grid grid-cols-2 gap-32">
        <div>
          <span class="text-2xl font-normal text-blue-800 border-b-4 border-blue-800 p-2">
            Favoritos
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
        <p>Cargando recetas...</p>
      </template>

      <template v-else-if="recetasStore.error">
        <p class="text-red-500">{{ recetasStore.error }}</p>
      </template>

      <template v-else-if="recetasStore.favoritos.length">
        <ul class="grid sm:grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <li
            v-for="favorito in recetasStore.favoritos"
            :key="favorito.id"
            class="gap-4 text-blue-800 font-semibold rounded-lg w-52"
          >
            <img
              :src="favorito.imagenReceta"
              alt="Imagen de receta"
              class="rounded-xl shadow-md w-60 h-52 object-cover"
            />
            <div class="flex justify-center p-1 gap-2 cursor-pointer">
              <span
                class="material-icons text-red-600"
                @click="recetasStore.toggleFavorito(favorito.id)"
              >
                {{ isFavorito(favorito.id) ? 'favorite' : 'favorite_border' }}
              </span>
              <span class="text-sm">{{ favorito.nombreReceta }}</span>
            </div>
          </li>
        </ul>
      </template>

      <template v-else>
        <p class="text-blue-800 font-semibold mb-6">¡Sin Favoritos!</p>
        <ButtomNew nameButton="Añadir" class="mx-auto" />
      </template>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRecetasStore } from '@/stores/recetasSaludables'
import ButtomNew from '../atoms/ButtomNew.vue'

const recetasStore = useRecetasStore()

// Función para verificar si una receta es favorita
const isFavorito = (id: number) => {
  return recetasStore.favoritos.some((r) => r.id === id)
}

onMounted(async () => {
  await recetasStore.fetchRecetas()
})
</script>
