<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUsuariosStore } from '@/stores/usuarios'
import EditUsuarioModal from '../molecules/EditUsuarioModal.vue'
import ConfirmationModal from '../molecules/ConfirmationModal.vue'
import FormDoctorAdmin from '../molecules/FormDoctorAdmin.vue'

interface Usuario {
  idUsuario: number
  nombresUsuario: string
  apellidosUsuario: string
  correoUsuario: string
  rhUsuario: string
  activo: boolean
  rol: { nombreRol: string }
}

const usuariosStore = useUsuariosStore()
const { usuariosFiltrados, loading, error } = storeToRefs(usuariosStore)
onMounted(() => usuariosStore.fetchUsuarios())

const modales = ref({ editar: false, confirmar: false, registro: false })
const dropdownVisible = ref(false)
const usuarioSeleccionado = ref<Usuario | null>(null)
const usuarioAToggle = ref<Usuario | null>(null)

const busqueda = ref('')
const filtroRol = ref('Todos')
const rolesDisponibles = ['Todos', 'Paciente', 'Doctor', 'Admin']

const usuariosVisibles = computed(() =>
  usuariosFiltrados.value
    .filter(u => u.correoUsuario !== 'glycopulse@gmail.com')
    .filter(u =>
      [u.nombresUsuario, u.apellidosUsuario, u.correoUsuario]
        .some(f => f.toLowerCase().includes(busqueda.value.toLowerCase()))
    )
    .filter(u => filtroRol.value === 'Todos' || u.rol.nombreRol === filtroRol.value)
)

const getInitial = (name: string) => name?.[0].toUpperCase() || ''

const editarUsuario = (usuario: Usuario) => {
  usuarioSeleccionado.value = usuario
  modales.value.editar = true
}

const guardarCambios = async (usuarioEditado: Usuario) => {
  try {
    await usuariosStore.editarUsuario(usuarioEditado)
    modales.value.editar = false
  } catch (e: any) {
    alert(`Error: ${e.message}`)
  }
}

const confirmToggleEstado = (usuario: Usuario) => {
  usuarioAToggle.value = usuario
  modales.value.confirmar = true
}

const onConfirm = async () => {
  if (!usuarioAToggle.value) return
  try {
    await usuariosStore.cambiarEstadoUsuario(usuarioAToggle.value.idUsuario, !usuarioAToggle.value.activo)
  } finally {
    modales.value.confirmar = false
    usuarioAToggle.value = null
  }
}

const estadoBotonClass = (activo: boolean) =>
  activo
    ? 'text-red-800 hover:text-red-900 bg-red-100 hover:bg-red-200'
    : 'text-green-800 hover:text-green-900 bg-green-100 hover:bg-green-200'

const toggleDropdown = () => (dropdownVisible.value = !dropdownVisible.value)
const abrirRegistro = () => {
  dropdownVisible.value = false
  modales.value.registro = true
}
</script>

