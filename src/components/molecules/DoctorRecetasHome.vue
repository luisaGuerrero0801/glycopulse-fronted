<!-- DoctorRecetasHomeView.vue -->
<template>
  <HeaderApp pagename="doctor/crear" />
<div class="flex justify-end mt-8">
  <button
    @click="crearReceta"
    class="bg-blue-950 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow"
  >
    Crear receta
  </button>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import iconoUsuario from '@/assets/iconoC.png'
import { useRecetasPacienteStore } from '@/stores/VistaHomeRecetas'
import HeaderApp from './HeaderApp.vue'

const showMenu = ref(false)
const search = ref('')
const router = useRouter()
const route = useRoute()
const pacienteId = Number(route.params.id) || 0
const tab = ref<'ingredientes' | 'preparacion'>('ingredientes')

const ingPagina = ref(0) // página actual en ingredientes
const ingredientesPorPagina = 9

const ingredientesVisibles = computed(() => {
  if (!recetaSeleccionada.value?.ingredientes) return []
  const start = ingPagina.value * ingredientesPorPagina
  return recetaSeleccionada.value.ingredientes.slice(start, start + ingredientesPorPagina)
})

const totalPaginasIngredientes = computed(() => {
  if (!recetaSeleccionada.value?.ingredientes) return 0
  return Math.ceil(recetaSeleccionada.value.ingredientes.length / ingredientesPorPagina)
})

const pasoPagina = ref(0) // página actual de pasos
const pasosPorPagina = 8

const pasosVisibles = computed(() => {
  if (!recetaSeleccionada.value?.pasosPreparacion) return []
  const start = pasoPagina.value * pasosPorPagina
  return recetaSeleccionada.value.pasosPreparacion.slice(start, start + pasosPorPagina)
})

const totalPaginas = computed(() => {
  if (!recetaSeleccionada.value?.pasosPreparacion) return 0
  return Math.ceil(recetaSeleccionada.value.pasosPreparacion.length / pasosPorPagina)
})

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}
const cerrarSesion = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
const crearReceta = () => {
  router.push({ name: 'DoctorRecetaCard', params: { id: pacienteId } })
}

const recetasStore = useRecetasPacienteStore()
const recetaSeleccionada = ref<null | any>(null)

onMounted(() => {
  if (pacienteId) {
    recetasStore.fetchRecetasPaciente(pacienteId)
  }
})
const recetasFiltradas = computed(() =>
  recetasStore.recetas.filter((r) => r.nombre.toLowerCase().includes(search.value.toLowerCase()))
)

const abrirDetalle = (receta: any) => {
  recetaSeleccionada.value = receta
}
const toggleFavorito = (receta: any) => {
  receta.esFavorito = !receta.esFavorito
}
</script>
