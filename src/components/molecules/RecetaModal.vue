<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h2 class="text-2xl font-bold text-blue-800">{{ receta.nombreReceta }}</h2>
          <div class="flex items-center mt-2 text-gray-600">
            <span class="material-icons text-sm mr-1">local_fire_department</span>
            <span class="mr-4">{{ receta.nivelReceta }}</span>
            <span class="material-icons text-sm mr-1">schedule</span>
            <span class="mr-4">{{ receta.tiempoReceta }}</span>
            <span class="material-icons text-sm mr-1">restaurant</span>
            <span>{{ receta.porcionesReceta }} porciones</span>
          </div>
        </div>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <span class="material-icons">close</span>
        </button>
      </div>
      
      <img 
        :src="receta.imagenReceta" 
        alt="Imagen de receta" 
        class="w-full h-72 object-cover rounded-lg mb-6 shadow-md"
      />
      
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-blue-800 mb-2">Descripción</h3>
        <p class="text-gray-700">{{ receta.descripcionReceta || 'Sin descripción' }}</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div>
          <h3 class="text-xl font-semibold text-blue-800 mb-3">Ingredientes</h3>
          <ul class="space-y-2">
            <li 
              v-for="(ingrediente, index) in parsedIngredientes" 
              :key="index"
              class="flex items-start"
            >
              <span class="material-icons text-sm mr-2 mt-1 text-indigo-600">check_circle</span>
              <span>{{ ingrediente }}</span>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-xl font-semibold text-blue-800 mb-3">Preparación</h3>
          <ol class="space-y-4">
            <li 
              v-for="(paso, index) in parsedPreparacion" 
              :key="index"
              class="flex"
            >
              <span class="font-bold text-indigo-600 mr-2">{{ index + 1 }}.</span>
              <span>{{ paso }}</span>
            </li>
          </ol>
        </div>
      </div>
      
      <div v-if="receta.categoriaReceta?.length" class="mb-6">
        <h3 class="text-xl font-semibold text-blue-800 mb-2">Categorías</h3>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="(categoria, index) in receta.categoriaReceta" 
            :key="index"
            class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
          >
            {{ categoria }}
          </span>
        </div>
      </div>
      
      <div class="flex justify-end gap-3 mt-6">
        <button 
          @click="closeModal"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Cerrar
        </button>
        <button 
          @click.stop="toggleFavorito"
          class="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
        >
          <span class="material-icons">
            {{ isFavorito ? 'favorite' : 'favorite_border' }}
          </span>
          {{ isFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRecetasStore } from '@/stores/recetasSaludables'

const props = defineProps({
  receta: {
    type: Object,
    required: true
  },
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const recetasStore = useRecetasStore()

const closeModal = () => {
  emit('close')
}

const isFavorito = computed(() => {
  return recetasStore.favoritos.some(r => r.id === props.receta.id)
})

const toggleFavorito = () => {
  recetasStore.toggleFavorito(props.receta.id)
}

const parsedIngredientes = computed(() => {
  return props.receta.ingredientesReceta?.split('\n').filter(i => i.trim()) || []
})

const parsedPreparacion = computed(() => {
  return props.receta.preparacionReceta?.split('\n').filter(p => p.trim()) || []
})
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
