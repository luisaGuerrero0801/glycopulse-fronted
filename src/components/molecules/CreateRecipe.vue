<template>
  <div class="flex min-h-screen items-center justify-center bg-indigo-50">
    <div class="w-full max-w-3xl bg-white shadow-xl rounded-3xl p-8">
      <h1 class="text-2xl font-bold text-gray-700 mb-6 text-center">Crear Receta</h1>

      <div class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la Receta</label>
          <input
            type="text"
            v-model="form.nombreReceta"
            class="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            v-model="form.descripcionReceta"
            class="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Porciones</label>
            <input
              type="number"
              v-model.number="form.porcionesReceta"
              class="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tiempo</label>
            <input
              type="text"
              v-model="form.tiempoReceta"
              class="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Imagen URL</label>
          <input
            type="text"
            v-model="form.imagenReceta"
            class="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
          <input
            type="text"
            v-model="form.nivelReceta"
            class="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ingredientes</label>
          <textarea
            v-model="form.ingredientesReceta"
            class="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Preparación</label>
          <textarea
            v-model="form.preparacionReceta"
            class="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          ></textarea>
        </div>

        <!-- ✅ NUEVO MULTISELECT -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Categorías</label>
          <Multiselect
            v-model="form.categoriaReceta"
            :options="categorias"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            placeholder="Seleccione una o más categorías"
            label="nombreCategoria"
            track-by="id"
            class="w-full"
          />
        </div>

        <div class="text-right">
          <button
            @click="handleSubmit"
            class="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRecetasStore } from '@/stores/recetasTodas'
import { useCategoriasStore } from '@/stores/categoriasStore'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import type { receta, Categoria } from '@/types/recetas'
import { useRouter } from 'vue-router'

const recetasStore = useRecetasStore()
const categoriasStore = useCategoriasStore()
const { categorias } = storeToRefs(categoriasStore)
const router = useRouter()

const form = ref<receta>({
  nombreReceta: '',
  descripcionReceta: '',
  porcionesReceta: 0,
  tiempoReceta: '',
  imagenReceta: '',
  nivelReceta: '',
  ingredientesReceta: '',
  preparacionReceta: '',
  categoriaReceta: []
})

const handleSubmit = async () => {
  await recetasStore.crearReceta({
    nombreReceta: form.value.nombreReceta,
    descripcionReceta: form.value.descripcionReceta,
    porcionesReceta: form.value.porcionesReceta,
    tiempoReceta: form.value.tiempoReceta,
    imagenReceta: form.value.imagenReceta,
    nivelReceta: form.value.nivelReceta,
    ingredientesReceta: form.value.ingredientesReceta,
    preparacionReceta: form.value.preparacionReceta,
    categoriaReceta: form.value.categoriaReceta.map(c => c.nombreCategoria)
  })

  form.value = {
    nombreReceta: '',
    descripcionReceta: '',
    porcionesReceta: 0,
    tiempoReceta: '',
    imagenReceta: '',
    nivelReceta: '',
    ingredientesReceta: '',
    preparacionReceta: '',
    categoriaReceta: []
  }

  router.push({ name: 'AdminFav' })
}

onMounted(() => {
  categoriasStore.cargarCategorias()
})
</script>
