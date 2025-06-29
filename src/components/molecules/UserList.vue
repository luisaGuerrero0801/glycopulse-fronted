<script lang="ts" setup>
import { useUsuariosStore as useUsuariosGestionStore } from '@/stores/usuarios'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import EditUsuarioModal from '../molecules/EditUsuarioModal.vue'

interface Usuario {
  idUsuario: number
  nombresUsuario: string
  apellidosUsuario: string
  correoUsuario: string
  rhUsuario: string
  activo: boolean
  rol: {
    nombreRol: string
  }
}

const usuariosStore = useUsuariosGestionStore()
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
  <div class="flex justify-center items-center flex-col py-8 bg-white rounded-t-xl shadow-sm">
    <h1 class="text-4xl font-bold text-gray-800">👥 Gestión de Usuarios</h1>
    <p class="text-gray-600 mt-2">Administra los usuarios del sistema</p>
  </div>
  <div class="bg-white rounded-xl shadow-md p-6">
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <p class="mt-2 text-gray-600">Cargando usuarios...</p>
    </div>

    <div v-else-if="error" class="text-center py-8 bg-red-50 rounded-lg">
      <p class="text-red-500 font-medium">⚠️ {{ error }}</p>
    </div>

    <div v-else-if="usuariosFiltrados.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
      <p class="text-gray-500">No se encontraron usuarios con los filtros aplicados</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfil</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombres</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellidos</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RH</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="donante in usuariosFiltrados" :key="donante.idUsuario" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span class="text-blue-600 text-lg">👤</span>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ donante.nombresUsuario }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ donante.apellidosUsuario }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ donante.correoUsuario }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{{ donante.rhUsuario }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">{{ donante.rol.nombreRol }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="donante.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ donante.activo ? 'Activo' : 'Inhabilitado' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex space-x-2 justify-end">
                <button @click="editarUsuario(donante)" class="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md text-sm transition-colors">Editar</button>
                <button @click="toggleEstadoUsuario(donante)"
                        :class="donante.activo ? 'text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100' : 'text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100'"
                        class="px-3 py-1 rounded-md text-sm transition-colors">
                  {{ donante.activo ? 'Inactivar' : 'Reactivar' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <EditUsuarioModal
      :visible="modalVisible"
      :usuario="usuarioSeleccionado"
      @close="modalVisible = false"
      @save="guardarCambios"
    />
  </div>
</template>
