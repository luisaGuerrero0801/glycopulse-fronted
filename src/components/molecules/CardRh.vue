<script lang="ts" setup>
import Paginate from 'vuejs-paginate-next'
import { useUsuariosPagination } from '@/composables/utils/usePagination'
import { onMounted } from 'vue'


const {
  currentPage,
  paginatedUsuarios,
  totalPages,
  goToPage,
  loading,
  error,
  usuariosFiltrados,
  fetchUsuarios
} = useUsuariosPagination()

onMounted(() => {
  fetchUsuarios()
})
</script>

<template>
  <div class="space-y-4 overflow-y-auto max-h-[600px]">
    <div v-if="loading" class="text-center py-4 text-gray-600">Cargando usuarios...</div>
    <div v-else-if="error" class="text-center py-4 text-red-500">{{ error }}</div>
    <div v-else-if="usuariosFiltrados.length === 0" class="text-center py-8 text-gray-500">
      No se encontraron donantes con los filtros aplicados
    </div>

    <template v-else>
      <div
        v-for="donante in paginatedUsuarios"
        :key="donante.idUsuario"
        class="bg-white shadow rounded-xl p-4 flex items-center justify-between"
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

      <!-- Paginación -->
      <div class="flex justify-center mt-6">
        <paginate
          :page-count="totalPages"
          :click-handler="goToPage"
          :prev-text="'Anterior'"
          :next-text="'Siguiente'"
          :container-class="'flex space-x-2'"
          :page-class="'px-3 py-1 border rounded cursor-pointer text-sm text-gray-700 hover:bg-gray-200 transition'"
          :active-class="'bg-indigo-600 text-white border-indigo-600 font-semibold'"
          :prev-class="'px-3 py-1 border rounded cursor-pointer text-sm text-gray-700 hover:bg-gray-200 transition'"
          :next-class="'px-3 py-1 border rounded cursor-pointer text-sm text-gray-700 hover:bg-gray-200 transition'"
        />
      </div>
    </template>
  </div>
</template>
