<script lang="ts" setup>
import { useUsuariosStore } from '@/stores/donantes'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const usuariosStore = useUsuariosStore()
const { usuariosFiltrados, loading, error } = storeToRefs(usuariosStore)

onMounted(() => {
  usuariosStore.fetchUsuarios()
})
</script>

<template>
  <div class="space-y-4 overflow-y-auto max-h-[600px]">
    <div v-if="loading" class="text-center py-4">Cargando usuarios...</div>
    <div v-else-if="error" class="text-red-500 text-center py-4">{{ error }}</div>
    <div v-else-if="usuariosFiltrados.length === 0" class="text-gray-500 text-center py-8">
      No se encontraron donantes con los filtros aplicados
    </div>

    <div
      v-else
      class="bg-white shadow-md rounded-xl p-4 flex item-center justify-between"
      v-for="donante in usuariosFiltrados"
      :key="donante.idUsuario"
    >
      <div class="w-full">
        <div class="grid grid-cols-6 place-items-center text-center gap-4">
          <div>
            <p class="text-black font-bold w-10 h-10">Perfil</p>
          </div>

          <div>
            <p class="text-black font-bold h-12">Nombre</p>
            <p class="text-gray-500">{{ donante.nombresUsuario }} {{ donante.apellidosUsuario }}</p>
          </div>

          <div>
            <p class="text-black font-bold h-12">Ubicación</p>
            <p class="text-gray-500">{{ donante.ciudadUsuario }}</p>
          </div>

          <div>
            <p class="text-black font-bold h-12">Email</p>
            <p class="text-gray-500">{{ donante.correoUsuario }}</p>
          </div>

          <div>
            <p class="text-black font-bold h-12">RH</p>
            <p class="text-gray-500">{{ donante.rhUsuario }}</p>
          </div>

          <div>
            <span class="material-icons text-gray-600 h-12">help_outline</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
