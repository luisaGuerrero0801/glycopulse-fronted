<script lang="ts" setup>
import { useUsuariosStore } from '@/stores/usuarios'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import ButtomNew from '../atoms/ButtomNew.vue'
import EditUsuarioModal from '../molecules/EditUsuarioModal.vue'

interface Usuario {
  idUsuario: number
  nombresUsuario: string
  apellidosUsuario: string
  correoUsuario: string
  rhUsuario: string
  activo: boolean
}

const usuariosStore = useUsuariosStore()
const { usuariosFiltrados, loading, error } = storeToRefs(usuariosStore)

onMounted(() => {
  usuariosStore.fetchUsuarios()
})

const modalVisible = ref(false)
const usuarioSeleccionado = ref<Usuario | null>(null)

function editarUsuario(donante: Usuario) {
  usuarioSeleccionado.value = donante
  modalVisible.value = true
}

async function guardarCambios(usuarioEditado: Usuario) {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/usuarios/${usuarioEditado.idUsuario}`, {
      method: 'PUT',
      body: JSON.stringify(usuarioEditado),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error al guardar los cambios: ${response.statusText}`)
    }

 
    await usuariosStore.fetchUsuarios()  
    modalVisible.value = false
  } catch (err) {
    console.error('Error al guardar cambios:', err)
    alert(`Error al guardar cambios: ${err.message}`)
  }
}

async function toggleEstadoUsuario(donante: Usuario) {
  try {
    await usuariosStore.cambiarEstadoUsuario(donante.idUsuario, !donante.activo)
    await usuariosStore.fetchUsuarios()
  } catch (err) {
    console.error('Error al cambiar estado del usuario:', err)
  }
}
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
      v-for="donante in usuariosFiltrados"
      :key="donante.idUsuario"
      class="bg-white shadow-md rounded-xl p-4 flex items-center justify-between"
    >
      <div class="w-full">
        <div class="grid grid-cols-6 place-items-center text-center gap-4">
          <div>
            <p class="text-black font-bold w-10 h-10">Perfil</p>
          </div>

          <div>
            <p class="text-black font-bold h-12">Nombres</p>
            <p class="text-gray-500">{{ donante.nombresUsuario }}</p>
          </div>

          <div>
            <p class="text-black font-bold h-12">Apellidos</p>
            <p class="text-gray-500">{{ donante.apellidosUsuario }}</p>
          </div>

          <div>
            <p class="text-black font-bold h-12">Correo</p>
            <p class="text-gray-500">{{ donante.correoUsuario }}</p>
          </div>

          <div>
            <p class="text-black font-bold h-12">RH</p>
            <p class="text-gray-500">{{ donante.rhUsuario }}</p>
          </div>

          <div class="space-y-1">
            <div class="flex flex-col space-y-1 mt-2">
              <button
                @click="editarUsuario(donante)"
                class="bg-blue-500 text-white px-3 py-1 rounded"
                aria-label="Editar usuario"
              >
                Editar
              </button>

              <button
                @click="toggleEstadoUsuario(donante)"
                :class="donante.activo ? 'bg-red-500' : 'bg-green-500'"
                class="text-white px-3 py-1 rounded"
                :aria-label="donante.activo ? 'Inactivar usuario' : 'Reactivar usuario'"
              >
                {{ donante.activo ? 'Inactivar' : 'Reactivar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EditUsuarioModal
      :visible="modalVisible"
      :usuario="usuarioSeleccionado"
      @close="modalVisible = false"
      @save="guardarCambios"
    />
  </div>
</template>
