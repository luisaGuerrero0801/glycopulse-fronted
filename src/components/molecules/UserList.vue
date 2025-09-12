<script lang="ts" setup>
import { useUsuariosStore as useUsuariosGestionStore } from '@/stores/usuarios'
import { storeToRefs } from 'pinia'
import { ref, onMounted, computed } from 'vue'
import EditUsuarioModal from '../molecules/EditUsuarioModal.vue'
import ConfirmationModal from '../molecules/ConfirmationModal.vue'
import { useRouter } from 'vue-router'
import FormDoctorAdmin from '../molecules/FormDoctorAdmin.vue'

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

// 🔹 Modal de Edición
const modalVisible = ref(false)
const usuarioSeleccionado = ref<Usuario | null>(null)

function editarUsuario(usuario: Usuario) {
  usuarioSeleccionado.value = usuario
  modalVisible.value = true
}

async function guardarCambios(usuarioEditado: Usuario) {
  try {
    await usuariosStore.editarUsuario(usuarioEditado)
    modalVisible.value = false
  } catch (err: any) {
    console.error('Error al guardar cambios:', err)
    alert(`Error al guardar cambios: ${err.message}`)
  }
}

// 🔹 Modal de Confirmación
const confirmationVisible = ref(false)
const usuarioAToggle = ref<Usuario | null>(null)

function confirmToggleEstado(usuario: Usuario) {
  usuarioAToggle.value = usuario
  confirmationVisible.value = true
}

function onConfirm() {
  if (usuarioAToggle.value) {
    toggleEstadoUsuario(usuarioAToggle.value)
  }
  confirmationVisible.value = false
  usuarioAToggle.value = null
}

function onCancel() {
  confirmationVisible.value = false
  usuarioAToggle.value = null
}

async function toggleEstadoUsuario(usuario: Usuario) {
  try {
    await usuariosStore.cambiarEstadoUsuario(usuario.idUsuario, !usuario.activo)
  } catch (err) {
    console.error('Error al cambiar estado del usuario:', err)
  }
}

function estadoBotonClass(activo: boolean) {
  return activo
    ? 'text-red-800 hover:text-red-900 bg-red-100 hover:bg-red-200'
    : 'text-green-800 hover:text-green-900 bg-green-100 hover:bg-green-200'
}

// 🔹 Modal de registro (FormDoctorAdmin)
const modalRegistroVisible = ref(false)

// 🔹 Dropdown
const showDropdown = ref(false)
const toggleDropdown = () => { showDropdown.value = !showDropdown.value }

const router = useRouter()
const goToDoctorForm = () => {
  showDropdown.value = false
  modalRegistroVisible.value = true
}

// 🔹 Filtros
const busqueda = ref('')
const filtroRol = ref('Todos')

const rolesDisponibles = ['Todos', 'Paciente', 'Doctor', 'Admin']

const usuariosVisibles = computed(() =>
  usuariosFiltrados.value
    .filter(usuario => usuario.correoUsuario !== 'glycopulse@gmail.com')
    .filter(usuario => {
      const term = busqueda.value.toLowerCase()
      return (
        usuario.nombresUsuario.toLowerCase().includes(term) ||
        usuario.apellidosUsuario.toLowerCase().includes(term) ||
        usuario.correoUsuario.toLowerCase().includes(term)
      )
    })
    .filter(usuario => filtroRol.value === 'Todos' || usuario.rol.nombreRol === filtroRol.value)
)

function getInitial(name: string) {
  if (!name) return ''
  return name.charAt(0).toUpperCase()
}
</script>

---

