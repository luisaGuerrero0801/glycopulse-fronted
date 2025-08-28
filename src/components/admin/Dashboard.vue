<template>
  <div class="min-h-screen bg-gray-100 p-2" id="capture">
    <!-- Botón flotante de descarga -->
    <div class="fixed top-4 right-4 z-50">
      <button
        @click="captureScreen"
        class="bg-[var(--colorPrimarioButton)] hover:bg-[var(--colorSecundarioButton)] text-white px-3 py-1 rounded-lg shadow"
        aria-label="Descargar Informe"
      >
        Descargar Informe
      </button>
    </div>

    <!-- Contenedor central -->
    <div class="max-w-6xl mx-auto space-y-6">
      <div class="text-center">
        <h1 class="text-2xl font-bold">📊 Dashboard</h1>
        <p class="text-gray-600 text-sm">Resumen de información actual</p>
      </div>

      <!-- Tarjetas Resumen -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
        <!-- Admins -->
        <div class="bg-white shadow rounded-xl p-4 flex flex-col items-center">
          <span class="text-green-600 font-semibold flex items-center gap-2">
            🛠️ Administradores
          </span>
          <p class="text-2xl font-bold text-green-600">{{ totalAdmins }}</p>
        </div>

        <!-- Pacientes -->
        <div class="bg-white shadow rounded-xl p-4 flex flex-col items-center">
          <span class="text-orange-600 font-semibold flex items-center gap-2">
            🤱🏻 Pacientes
          </span>
          <p class="text-2xl font-bold text-orange-600">{{ totalPacientes }}</p>
        </div>

        <!-- Doctores -->
        <div class="bg-white shadow rounded-xl p-4 flex flex-col items-center">
          <span class="text-purple-600 font-semibold flex items-center gap-2">
            👨‍⚕️ Doctores
          </span>
          <p class="text-2xl font-bold text-purple-600">{{ totalDoctores }}</p>
        </div>
      </div>

      <!-- Gráficos principales -->
      <div class="grid md:grid-cols-2 gap-4">
        <!-- Activos/Inactivos -->
        <div class="bg-white p-3 rounded-lg shadow h-[300px]">
          <Bar :data="chartData" :options="chartOptions" />
        </div>

        <!-- Roles -->
        <div class="bg-white p-3 rounded-lg shadow h-[300px]">
          <Pie :data="chartDataPie" :options="{ responsive: true }" />
        </div>
      </div>

      <!-- Doctores activos en el tiempo -->
      <div class="bg-white p-3 rounded-lg shadow h-[300px]">
        <Line :data="chartDataLine" :options="chartOptionsLine" />
      </div>

      <!-- Uso de la plataforma (logins diarios) -->
      <div class="bg-white p-3 rounded-lg shadow h-[300px]">
        <Line :data="chartDataLogins" :options="chartOptionsLogins" />
      </div>

      <!-- Historial de registros (Altas y Bajas) -->
      <div class="bg-white p-3 rounded-lg shadow h-[300px]">
        <Bar :data="chartDataAltasBajas" :options="chartOptionsAltasBajas" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUsuariosStore } from '@/stores/donantes'
import { graficosStore } from '@/stores/graficosAdmin'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Bar, Pie, Line } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import html2canvas from 'html2canvas'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
)

const usuariosStore = useUsuariosStore()
const graficos = graficosStore()

const { usuariosFiltrados } = storeToRefs(usuariosStore)

let intervalId: number | undefined
let isLoading = ref(false)

