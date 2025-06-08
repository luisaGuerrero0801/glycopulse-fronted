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
  <div class="min-h-screen bg-gray-50 py-6">
    <div
      :class="usuarioSeleccionado ? 'grid-cols-12' : 'grid-cols-1'"
      class="grid gap-6 max-w-7xl mx-auto px-4 transition-all duration-300 min-h-[70vh]"
    >
      <!-- Lista de usuarios -->
      <div
        :class="usuarioSeleccionado ? 'col-span-7' : 'col-span-12'"
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

      <!-- Panel derecho -->
      <div v-if="usuarioSeleccionado" class="col-span-5 flex flex-col gap-6">
        <!-- Card perfil -->
        <div class="bg-white rounded-xl shadow p-4 text-center">
          <img
            :src="usuarioSeleccionado.foto || 'https://via.placeholder.com/100'"
            alt="Perfil"
            class="w-20 h-20 rounded-full object-cover bg-gray-200 mx-auto mb-3"
          />
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
        <div class="bg-white rounded-xl shadow p-4">
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

          <!-- Botón para reactivar usuario solo si está inactivo -->
          <button
            v-if="usuarioSeleccionado.estado !== 'Activo'"
  @click="abrirModalReactivar"
  class="w-full bg-red-900 text-white px-4 py-2 text-sm rounded hover:bg-red-700"
>
            Reactivar usuario
          </button>
        </div>
      </div>
    </div>

    <!-- Modal cambiar rol -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-4 mx-4">
        <h2 class="text-lg font-semibold text-gray-800">Cambiar rol de usuario</h2>
        <select v-model="rolSeleccionado" class="w-full border rounded px-3 py-2 text-sm">
          <option
            v-for="rol in rolesPermitidos"
            :key="rol.idRol"
            :value="rol.idRol"
          >
            {{ rol.nombreRol }}
          </option>
        </select>
        <div class="flex justify-end space-x-2 mt-4">
          <button @click="cerrarModal" class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
            Cancelar
          </button>
          <button @click="guardarCambioRol" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Guardar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal reactivar usuario -->
    <div v-if="mostrarModalReactivar" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-4 mx-4">
        <h2 class="text-lg font-semibold text-gray-800">Reactivar usuario</h2>
        <p>¿Estás seguro que quieres reactivar al usuario <strong>{{ usuarioSeleccionado.nombresUsuario }} {{ usuarioSeleccionado.apellidosUsuario }}</strong>?</p>
        <div class="flex justify-end space-x-2 mt-4">
          <button @click="cerrarModalReactivar" class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
            Cancelar
          </button>
         <button @click="reactivarUsuario" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
  Reactivar
</button>
        </div>
      </div>
    </div>
  </div>
</template>
