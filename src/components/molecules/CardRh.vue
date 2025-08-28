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
    // **CAMBIO CLAVE: sessionStorage 'idUsuario'**
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
  // Filtra por rol y excluye al usuario actual si el ID está disponible
  if (idUsuarioActual.value !== null) {
    return todosLosUsuarios.value.filter(
      (d: any) => d.rol?.idRol === idRolDeseado && d.idUsuario !== idUsuarioActual.value
    )
  }
  // Si no tenemos el ID del usuario actual, solo filtramos por rol
  return todosLosUsuarios.value.filter((d: any) => d.rol?.idRol === idRolDeseado)
})

const seleccionarDonante = (donante: any) => {
  emits('donante-seleccionado', donante)
}
</script>

<template>
  <div class="space-y-4 overflow-y-auto max-h-[600px]">
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
        class="bg-white shadow rounded-xl p-4 flex items-center justify-between cursor-pointer"
      >
        <div class="w-full">
          <div class="grid grid-cols-6 items-center text-center gap-4">
            <div><p class="text-black font-bold">Perfil</p></div>
            <div>
              <p class="text-black font-bold">Nombre</p>
              <p class="text-gray-500">
                {{ donante.nombresUsuario }} {{ donante.apellidosUsuario }}
              </p>
            </div>
            <div>
              <p class="text-black font-bold">Ubicación</p>
              <p class="text-gray-500">{{ donante.ciudadUsuario }}</p>
            </div>
            <div>
              <p class="text-black font-bold">Email</p>
              <p class="text-gray-500">{{ donante.correoUsuario }}</p>
            </div>
            <div>
              <p class="text-black font-bold">RH</p>
              <p class="text-gray-500">{{ donante.rhUsuario }}</p>
            </div>
            <div><span class="material-icons text-gray-600">help_outline</span></div>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-6">
        <paginate
          :page-count="totalPages"
          :click-handler="goToPage"
          :prev-text="'Anterior'"
          :next-text="'Siguiente'"
          :container-class="'flex space-x-2'"
          :page-class="'px-4 py-2 border rounded cursor-pointer text-sm text-gray-700 hover:bg-[var(--colorSecundarioButton)] transition'"
          :active-class="'bg-[var(--colorPrimarioButton)] text-[var(--colorBlanco)] font-semibold'"
          :prev-class="'px-4 py-2 border rounded cursor-pointer text-sm text-gray-700 hover:bg-gray-200 transition'"
          :next-class="'px-4 py-2 border rounded cursor-pointer text-sm text-gray-700 hover:bg-gray-200 transition'"
        />
      </div>
    </template>
  </div>
</template>
