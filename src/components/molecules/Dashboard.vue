<script lang="ts" setup>
import { useUsuariosStore } from '@/stores/donantes'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

const usuariosStore = useUsuariosStore()
const { usuariosFiltrados, loading, error } = storeToRefs(usuariosStore)

onMounted(() => {
  usuariosStore.fetchUsuarios()
})

function contarPorGrupo(grupo: string) {
  return usuariosFiltrados.value.filter(usuario => usuario.rhUsuario === grupo).length
}

function contarPorAdmin(grupoAdmin: string) {
  return usuariosFiltrados.value.filter(usuario => usuario.rol.nombreRol === grupoAdmin).length
}

const totalUsuarios = computed(() => usuariosFiltrados.value.length)
const totalAmas = computed(() => contarPorGrupo('A+'))
const totalAmenos = computed(() => contarPorGrupo('A-'))
const totalBmas = computed(() => contarPorGrupo('B+'))
const totalBmenos = computed(() => contarPorGrupo('B-'))
const totalABmas = computed(() => contarPorGrupo('AB+'))
const totalABmenos = computed(() => contarPorGrupo('AB-'))
const totalOmas = computed(() => contarPorGrupo('O+'))
const totalOmenos = computed(() => contarPorGrupo('O-'))


const totalAdmins = computed(() =>
  usuariosFiltrados.value.filter(usuario => usuario.rol.nombreRol === 'Admin').length
)

const totalPacientes = computed(() =>
  usuariosFiltrados.value.filter(usuario => usuario.rol.nombreRol === 'Paciente').length
)
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="flex justify-center items-center flex-col py-8">
      <h1 class="text-4xl font-bold">📊 Dashboard</h1>
      <p class="text-gray-600 mt-2">Resumen de información actual</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
      <div
        class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6"
      >
        <h2 class="text-xl font-bold flex items-center justify-center">👥 Usuarios en sistema</h2>
        <p class="text-gray-800 text-3xl font-bold">{{ totalUsuarios }}</p>
        <p class="mt-1 text-sm text-gray-500">Total registrados</p>
      </div>


      <div
        class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6"
      >
        <h2 class="text-xl font-bold flex items-center justify-center">🛠️ Administradores</h2>
        <p class="text-gray-800 text-3xl font-bold">{{ totalAdmins }}</p>
        <p class="mt-1 text-sm text-gray-500">Total registrados</p>
      </div>

      <div
        class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6"
      >
        <h2 class="text-xl font-bold flex items-center justify-center">🤱🏻 Pacientes</h2>
        <p class="text-gray-800 text-3xl font-bold">{{ totalPacientes }}</p>
        <p class="mt-1 text-sm text-gray-500">Total registrados</p>
      </div>

    
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      <div
        class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4"
      >
        <h2 class="text-xl font-bold flex items-center justify-center">🩸 A+</h2>
        <p class="text-gray-800 text-3xl font-bold">{{ totalAmas }}</p>
        <p class="mt-1 text-sm text-gray-500">Total registrados</p>
      </div>

      <div
        class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4"
      >
        <h2 class="text-xl font-bold flex items-center justify-center">🩸 A-</h2>
        <p class="text-gray-800 text-3xl font-bold">{{ totalAmenos }}</p>
        <p class="mt-1 text-sm text-gray-500">Total registrados</p>
      </div>

      <div
        class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4"
      >
        <h2 class="text-xl font-bold flex items-center justify-center">🩸 B+</h2>
        <p class="text-gray-800 text-3xl font-bold">{{ totalBmas }}</p>
        <p class="mt-1 text-sm text-gray-500">Total registrados</p>
      </div>

      <div
        class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4"
      >
        <h2 class="text-xl font-bold flex items-center justify-center">🩸 B-</h2>
        <p class="text-gray-800 text-3xl font-bold">{{ totalBmenos }}</p>
        <p class="mt-1 text-sm text-gray-500">Total registrados</p>
      </div>

      <div
        class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4"
      >
        <h2 class="text-xl font-bold flex items-center justify-center">🩸 AB+</h2>
        <p class="text-gray-800 text-3xl font-bold">{{ totalABmas }}</p>
        <p class="mt-1 text-sm text-gray-500">Total registrados</p>
      </div>

      <div
        class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4"
      >
        <h2 class="text-xl font-bold flex items-center justify-center">🩸 AB-</h2>
        <p class="text-gray-800 text-3xl font-bold">{{ totalABmenos }}</p>
        <p class="mt-1 text-sm text-gray-500">Total registrados</p>
      </div>

      <div
        class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4"
      >
        <h2 class="text-xl font-bold flex items-center justify-center">🩸 O+</h2>
        <p class="text-gray-800 text-3xl font-bold">{{ totalOmas }}</p>
        <p class="mt-1 text-sm text-gray-500">Total registrados</p>
      </div>

      <div
        class="bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4"
      >
        <h2 class="text-xl font-bold flex items-center justify-center">🩸 O-</h2>
        <p class="text-gray-800 text-3xl font-bold">{{ totalOmenos }}</p>
        <p class="mt-1 text-sm text-gray-500">Total registrados</p>
      </div>
    </div>
  </div>
</template>
