<template>
  <section class="w-full">
    <!-- Encabezado -->
    <div class="flex flex-col sm:flex-row justify-center items-center gap-12 pt-4 pb-2 px-4">
      <span class="text-2xl font-normal text-blue-800 border-b-4 border-blue-800 p-2">
        Favoritos
      </span>
      <span class="text-2xl font-normal text-gray-600">Recetas Completas</span>
    </div>
    <hr class="border-t-4 border-gray-200 mx-4 md:mx-12" />

    <!-- Contenido principal -->
    <div class="flex flex-col items-center justify-center min-h-[400px] p-5 w-full">
      <template v-if="loadingFavoritos">
        <p>Cargando favoritos...</p>
      </template>
      <template v-else-if="errorFavoritos">
        <p class="text-red-500">{{ errorFavoritos }}</p>
      </template>
      <template v-else-if="paginatedFavoritos.length">
        <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-[1200px]">
          <li
            v-for="favorito in paginatedFavoritos"
            :key="favorito.id"
            class="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
            @click="openModal(favorito)"
          >
            <div class="overflow-hidden h-48 w-full">
              <img
                :src="favorito.imagenReceta"
                alt="Imagen de receta"
                class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div class="p-3">
              <div class="flex justify-between items-start">
                <h3 class="text-base font-bold text-blue-800">{{ favorito.nombreReceta }}</h3>
                <span
                  class="material-icons text-red-600 cursor-pointer"
                  @click.stop="recetasStore.toggleFavorito(favorito.id)"
                >
                  {{ isFavorito(favorito.id) ? 'favorite' : 'favorite_border' }}
                </span>
              </div>
              <div class="flex items-center mt-1 text-xs text-gray-600">
                <span class="material-icons text-sm mr-1">schedule</span>
                <span>{{ favorito.tiempoReceta }}</span>
              </div>
              <div class="flex items-center mt-1 text-xs text-gray-600">
                <span class="material-icons text-sm mr-1">restaurant</span>
                <span>{{ favorito.porcionesReceta }} porciones</span>
              </div>
            </div>
          </li>
        </ul>

        <RecetaModal
          v-if="selectedReceta"
          :receta="selectedReceta"
          :is-open="isModalOpen"
          @close="closeModal"
        />

        <div class="flex justify-center mt-6">
          <Paginate
            :page-count="favTotalPages"
            :click-handler="goToFavPage"
            :prev-text="'Anterior'"
            :next-text="'Siguiente'"
            :container-class="'flex space-x-2 flex-wrap justify-center'"
            :page-class="'px-4 py-2 border rounded cursor-pointer text-sm text-gray-700 hover:bg-[var(--colorSecundarioButton)] transition'"
            :active-class="'bg-[var(--colorPrimarioButton)] text-[var(--colorBlanco)] font-semibold'"
            :prev-class="'px-4 py-2 border rounded cursor-pointer text-sm text-gray-700 hover:bg-gray-200 transition'"
            :next-class="'px-4 py-2 border rounded cursor-pointer text-sm text-gray-700 hover:bg-gray-200 transition'"
          />
        </div>
      </template>

      <template v-else>
        <p class="text-blue-800 font-semibold mb-6">¡Sin Favoritos!</p>
        <ButtomNew nameButton="Añadir" class="mx-auto" />
      </template>
    </div>

    <hr class="border-t-2 border-gray-300 w-full my-8" />
  </section>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRecetasStore } from '@/stores/recetasSaludables'
import ButtomNew from '../atoms/ButtomNew.vue'
import Paginate from 'vuejs-paginate-next'
import { useUsuariosPagination } from '@/composables/utils/usePagination'
import RecetaModal from './RecetaModal.vue'

const recetasStore = useRecetasStore()

const pagFavoritos = computed(() => recetasStore.favoritos)

const {
  currentPage: favPage,
  paginatedUsuarios: paginatedFavoritos,
  totalPages: favTotalPages,
  goToPage: goToFavPage,
  loading: loadingFavoritos,
  error: errorFavoritos
} = useUsuariosPagination(8, pagFavoritos)

const selectedReceta = ref(null)
const isModalOpen = ref(false)

const isFavorito = (id: number) => {
  return recetasStore.favoritos.some((r) => r.id === id)
}

const openModal = (receta) => {
  selectedReceta.value = receta
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedReceta.value = null
}

onMounted(async () => {
  await recetasStore.fetchRecetas()
})
</script>
