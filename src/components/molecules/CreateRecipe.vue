<template>
  <div class="flex min-h-screen items-center justify-center bg-indigo-50 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-lg bg-white shadow-xl rounded-3xl p-6 overflow-auto">
      <h1 class="text-xl font-bold text-gray-700 mb-5 text-center">Crear Receta</h1>

      <div class="space-y-4">
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

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <select
              v-model="form.tiempoReceta"
              class="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="1 minuto">1 minuto</option>
              <option value="5 minutos">5 minutos</option>
              <option value="10 minutos">10 minutos</option>
              <option value="15 minutos">15 minutos</option>
              <option value="30 minutos">30 minutos</option>
              <option value="1 hora">1 hora</option>
              <option value="2 horas">2 horas</option>
              <option value="3 horas">3 horas</option>
              <option value="Más de 3 horas">Más de 3 horas</option>
            </select>
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
          <select
            v-model="form.nivelReceta"
            class="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="Fácil">Fácil</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Difícil">Difícil</option>
          </select>
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
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const recetasStore = useRecetasStore()
const categoriasStore = useCategoriasStore()
const { categorias } = storeToRefs(categoriasStore)
const router = useRouter()

const form = ref({
  nombreReceta: '',
  descripcionReceta: '',
  porcionesReceta: 0,
  tiempoReceta: '1 minuto',
  imagenReceta: '',
  nivelReceta: 'Fácil',
  ingredientesReceta: '',
  preparacionReceta: '',
  categoriaReceta: []
})

const handleSubmit = async () => {
  // Validar si todos los campos están completos
  if (
    !form.value.nombreReceta ||
    !form.value.descripcionReceta ||
    form.value.porcionesReceta <= 0 ||
    !form.value.imagenReceta ||
    !form.value.ingredientesReceta ||
    !form.value.preparacionReceta ||
    form.value.categoriaReceta.length === 0
  ) {
    toast.error("Por favor, complete todos los campos obligatorios.")
    return
  }

  // Enviar receta a la tienda
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

  // Limpiar el formulario después de enviar
  form.value = {
    nombreReceta: '',
    descripcionReceta: '',
    porcionesReceta: 0,
    tiempoReceta: '1 minuto',
    imagenReceta: '',
    nivelReceta: 'Fácil',
    ingredientesReceta: '',
    preparacionReceta: '',
    categoriaReceta: []
  }

  // Mostrar mensaje de éxito
  toast.success("Receta creada con éxito.")

  // Redirigir a la página de administración
  router.push({ name: 'AdminFav' })
}

onMounted(() => {
  categoriasStore.cargarCategorias()
})
</script>