onMounted(() => {
  usuariosStore.fetchUsuarios()
  intervalId = setInterval(() => {
    usuariosStore.fetchUsuarios()
  }, 5000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

function contarPorRol(rol: string) {
  return usuariosFiltrados.value.filter((usuario) => usuario.rol.nombreRol === rol).length
}

// Totales
const totalAdmins = computed(() => contarPorRol('Admin'))
const totalPacientes = computed(() => contarPorRol('Paciente'))
const totalDoctores = computed(() => contarPorRol('Doctor'))

// Activos / Inactivos
const totalActivos = computed(() => usuariosFiltrados.value.filter((u) => u.estado === true).length)
const totalInactivos = computed(() => usuariosFiltrados.value.filter((u) => u.estado === false).length)

// Doctores activos (ejemplo agrupado por semanas/meses)
const doctoresActivosPorPeriodo = computed(() => {
  return [
    { periodo: 'Semana 1', cantidad: 5 },
    { periodo: 'Semana 2', cantidad: 8 },
    { periodo: 'Semana 3', cantidad: 6 },
    { periodo: 'Semana 4', cantidad: 10 }
  ]
})

// Logins diarios (ejemplo simulado)
const loginsDiarios = computed(() => {
  return [
    { fecha: 'Lun', cantidad: 20 },
    { fecha: 'Mar', cantidad: 35 },
    { fecha: 'Mié', cantidad: 25 },
    { fecha: 'Jue', cantidad: 40 },
    { fecha: 'Vie', cantidad: 30 },
    { fecha: 'Sáb', cantidad: 15 },
    { fecha: 'Dom', cantidad: 10 }
  ]
})

// Historial de altas y bajas (ejemplo simulado)
const historialAltasBajas = computed(() => {
  return [
    { periodo: 'Enero', altas: 30, bajas: 5 },
    { periodo: 'Febrero', altas: 25, bajas: 8 },
    { periodo: 'Marzo', altas: 40, bajas: 12 },
    { periodo: 'Abril', altas: 35, bajas: 6 }
  ]
})

// Gráfico de Activos/Inactivos
const chartData = computed(() => ({
  labels: ['Usuarios Activos', 'Usuarios Inactivos'],
  datasets: [
    {
      label: 'Usuarios',
      backgroundColor: ['#22c55e', '#ef4444'],
      borderColor: ['#16a34a', '#dc2626'],
      borderWidth: 1,
      borderRadius: 5,
      data: [totalActivos.value, totalInactivos.value]
    }
  ]
}))

// Gráfico de Roles
const chartDataPie = computed(() => ({
  labels: ['Administradores', 'Pacientes', 'Doctores'],
  datasets: [
    {
      label: 'Distribución por Roles',
      backgroundColor: ['#22c55e', '#f97316', '#a855f7'],
      data: [totalAdmins.value, totalPacientes.value, totalDoctores.value]
    }
  ]
}))

// Gráfico de Doctores Activos por semana/mes
const chartDataLine = computed(() => ({
  labels: doctoresActivosPorPeriodo.value.map((d) => d.periodo),
  datasets: [
    {
      label: 'Doctores Activos',
      data: doctoresActivosPorPeriodo.value.map((d) => d.cantidad),
      borderColor: '#6366f1',
      backgroundColor: '#a5b4fc',
      fill: true,
      tension: 0.3,
      pointRadius: 5,
      pointBackgroundColor: '#4f46e5'
    }
  ]
}))

// Gráfico de Logins diarios
const chartDataLogins = computed(() => ({
  labels: loginsDiarios.value.map((d) => d.fecha),
  datasets: [
    {
      label: 'Inicios de Sesión',
      data: loginsDiarios.value.map((d) => d.cantidad),
      borderColor: '#10b981',
      backgroundColor: '#6ee7b7',
      fill: true,
      tension: 0.3,
      pointRadius: 5,
      pointBackgroundColor: '#059669'
    }
  ]
}))

// Gráfico de Historial Altas y Bajas
const chartDataAltasBajas = computed(() => ({
  labels: historialAltasBajas.value.map((d) => d.periodo),
  datasets: [
    {
      label: 'Altas',
      data: historialAltasBajas.value.map((d) => d.altas),
      backgroundColor: '#3b82f6'
    },
    {
      label: 'Bajas',
      data: historialAltasBajas.value.map((d) => d.bajas),
      backgroundColor: '#ef4444'
    }
  ]
}))

// Opciones del gráfico Activos/Inactivos
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
    title: {
      display: true,
      text: 'Usuarios Activos vs Inactivos',
      color: '#000',
      font: { family: 'Poppins', weight: 'bold', size: 16 }
    },
    datalabels: {
      anchor: 'center',
      align: 'center',
      clamp: true,
      color: '#FFF',
      font: { family: 'Poppins', weight: 'bold', size: 12 },
      formatter: Math.round
    }
  }
}

// Opciones gráfico Doctores Activos
const chartOptionsLine = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
    title: {
      display: true,
      text: 'Doctores Activos por Semana/Mes',
      color: '#000',
      font: { family: 'Poppins', weight: 'bold', size: 16 }
    }
  }
}

// Opciones gráfico Logins
const chartOptionsLogins = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
    title: {
      display: true,
      text: 'Uso de la Plataforma (Logins Diarios)',
      color: '#000',
      font: { family: 'Poppins', weight: 'bold', size: 16 }
    }
  }
}

// Opciones gráfico Altas y Bajas
const chartOptionsAltasBajas = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
    title: {
      display: true,
      text: 'Historial de Registros (Altas vs Bajas)',
      color: '#000',
      font: { family: 'Poppins', weight: 'bold', size: 16 }
    }
  }
}

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