<template>
  <div class="bg-gray-100 min-h-screen p-4 sm:p-8 text-gray-900">
    <div class="max-w-7xl mx-auto">
      <header class="flex flex-col sm:flex-row justify-between items-center mb-12">
        <div>
          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight flex items-center gap-4 text-black">
            <svg class="w-12 h-12 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
            </svg>
            Gestión de Usuarios
          </h1>
          <p class="text-lg text-black mt-2">
            Administra los usuarios de tu plataforma de forma eficiente y segura.
          </p>
        </div>
        <div class="relative mt-6 sm:mt-0 w-full sm:w-auto">
          <button
            @click="toggleDropdown"
            class="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Añadir
          </button>
          <div
            v-if="showDropdown"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-fade-in"
          >
            <ul class="py-2">
              <li>
                <button
                  @click="goToDoctorForm"
                  class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900 transition-colors"
                >
                  <span class="mr-2">🩺</span> Añadir Doctor
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <div class="bg-white rounded-xl p-4 sm:p-6 mb-8 border border-gray-200">
        <div class="flex flex-col sm:flex-row items-center gap-4">
          <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <input
              v-model="busqueda"
              type="text"
              placeholder="Buscar usuarios..."
              class="w-full pl-10 pr-4 py-2 bg-gray-100 text-gray-900 rounded-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors border border-transparent"
            />
          </div>
          <select
            v-model="filtroRol"
            class="w-full sm:w-48 px-4 py-2 bg-white text-gray-900 rounded-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors border border-gray-300"
          >
            <option value="Todos">Todos</option>
            <option v-for="rol in rolesDisponibles.slice(1)" :key="rol" :value="rol">{{ rol }}</option>
          </select>
        </div>
      </div>

      <div class="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
        <div v-if="loading" class="text-center py-10">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500 border-b-blue-500 border-gray-200"></div>
          <p class="mt-4 text-gray-500 font-medium">Cargando usuarios...</p>
        </div>

        <div v-else-if="error" class="text-center py-10 bg-red-50 bg-opacity-30 border border-red-300 rounded-lg mx-4 my-6">
          <p class="text-red-500 font-semibold">⚠️ Error al cargar los usuarios. Por favor, inténtelo de nuevo.</p>
        </div>

        <div v-else-if="usuariosVisibles.length === 0" class="text-center py-10 bg-gray-100 rounded-lg mx-4 my-6">
          <p class="text-gray-500 font-medium">No se encontraron usuarios que coincidan con los filtros aplicados.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Perfil</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombres</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Apellidos</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Correo</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">RH</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="usuario in usuariosVisibles" :key="usuario.idUsuario" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span class="text-blue-800 font-semibold text-xl">{{ getInitial(usuario.nombresUsuario) }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{{ usuario.nombresUsuario }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{{ usuario.apellidosUsuario }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ usuario.correoUsuario }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-bold rounded-full bg-red-100 text-red-800">{{ usuario.rhUsuario }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-bold rounded-full bg-blue-100 text-blue-800">{{ usuario.rol.nombreRol }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 inline-flex text-xs leading-5 font-bold rounded-full">
                    {{ usuario.activo ? 'Activo' : 'Inhabilitado' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex space-x-2 justify-end">
                    <button @click="editarUsuario(usuario)" class="text-blue-500 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md text-sm transition-colors font-medium">
                      Editar
                    </button>
                    <button @click="confirmToggleEstado(usuario)" :class="estadoBotonClass(usuario.activo)" class="px-3 py-1 rounded-md text-sm transition-colors font-medium">
                      {{ usuario.activo ? 'Inactivar' : 'Reactivar' }}
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

        <ConfirmationModal
          :visible="confirmationVisible"
          :message="`¿Estás seguro de que quieres ${usuarioAToggle?.activo ? 'inactivar' : 'reactivar'} a ${usuarioAToggle?.nombresUsuario}?`"
          @confirm="onConfirm"
          @cancel="onCancel"
        />

        <div
          v-if="modalRegistroVisible"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div class="relative bg-white rounded-xl shadow-lg w-full max-w-3xl p-6">
            <button
              @click="modalRegistroVisible = false"
              class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
            <FormDoctorAdmin />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>