<template>
  <div class="bg-gray-100 min-h-screen p-6 sm:p-10 text-gray-900">
    <div class="max-w-7xl mx-auto">
      <!-- Header + Añadir -->
      <header class="flex flex-col items-center py-10 text-center">
        <h1 class="text-7xl font-bold">Gestión de Usuarios</h1>
        <p class="text-gray-600 mt-3 text-2xl">Gestiona usuarios de forma fácil y segura.</p>

        <div class="mt-8 relative">
          <button @click="toggleDropdown" class="px-7 py-4 bg-blue-600 text-white font-semibold rounded-lg flex items-center gap-3 hover:bg-blue-700 transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            Añadir
          </button>
          <ul v-if="dropdownVisible" class="absolute mt-2 w-52 bg-white rounded-lg shadow-xl border z-50 animate-fade-in">
            <li><button @click="abrirRegistro" class="block w-full text-left px-5 py-3 hover:bg-gray-100 text-lg">🩺 Añadir Doctor</button></li>
          </ul>
        </div>
      </header>

      <!-- Filtros -->
      <div class="bg-white rounded-xl p-6 sm:p-8 mb-10 border flex flex-col sm:flex-row items-center gap-6">
        <div class="relative w-full">
          <input v-model="busqueda" placeholder="Buscar usuarios..." class="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 text-gray-900 text-lg focus:ring-2 focus:ring-blue-400 border border-transparent"/>
          <svg class="absolute left-4 top-3 w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
          </svg>
        </div>
        <select v-model="filtroRol" class="w-full sm:w-52 px-5 py-3 rounded-full bg-white border border-gray-300 text-lg focus:ring-2 focus:ring-blue-400">
          <option v-for="rol in rolesDisponibles" :key="rol" :value="rol">{{ rol }}</option>
        </select>
      </div>

      <!-- Tabla -->
      <div class="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-14 w-14 border-4 border-t-blue-500 border-b-blue-500 border-gray-200"></div>
          <p class="mt-5 text-gray-500 text-lg">Cargando usuarios...</p>
        </div>

        <div v-else-if="error" class="text-center py-12 bg-red-50 border border-red-300 rounded-lg mx-4 my-6">
          <p class="text-red-500 font-semibold text-lg">⚠️ Error al cargar los usuarios.</p>
        </div>

        <div v-else-if="usuariosVisibles.length === 0" class="text-center py-12 bg-gray-100 rounded-lg mx-4 my-6">
          <p class="text-gray-500 font-medium text-lg">No se encontraron usuarios.</p>
        </div>

        <table v-else class="min-w-full divide-y divide-gray-200 overflow-x-auto text-lg">
          <thead class="bg-gray-50 text-base">
            <tr>
              <th class="px-6 py-4 text-left font-semibold text-gray-500 uppercase tracking-wider">Perfil</th>
              <th class="px-6 py-4 text-left font-semibold text-gray-500 uppercase tracking-wider">Nombres</th>
              <th class="px-6 py-4 text-left font-semibold text-gray-500 uppercase tracking-wider">Apellidos</th>
              <th class="px-6 py-4 text-left font-semibold text-gray-500 uppercase tracking-wider">Correo</th>
              <th class="px-6 py-4 text-left font-semibold text-gray-500 uppercase tracking-wider">RH</th>
              <th class="px-6 py-4 text-left font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
              <th class="px-6 py-4 text-left font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-4 text-right font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="usuario in usuariosVisibles" :key="usuario.idUsuario" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-800 font-semibold text-2xl">
                  {{ getInitial(usuario.nombresUsuario) }}
                </div>
              </td>
              <td class="px-6 py-4 font-medium text-gray-900">{{ usuario.nombresUsuario }}</td>
              <td class="px-6 py-4 font-medium text-gray-900">{{ usuario.apellidosUsuario }}</td>
              <td class="px-6 py-4 text-gray-700">{{ usuario.correoUsuario }}</td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 inline-flex text-sm font-bold rounded-full bg-red-100 text-red-800">{{ usuario.rhUsuario }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 inline-flex text-sm font-bold rounded-full bg-blue-100 text-blue-800">{{ usuario.rol.nombreRol }}</span>
              </td>
              <td class="px-6 py-4">
                <span :class="usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-3 py-1 inline-flex text-sm font-bold rounded-full">
                  {{ usuario.activo ? 'Activo' : 'Inhabilitado' }}
                </span>
              </td>
              <td class="px-6 py-4 flex justify-end gap-3">
                <button @click="editarUsuario(usuario)" class="text-blue-600 hover:text-blue-800 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-md font-medium transition-colors">Editar</button>
                <button @click="confirmToggleEstado(usuario)" :class="[estadoBotonClass(usuario.activo), 'px-4 py-2 rounded-md font-medium transition-colors']">
                  {{ usuario.activo ? 'Inactivar' : 'Reactivar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modales -->
      <EditUsuarioModal :visible="modales.editar" :usuario="usuarioSeleccionado" @close="() => (modales.editar = false)" @save="guardarCambios" />
      <ConfirmationModal 
        :visible="modales.confirmar" 
        :message="`¿Estás seguro de que quieres ${usuarioAToggle?.activo ? 'inactivar' : 'reactivar'} a ${usuarioAToggle?.nombresUsuario}?`" 
        @confirm="onConfirm" 
        @cancel="() => (modales.confirmar = false)" 
      />

      <div v-if="modales.registro" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="relative bg-white rounded-xl shadow-lg w-full max-w-3xl p-8">
          <button @click="() => (modales.registro = false)" class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">✕</button>
          <FormDoctorAdmin />
        </div>
      </div>
    </div>
  </div>
</template>
