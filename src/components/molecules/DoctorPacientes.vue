<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePacientesDoctorStore } from '@/stores/usePacientesDoctorStore'
import PacientesLista from '@/components/molecules/PacientesLista.vue'
import DoctorLayout from '@/components/molecules/DoctorLayout.vue'
import { useRouter } from 'vue-router'
import iconoUsuario from '@/assets/iconoC.png'

const showMenu = ref(false)
const router = useRouter()

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const cerrarSesion = () => {
  localStorage.removeItem('token') // o el que uses
  router.push('/login') // Redirige al login
}

const pacientesStore = usePacientesDoctorStore()
const { pacientesFiltrados, ubicacionesUnicas, searchQuery, selectedUbicacion, loading, error } =
  storeToRefs(pacientesStore)
const { fetchPacientesDoctor } = pacientesStore

onMounted(() => {
  fetchPacientesDoctor()
})
</script>

<template>
  <DoctorLayout>
    <!-- Barra superior derecha -->
    <div class="flex justify-between items-center mb-2">
      <!-- Espacio para alinear elementos -->
      <div></div>

      <!-- Search + Icono usuario -->
      <div class="flex items-center gap-4">
        <!-- Input de búsqueda general (CONEXIÓN AL STORE) -->
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Buscar paciente..."
          class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 "
        />

        <!-- Menú usuario -->
        <div class="relative" @click="toggleMenu">
          <img
            :src="iconoUsuario"
            alt="Usuario"
            class="w-10 h-10 rounded-lg object-cover cursor-pointer border border-gray-300"
          />

          <!-- Menú desplegable -->
          <div
            v-if="showMenu"
            class="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50"
          >
            <button
              @click="cerrarSesion"
              class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Título principal -->
    <div class="mb-6">
      <h1 class="text-4xl font-bold text-[#374473] mb-2">Pacientes</h1>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded shadow mb-6">
      <div class="flex flex-wrap gap-4 items-end">
        <!-- Campo Paciente -->
        <div class="flex flex-col w-full md:w-1/2">
          <label for="paciente" class="text-sm font-medium text-gray-700 mb-1">Paciente</label>
          <input
            id="paciente"
            v-model="searchQuery"
            type="text"
            placeholder="Buscar paciente..."
            class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Campo Ubicación -->
        <div class="flex flex-col w-full md:w-1/3">
          <label for="ubicacion" class="text-sm font-medium text-gray-700 mb-1">Ubicación</label>
          <select
            id="ubicacion"
            v-model="selectedUbicacion"
            class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas</option>
            <option v-for="ubicacion in ubicacionesUnicas" :key="ubicacion" :value="ubicacion">
              {{ ubicacion }}
            </option>
          </select>
        </div>

        <!-- Botón -->
        <div>
          <button
            @click="fetchPacientesDoctor"
            class="bg-blue-950 hover:bg-blue-800 text-white px-6 py-2 rounded-lg mt-5 md:mt-0"
          >
            Consultar 🔍
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de pacientes -->
    <PacientesLista :pacientes="pacientesFiltrados" :loading="loading" :error="error" />
  </DoctorLayout>
</template>
