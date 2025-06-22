<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center py-12 space-y-8">

    <div class="bg-white rounded-xl shadow-md p-8 w-full max-w-2xl">
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">🍽️ Gestión de Recetas</h1>

      <form @submit.prevent class="space-y-6">
        <div class="flex flex-col items-center">
          <img :src="imagenPreview" alt="Vista previa" class="w-32 h-32 object-cover rounded-full bg-gray-100 mb-4" />
          <input type="file" accept="image/*" @change="handleImagen" class="mb-2" />
          <div class="flex gap-3">
            <button type="button" @click="quitarImagen"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Quitar Imagen</button>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <div>
            <label for="nombreReceta" class="block text-gray-700 font-medium mb-1">Nombre Receta</label>
            <input v-model="nombreReceta" type="text" id="nombreReceta" placeholder="Ej: Ensalada fresca"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
          </div>

          <div>
            <label for="informacion" class="block text-gray-700 font-medium mb-1">Datos de la receta</label>
            <textarea v-model="descripcion" id="informacion" rows="4"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Describe los ingredientes y preparación"></textarea>
          </div>

          <div>
            <button type="button" @click="añadirReceta"
              class="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">Añadir
              Receta</button>
          </div>
        </div>
      </form>
    </div>

    <!-- Listado de Recetas -->
    <div class="w-full max-w-3xl space-y-4">
      <div v-for="(receta, index) in recetasStore.recetas" :key="receta.id"
        class="flex items-center justify-between bg-white rounded-lg shadow-md p-4 hover:bg-gray-50 transition cursor-pointer"
        @click="abrirModal(receta, index)">
        <div class="flex items-center gap-4">
          <img :src="receta.imagenReceta" class="w-14 h-14 rounded-full object-cover" />
          <div>
            <h2 class="font-semibold text-gray-800">{{ receta.nombreReceta }}</h2>
            <p class="text-gray-500 text-sm truncate w-64">{{ receta.descripcion }}</p>
          </div>
        </div>
        <span class="text-blue-600 text-sm">Editar</span>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modalVisible"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Editar Receta</h2>
        <input v-model="recetaSeleccionada.nombreReceta"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Nombre receta" />
        <textarea v-model="recetaSeleccionada.descripcion" rows="4"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Descripción"></textarea>

        <div class="flex flex-col items-center mb-4">
          <img :src="recetaSeleccionada.imagenReceta" alt="Imagen seleccionada"
            class="w-24 h-24 object-cover rounded-full mb-2" />
          <input type="file" accept="image/*" @change="handleImagenModal" />
        </div>

        <div class="flex justify-between">
          <button @click="guardarCambios"
            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">Guardar</button>
          <button @click="eliminarReceta"
            class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">Eliminar</button>
          <button @click="cerrarModal"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRecetasStore } from '@/stores/recetasSaludables'

const recetasStore = useRecetasStore()

const placeholderImagen = 'https://via.placeholder.com/150'
const imagenPreview = ref(placeholderImagen)

const nombreReceta = ref('')
const descripcion = ref('')

const modalVisible = ref(false)
const recetaSeleccionada = ref<any>(null)
const indexSeleccionado = ref<number | null>(null)

onMounted(() => {
  recetasStore.fetchRecetas()
})

function handleImagen(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagenPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function quitarImagen() {
  imagenPreview.value = placeholderImagen
}

async function añadirReceta() {
  if (!nombreReceta.value.trim()) {
    alert('Debes ingresar un nombre de receta')
    return
  }
  try {
    await recetasStore.añadirReceta({
      nombreReceta: nombreReceta.value,
      descripcion: descripcion.value,
      imagenReceta: imagenPreview.value,
    })
    limpiarFormulario()
  } catch (error) {
    alert('Error al añadir receta')
  }
}

function limpiarFormulario() {
  nombreReceta.value = ''
  descripcion.value = ''
  imagenPreview.value = placeholderImagen
}

function abrirModal(receta: any, index: number) {
  recetaSeleccionada.value = { ...receta }
  indexSeleccionado.value = index
  modalVisible.value = true
}

// Manejo imagen modal (editar)
function handleImagenModal(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file && recetaSeleccionada.value) {
    const reader = new FileReader()
    reader.onload = (e) => {
      recetaSeleccionada.value.imagenReceta = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

async function guardarCambios() {
  if (!recetaSeleccionada.value) return
  try {
    await recetasStore.editarReceta(recetaSeleccionada.value)
    modalVisible.value = false
  } catch {
    alert('Error al guardar cambios')
  }
}

async function eliminarReceta() {
  if (!recetaSeleccionada.value) return
  try {
    await recetasStore.eliminarReceta(recetaSeleccionada.value.id)
    modalVisible.value = false
  } catch {
    alert('Error al eliminar receta')
  }
}

function cerrarModal() {
  modalVisible.value = false
  recetaSeleccionada.value = null
  indexSeleccionado.value = null
}
</script>


