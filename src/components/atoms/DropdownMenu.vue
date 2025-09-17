<template>
  <Menu as="div" class="fixed top-4 right-4 z-50 mr-10">
    <MenuButton
      class="h-10 bg-indigo-200 border rounded-lg border-indigo-300 flex items-center px-3"
    >
      <img src="/src/assets/iconoC.png" alt="LogoApp" class="h-8 w-8 object-contain mr-2" />
      <span class="text-lg font-semibold">{{ usuarioLogueado?.nombresUsuario || 'Usuario' }}</span>
      <ChevronDownIcon class="w-5 h-5 ml-2" aria-hidden="true" />
    </MenuButton>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        class="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="px-1 py-1">
          <MenuItem v-slot="{ active }">
            <button
              @click="editarUsuarioLogueado"
              :class="[
                active ? 'bg-[var(--colorPrimarioButton)] text-white' : 'text-gray-900',
                'group flex rounded-md items-center w-full px-2 py-2 text-sm'
              ]"
            >
              Perfil
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button
              @click="logout"
              :class="[
                active ? 'bg-[var(--colorPrimarioButton)] text-white' : 'text-gray-900',
                'group flex rounded-md items-center w-full px-2 py-2 text-sm'
              ]"
            >
              Cerrar sesión
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>

  <div>
    <EditUsuarioModal
      :visible="modales.editar"
      :usuario="usuarioSeleccionado"
      @close="modales.editar = false"
      @save="guardarCambios"
    />
    <ConfirmationModal
      :visible="modales.confirmar"
      :message="`¿Estás seguro de que quieres ${usuarioAToggle?.activo ? 'inactivar' : 'reactivar'} a ${usuarioAToggle?.nombresUsuario}?`"
      @confirm="onConfirm"
      @cancel="modales.confirmar = false"
    />
  </div>

  <div
    v-if="modales.registro"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="relative bg-white rounded-xl shadow-lg w-full max-w-3xl p-8">
      <button
        @click="modales.registro = false"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
      >
        ✕
      </button>
      <FormDoctorAdmin />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { loginStore } from '@/stores/login'
import { onMounted, ref, computed } from 'vue'
import { useUsuariosStore } from '@/stores/usuarios'
import { storeToRefs } from 'pinia'
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

const store = loginStore()
const usuariosStore = useUsuariosStore()
const { usuariosFiltrados, loading, error } = storeToRefs(usuariosStore)

const token = sessionStorage.getItem('token')
const rol = sessionStorage.getItem('rol')
const idUsuario = Number(sessionStorage.getItem('idUsuario'))

const modales = ref({
  editar: false,
  confirmar: false,
  registro: false,
})

const dropdownVisible = ref(false)
const usuarioSeleccionado = ref<Usuario | null>(null)
const usuarioAToggle = ref<Usuario | null>(null)

// Computed para obtener el usuario logueado completo
const usuarioLogueado = computed(() => {
  return usuariosFiltrados.value.find((u) => u.idUsuario === idUsuario) || null
})

const editarUsuarioLogueado = () => {
  if (usuarioLogueado.value) {
    usuarioSeleccionado.value = usuarioLogueado.value
    modales.value.editar = true
  }
}

onMounted(() => {
  usuariosStore.fetchUsuarios()
})

function logout() {
  store.logout()
}

const guardarCambios = async (usuarioEditado: Usuario) => {
  try {
    await usuariosStore.editarUsuario(usuarioEditado)
    modales.value.editar = false
  } catch (err: any) {
    console.error(err)
    alert(`Error: ${err.message}`)
  }
}

const confirmToggleEstado = (usuario: Usuario) => {
  usuarioAToggle.value = usuario
  modales.value.confirmar = true
}

const onConfirm = () => {
  if (usuarioAToggle.value) toggleEstado(usuarioAToggle.value)
  modales.value.confirmar = false
  usuarioAToggle.value = null
}

const toggleEstado = async (usuario: Usuario) => {
  try {
    await usuariosStore.cambiarEstadoUsuario(usuario.idUsuario, !usuario.activo)
  } catch (err) {
    console.error(err)
  }
}

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value
}
const abrirRegistro = () => {
  dropdownVisible.value = false
  modales.value.registro = true
}
</script>
