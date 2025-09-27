<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePacientesDoctorStore } from '@/stores/usePacientesDoctorStore'
import PacientesLista from '@/components/molecules/PacientesLista.vue'
import DoctorLayout from '@/components/molecules/DoctorLayout.vue'
import { useRouter } from 'vue-router'
import iconoUsuario from '@/assets/iconoC.png'
import UserHeader from './UserHeader.vue'
import HeaderApp from './HeaderApp.vue'

const showMenu = ref(false)
const router = useRouter()

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const cerrarSesion = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const pacientesStore = usePacientesDoctorStore()
const { pacientesFiltrados, ubicacionesUnicas, searchQuery, selectedUbicacion, loading, error } =
  storeToRefs(pacientesStore)
const { fetchPacientesDoctor } = pacientesStore

// 🔹 Nuevo ref para la opción seleccionada
const selectedOption = ref('')

const consultar = () => {
  if (selectedOption.value) {
    router.push({ path: selectedOption.value }) // ✅ ahora sí redirige
  } else {
    fetchPacientesDoctor()
  }
}

onMounted(() => {
  fetchPacientesDoctor()
})
</script>

<template>
  <DoctorLayout>
    <HeaderApp pagename="doctor/pacientes" />

    <!-- Filtros -->
    <div class="bg-white p-4 rounded shadow mb-6">
      <div class="flex flex-wrap gap-4 items-end">
        <!-- Paciente -->
        <div class="flex flex-col w-full md:w-1/3">
          <label class="text-sm font-medium text-gray-700 mb-1">Paciente</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar paciente..."
            class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Ubicación -->
        <div class="flex flex-col w-full md:w-1/3">
          <label class="text-sm font-medium text-gray-700 mb-1">Ubicación</label>
          <select
            v-model="selectedUbicacion"
            class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas</option>
            <option v-for="ubicacion in ubicacionesUnicas" :key="ubicacion" :value="ubicacion">
              {{ ubicacion }}
            </option>
          </select>
        </div>

        <!-- Selección de opción -->
        <div class="flex flex-col w-full md:w-1/3">
          <label class="text-sm font-medium text-gray-700 mb-1">Opción</label>
          <select
            v-model="selectedOption"
            class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione...</option>
            <option value="/glucometrias">Reportes</option>
            <option value="/glucometrias">Glucometrías</option>
            <option value="/doctor/recetas">Recetas</option>
          </select>
        </div>

        <!-- Botón -->
        <div>
          <button
            @click="consultar"
            class="bg-blue-950 hover:bg-blue-800 text-white px-6 py-2 rounded-lg mt-5 md:mt-0"
          >
            Consultar 🔍
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de pacientes -->
    <div>
      <div v-if="loading" class="text-center py-6 text-gray-500">Cargando pacientes...</div>
      <div v-else-if="error" class="text-center py-6 text-red-500">{{ error }}</div>
      <div v-else-if="pacientesFiltrados.length === 0" class="text-center py-6 text-gray-500">
        No se encontraron pacientes con los filtros seleccionados
      </div>
      <div v-else class="space-y-3">
        <PacientesLista :pacientes="pacientesFiltrados" :loading="loading" />
      </div>
    </div>
  </DoctorLayout>
</template>
