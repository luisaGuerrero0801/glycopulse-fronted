<template>
  <div class="min-h-screen bg-gray-100 p-2" id="capture">
    <!-- Botón flotante de descarga arriba a la derecha -->
    <div class="fixed top-4 right-4 z-50">
      <button @click="captureScreen" class="bg-blue-600 text-white px-3 py-1 rounded-lg shadow" aria-label="Descargar Informe">
        Descargar Informe
      </button>
    </div>

    <!-- Contenedor central alineado con sidebar -->
    <div class="max-w-5xl mx-auto space-y-6">
      <div class="text-center">
        <h1 class="text-2xl font-bold">📊 Dashboard</h1>
        <p class="text-gray-600 text-sm">Resumen de información actual</p>
      </div>

      <!-- Tarjetas Resumen -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
        <div class="bg-white text-blue-600 rounded-lg shadow p-3">
          <h2 class="text-md font-semibold">👥 Usuarios</h2>
          <p class="text-xl font-bold">{{ totalUsuarios }}</p>
        </div>
        <div class="bg-white text-green-600 rounded-lg shadow p-3">
          <h2 class="text-md font-semibold">🛠️ Administradores</h2>
          <p class="text-xl font-bold">{{ totalAdmins }}</p>
        </div>
        <div class="bg-white text-orange-600 rounded-lg shadow p-3">
          <h2 class="text-md font-semibold">🤱🏻 Pacientes</h2>
          <p class="text-xl font-bold">{{ totalPacientes }}</p>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-white p-3 rounded-lg shadow h-[300px]">
          <Bar :data="chartData" :options="chartOptions" />
        </div>
        <div class="bg-white p-3 rounded-lg shadow h-[300px]">
          <Pie :data="chartDataPie" :options="{ responsive: true }" />
        </div>
      </div>

      <!-- Tabla con paginación -->
      <div class="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <h2 class="text-lg font-semibold mb-4">📋 Tabla de usuarios</h2>
        <table class="w-full text-left table-auto border-collapse">
          <thead class="bg-blue-100">
            <tr>
              <th class="px-2 py-1 text-sm">Nombre</th>
              <th class="px-2 py-1 text-sm">Email</th>
              <th class="px-2 py-1 text-sm">Rol</th>
              <th class="px-2 py-1 text-sm">Tipo de Sangre</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in usuariosPaginados" :key="usuario.idUsuario" class="border-b hover:bg-gray-50">
              <td class="px-2 py-1 text-sm">{{ usuario.nombreUsuario }}</td>
              <td class="px-2 py-1 text-sm">{{ usuario.emailUsuario }}</td>
              <td class="px-2 py-1 text-sm">{{ usuario.rol.nombreRol }}</td>
              <td class="px-2 py-1 text-sm">{{ usuario.rhUsuario }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Paginación -->
        <div class="flex justify-between items-center mt-4">
          <button
            @click="paginated.page = Math.max(1, paginated.page - 1)"
            class="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
            :disabled="paginated.page === 1"
            v-if="paginated.page > 1"
          >
            Anterior
          </button>
          <span class="text-sm">Página {{ paginated.page }} de {{ totalPages }}</span>
          <button
            @click="paginated.page = Math.min(totalPages, paginated.page + 1)"
            class="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
            :disabled="paginated.page === totalPages"
            v-if="paginated.page < totalPages"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUsuariosStore } from '@/stores/donantes'
import { graficosStore } from '@/stores/graficosAdmin'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Bar, Pie } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import html2canvas from 'html2canvas'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
)

const usuariosStore = useUsuariosStore()
const graficos = graficosStore()

const { usuariosFiltrados } = storeToRefs(usuariosStore)
const { conteoRolRh } = storeToRefs(graficos)

let intervalId: number | undefined
let isLoading = ref(false)

onMounted(() => {
  graficos.cargarConteoRolRh()
  usuariosStore.fetchUsuarios()
  intervalId = setInterval(() => {
    graficos.cargarConteoRolRh()
    usuariosStore.fetchUsuarios()
  }, 5000) // Cambié el intervalo a 5 segundos
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

function contarPorGrupo(grupo: string) {
  return usuariosFiltrados.value.filter((usuario) => usuario.rhUsuario === grupo).length
}
function contarPorRol(rol: string) {
  return usuariosFiltrados.value.filter((usuario) => usuario.rol.nombreRol === rol).length
}

const totalUsuarios = computed(() => usuariosFiltrados.value.length)
const totalAdmins = computed(() => contarPorRol('Admin'))
const totalPacientes = computed(() => contarPorRol('Paciente'))

const paginated = ref({
  page: 1,
  perPage: 5
})
const totalPages = computed(() => Math.ceil(usuariosFiltrados.value.length / paginated.value.perPage))

const usuariosPaginados = computed(() => {
  const start = (paginated.value.page - 1) * paginated.value.perPage
  return usuariosFiltrados.value.slice(start, start + paginated.value.perPage)
})

const chartData = computed(() => ({
  labels: conteoRolRh.value.map((item) => `${item.rh} / ${item.rol}`),
  datasets: [
    {
      label: 'Usuarios por tipo de sangre y rol',
      backgroundColor: '#3b82f6',
      borderColor: '#2563eb',
      borderWidth: 1,
      borderRadius: 5,
      data: conteoRolRh.value.map((item) => Number(item.cantidad))
    }
  ]
}))

const chartDataPie = computed(() => ({
  labels: ['Administradores', 'Pacientes'],
  datasets: [
    {
      label: 'Distribución por Roles',
      backgroundColor: ['#22c55e', '#f97316'],
      data: [totalAdmins.value, totalPacientes.value]
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
    title: {
      display: true,
      text: 'Distribución de Usuarios por Tipo de Sangre',
      color: '#000',
      font: {
        family: 'Poppins',
        weight: 'bold',
        size: 16
      }
    },
    datalabels: {
      anchor: 'center',
      align: 'center',
      clamp: true,
      color: '#FFF',
      font: {
        family: 'Poppins',
        weight: 'bold',
        size: 12
      },
      formatter: Math.round
    }
  }
}

const chartDataKey = 'chart-key'

function captureScreen() {
  const element = document.getElementById('capture')
  if (element) {
    isLoading.value = true
    html2canvas(element).then((canvas) => {
      const img = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = img
      link.download = 'informe.png'
      link.click()
      isLoading.value = false
    })
  }
}
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
