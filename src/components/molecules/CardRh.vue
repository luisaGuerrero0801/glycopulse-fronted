<script lang="ts" setup>
import { ref, onMounted, computed, defineEmits } from 'vue'
import Paginate from 'vuejs-paginate-next'
import { useUsuariosPagination } from '@/composables/utils/usePagination'

const emits = defineEmits(['donante-seleccionado'])

const {
  paginatedUsuarios: todosLosUsuarios,
  currentPage,
  totalPages,
  goToPage,
  loading,
  error,
  fetchUsuarios
} = useUsuariosPagination()

const idRolDeseado = 1
const idUsuarioActual = ref<number | null>(null)

onMounted(() => {
  try {
    const storedId = sessionStorage.getItem('idUsuario')
    if (storedId) {
      idUsuarioActual.value = Number(storedId)
      console.log('ID del usuario actual obtenido de sessionStorage:', idUsuarioActual.value)
    } else {
      console.log('No se encontró el ID del usuario en sessionStorage.')
    }
  } catch (e) {
    console.error('Error al obtener el ID del usuario de sessionStorage:', e)
  }
  fetchUsuarios()
})

const donantesFiltrados = computed(() => {
  if (idUsuarioActual.value !== null) {
    return todosLosUsuarios.value.filter(
      (d: any) => d.rol?.idRol === idRolDeseado && d.idUsuario !== idUsuarioActual.value
    )
  }
  return todosLosUsuarios.value.filter((d: any) => d.rol?.idRol === idRolDeseado)
})

const seleccionarDonante = (donante: any) => {
  emits('donante-seleccionado', donante)
}
</script>

<template>
  <div class="space-y-4 overflow-y-auto max-h-[600px] px-2 sm:px-4 lg:px-6">
    <div v-if="loading" class="text-center py-4 text-gray-600">Cargando usuarios...</div>
    <div v-else-if="error" class="text-center py-4 text-red-500">{{ error }}</div>
    <div v-else-if="donantesFiltrados.length === 0" class="text-center py-8 text-gray-500">
      No se encontraron donantes con el rol seleccionado
    </div>

    <template v-else>
      <div
        v-for="donante in donantesFiltrados"
        :key="donante.idUsuario"
        @click="seleccionarDonante(donante)"
        class="bg-white shadow rounded-xl p-4 sm:p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between cursor-pointer w-full transition hover:bg-gray-50"
      >
        <div
          class="grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-4 items-center w-full text-center sm:text-left"
        >
          <div class="flex flex-col items-center sm:items-start">
            <div
              class="bg-[#D4E1FC] text-indigo-800 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold mb-3 shadow-lg"
            >
              <p class="text-black font-bold">{{ donante.nombresUsuario.charAt(0) }}</p>
            </div>
          </div>
          <div class="flex flex-col items-center sm:items-start">
            <p class="text-black font-bold">Nombre</p>
            <p class="text-gray-500 text-sm sm:text-base">
              {{ donante.nombresUsuario }} {{ donante.apellidosUsuario }}
            </p>
          </div>
          <div class="flex flex-col items-center sm:items-start">
            <p class="text-black font-bold">Ubicación</p>
            <p class="text-gray-500 text-sm sm:text-base">{{ donante.ciudadUsuario }}</p>
          </div>
          <div class="flex flex-col items-center sm:items-start">
            <p class="text-black font-bold">Email</p>
            <p class="text-gray-500 text-sm sm:text-base">{{ donante.correoUsuario }}</p>
          </div>
          <div class="flex flex-col items-center sm:items-start">
            <p class="text-black font-bold">RH</p>
            <p class="text-gray-500 text-sm sm:text-base">{{ donante.rhUsuario }}</p>
          </div>
          <div class="flex justify-center sm:justify-end">
            <span class="material-icons text-gray-600">help_outline</span>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-6">
        <paginate
          :page-count="totalPages"
          :click-handler="goToPage"
          :prev-text="'Anterior'"
          :next-text="'Siguiente'"
          :container-class="'flex flex-wrap justify-center gap-2'"
          :page-class="'px-4 py-2 border rounded cursor-pointer text-sm text-gray-700 hover:bg-[var(--colorSecundarioButton)] transition'"
          :active-class="'bg-[var(--colorPrimarioButton)] text-[var(--colorBlanco)] font-semibold'"
          :prev-class="'px-4 py-2 border rounded cursor-pointer text-sm text-gray-700 hover:bg-gray-200 transition'"
          :next-class="'px-4 py-2 border rounded cursor-pointer text-sm text-gray-700 hover:bg-gray-200 transition'"
        />
      </div>
    </template>
  </div>
</template>
