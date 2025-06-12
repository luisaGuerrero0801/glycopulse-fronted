<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useUsuariosStore } from '@/stores/usuarios'
import { useRolesStore } from '@/stores/roles'
import { storeToRefs } from 'pinia'

const usuariosStore = useUsuariosStore()
const rolesStore = useRolesStore()

const { usuariosFiltrados, loading } = storeToRefs(usuariosStore)
const { roles } = storeToRefs(rolesStore)

const usuarioSeleccionado = ref(null)
const mostrarModal = ref(false)
const mostrarModalReactivar = ref(false) // Nueva modal para reactivar usuario
const rolSeleccionado = ref<number | null>(null)
const mensajeExito = ref<string | null>(null)

// Filtro de rol
const filtroRol = ref('Todos')

// Solo mostrar Admin y Paciente
const rolesPermitidos = computed(() =>
    roles.value.filter(r => ['Admin', 'Paciente'].includes(r.nombreRol))
)

// Usuarios filtrados por rol
const usuariosFiltradosPorRol = computed(() => {
    if (filtroRol.value === 'Todos') return usuariosFiltrados.value
    return usuariosFiltrados.value.filter(
        u => u.rol && u.rol.nombreRol === filtroRol.value
    )
})

// Lista de permisos simulada para el usuario seleccionado
const listaPermisos = ref([
  { id: 1, nombre: 'Solo lectura', activo: false },
  { id: 2, nombre: 'Activar cuentas', activo: false },
  { id: 3, nombre: 'Acceso al panel admin', activo: false },
])

watch(usuarioSeleccionado, (nuevo) => {
  if (nuevo) {
    const esAdmin = nuevo.rol?.nombreRol === 'Admin'
    listaPermisos.value = listaPermisos.value.map(p => ({
      ...p,
      activo: esAdmin
    }))
  }
})

onMounted(() => {
    usuariosStore.fetchUsuarios()
    rolesStore.fetchRoles()
})

watch(usuariosFiltrados, (nuevos) => {
    if (nuevos.length && !usuarioSeleccionado.value) {
        usuarioSeleccionado.value = nuevos[0]
    }
})

function seleccionarUsuario(usuario) {
    usuarioSeleccionado.value = usuario
}

function abrirModal() {
    rolSeleccionado.value = usuarioSeleccionado.value?.rol?.idRol || null
    mostrarModal.value = true
}

function cerrarModal() {
    mostrarModal.value = false
}

function abrirModalReactivar() {
    mostrarModalReactivar.value = true
}

function cerrarModalReactivar() {
    mostrarModalReactivar.value = false
}

async function guardarCambioRol() {
    if (!usuarioSeleccionado.value || rolSeleccionado.value === null) return
    const idUsuario = usuarioSeleccionado.value.idUsuario
    const nuevoIdRol = rolSeleccionado.value

    try {
        await usuariosStore.cambiarRolUsuario(idUsuario, nuevoIdRol)
        const nuevoRol = roles.value.find(r => r.idRol === nuevoIdRol)
        if (nuevoRol) usuarioSeleccionado.value.rol = nuevoRol

        mensajeExito.value = 'Rol actualizado correctamente'
        setTimeout(() => mensajeExito.value = null, 3000)

        cerrarModal()
    } catch (err) {
        alert('Error al cambiar el rol.')
    }
}

async function reactivarUsuario() {
    if (!usuarioSeleccionado.value) return

    try {
        await usuariosStore.reactivarUsuario(usuarioSeleccionado.value.idUsuario)
        usuarioSeleccionado.value.estado = 'Activo'

        mensajeExito.value = 'Usuario reactivado correctamente'
        setTimeout(() => mensajeExito.value = null, 3000)

        cerrarModalReactivar()
    } catch (err) {
        alert('Error al reactivar el usuario.')
    }
}
</script>

