<script lang="ts" setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUsuariosStore } from '@/stores/donantes'

const usuariosStore = useUsuariosStore()
const { usuarios, loading, error } = storeToRefs(usuariosStore)

onMounted(() => {
  usuariosStore.fetchUsuarios()
})
</script>

<template>
  <div class="space-y-4 overflow-y-auto max-h-[600px]">
    <div v-if="loading">Cargando usuarios...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <div
      class="bg-white shadow-md rounded-xl p-4 flex item-center justify-between"
      v-for="donante in usuarios"
      :key="donante.idUsuario"
    >
      <div class="w-full">
        <div class="grid grid-cols-6 place-items-center text-center gap-4">
          <div>
            <p class="text-black font-bold w-10 h-10">Perfil</p>
            <!-- <img :src="donante.imagen" alt="icon" /> -->
          </div>

          <div>
            <p class="text-black font-bold h-12">Nombre</p>
            <p class="text-gray-500">{{ donante.nombresUsuario }} {{ donante.apellidosUsuario }}</p>
          </div>

          <div>
            <p class="text-black font-bold h-12">Ubicacion</p>
            <p class="text-gray-500">{{ donante.ciudadUsuario }} {{ donante.paisUsuario }}</p>
          </div>

          <div :class="donante.correoUsuario.length != 30 ? 'text-sm-' : ''">
            <p class="text-black font-bold h-12">Email</p>
            <p class="text-gray-500">{{ donante.correoUsuario }}</p>
          </div>

          <!-- <div>
            <p class="text-black font-bold h-12">Telefono</p>
            <p class="text-gray-500">{{ donante.telefonoUsuario }}</p>
          </div> -->

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