<template>
  <div class="min-h-screen bg-[#F7FAFD] py-6">
    <!-- Cabecera de Gestión de Grupos -->
    <div class="flex justify-center items-center flex-col py-6 bg-white rounded-xl shadow max-w-4xl mx-auto mb-6">
      <h1 class="text-4xl font-bold text-gray-800">🛡 Gestión de Roles

      </h1>
      <p class="text-gray-600 mt-2">Administra los roles y permisos de los usuarios del sistema </p>
    </div>

    <!-- Contenedor principal -->
    <div
      :class="usuarioSeleccionado ? 'grid-cols-1 md:grid-cols-12' : 'grid-cols-1'"
      class="grid gap-6 max-w-7xl mx-auto px-4 transition-all duration-300 min-h-[70vh]"
    >
      <!-- Lista de usuarios -->
      <div
        :class="usuarioSeleccionado ? 'md:col-span-7' : 'col-span-1'"
        class="bg-white rounded-xl shadow p-4 flex flex-col min-h-[500px] sm:min-h-[550px] md:min-h-[600px]"
      >
        <table class="w-full text-left text-sm text-gray-700 table-auto">
          <thead>
            <tr class="bg-gray-100 border-b text-xs">
              <th class="py-2 px-3">Nombre</th>
              <th class="py-2 px-3">Rol</th>
              <th class="py-2 px-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="usuario in usuariosFiltradosPorRol"
              :key="usuario.idUsuario"
              class="border-b cursor-pointer hover:bg-gray-50"
              @click="seleccionarUsuario(usuario)"
            >
              <td class="py-2 px-3 truncate">{{ usuario.nombresUsuario }} {{ usuario.apellidosUsuario }}</td>
              <td class="py-2 px-3 truncate">{{ usuario.rol.nombreRol }}</td>
              <td class="py-2 px-3">
                <span :class="usuario.estado === 'Activo' ? 'text-green-600' : 'text-red-600'">
                  {{ usuario.estado }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Panel derecho (detalles del usuario) -->
      <div v-if="usuarioSeleccionado" class="md:col-span-5 flex flex-col h-full">
        <!-- Card perfil (ocupa alto completo) -->
        <div class="bg-white rounded-xl shadow p-4 text-center flex-1 flex flex-col justify-start">
          <div class="w-24 h-24 rounded-full bg-blue-500 mx-auto mb-4 flex items-center justify-center text-3xl font-semibold text-white">
            {{ usuarioSeleccionado.nombresUsuario.charAt(0).toUpperCase() }}
          </div>
          <p class="text-base font-semibold text-gray-800">
            {{ usuarioSeleccionado.nombresUsuario }} {{ usuarioSeleccionado.apellidosUsuario }}
          </p>
          <p class="text-sm text-gray-500">
            Rol actual: <strong>{{ usuarioSeleccionado.rol.nombreRol }}</strong>
          </p>
          <p class="text-sm" :class="usuarioSeleccionado.estado === 'Activo' ? 'text-green-600' : 'text-red-600'">
            {{ usuarioSeleccionado.estado }}
          </p>
          <p v-if="mensajeExito" class="text-green-600 mt-2 text-sm">{{ mensajeExito }}</p>
        </div>

        <!-- Contenedor inferior para filtros y permisos -->
        <div class="mt-4 flex flex-col gap-4">
          <!-- Card filtros -->
          <div class="bg-white rounded-xl shadow p-4">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Filtros</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select v-model="filtroRol" class="border rounded-lg px-3 py-2 shadow-sm w-full text-sm">
                  <option value="Todos">Todos</option>
                  <option
                    v-for="rol in rolesPermitidos"
                    :key="rol.idRol"
                    :value="rol.nombreRol"
                  >
                    {{ rol.nombreRol }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Deshabilitado</label>
                <select class="border rounded-lg px-3 py-2 shadow-sm w-full text-sm">
                  <option>Todos</option>
                  <option>Activos</option>
                  <option>Inactivos</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Card permisos -->
          <div class="bg-white rounded-xl shadow p-4 flex flex-col">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Permisos del usuario</h3>
            <div class="space-y-2 mb-4">
              <div v-for="permiso in listaPermisos" :key="permiso.id" class="flex items-center gap-2">
                <input
                  type="checkbox"
                  :id="'permiso-' + permiso.id"
                  v-model="permiso.activo"
                  class="text-blue-600 border-gray-300 rounded"
                />
                <label :for="'permiso-' + permiso.id" class="text-sm text-gray-700">
                  {{ permiso.nombre }}
                </label>
              </div>
            </div>
            <button
              @click="abrirModal"
              class="w-full bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700 mb-2"
            >
              Cambiar rol
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>