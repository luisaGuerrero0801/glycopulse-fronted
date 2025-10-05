<!-- DoctorReportesHome.vue  -->
<template>

  <div class="flex items-center justify-between mt-8 mb-0.5">
    <HeaderApp pagename="doctor/Reportes" />
        <button
          @click="volver"
          class="bg-indigo-950 hover:bg-gray-200 text-white px-5 py-3 rounded-lg text-lg font-medium"
        >
          ← Volver
        </button>
      </div>
  <div class="min-w-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-2 sm:p-2" id="capture">
    
    <header class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-extrabold text-black mb-4 text-center">
        Informe de Glucosa
      </h1>
      <div class="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg space-y-4">
        <div class="flex flex-wrap gap-4 items-end">
          <div class="flex-1">
            <p class="text-gray-600">
              Usuario ID: <strong>{{ currentUserId }}</strong>
            </p>
          </div>

          <button
            @click="loadUserData"
            class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            :disabled="loading"
          >
            {{ loading ? 'Cargando...' : 'Actualizar Datos' }}
          </button>

          <button
            @click="downloadReport"
            class="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Descargar Informe
          </button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div class="bg-blue-50 p-3 rounded">
            <div class="font-semibold">Registros</div>
            <div>{{ userRecords.length }}</div>
          </div>
          <div class="bg-blue-50 p-3 rounded">
            <div class="font-semibold">Cargando</div>
            <div>{{ loading ? 'Sí' : 'No' }}</div>
          </div>
          <div class="bg-blue-50 p-3 rounded">
            <div class="font-semibold">Error</div>
            <div>{{ error || 'No' }}</div>
          </div>
          <div class="bg-blue-50 p-3 rounded">
            <div class="font-semibold">Filtrados</div>
            <div>{{ filteredRecords.length }}</div>
          </div>
        </div>
      </div>
    </header>

    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"
      ></div>
      <p class="text-gray-600 mt-2">Cargando datos de glucosa...</p>
    </div>

    <div v-else-if="error" class="text-center py-8 text-red-600 bg-red-50 rounded-lg mx-4">
      <p>Error: {{ error }}</p>
      <button @click="loadUserData" class="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg">
        Reintentar
      </button>
    </div>

    <main v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-if="!filteredRecords.length"
        class="lg:col-span-3 text-center py-8 text-gray-500 bg-white rounded-xl shadow-lg"
      >
        <p class="mt-2 font-semibold">No hay registros de glucosa disponibles.</p>
        <p class="text-sm">Cuando agregues registros de glucosa, aparecerán aquí.</p>
      </div>

      <template v-else>
        <div
          v-for="(chart, idx) in chartConfigs.filter((c) => c.title !== 'Lecturas por Hora')"
          :key="idx"
          class="bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition"
        >
          <div class="flex items-center mb-3">
            <h2 class="text-lg sm:text-xl font-semibold text-gray-700">{{ chart.title }}</h2>
          </div>
          <div class="h-48 sm:h-56">
            <component :is="chart.component" :data="chart.data" :options="chart.options" />
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 col-span-1 sm:col-span-2 lg:col-span-3">
          <div class="bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <div class="flex items-center mb-3">
              <h2 class="text-lg sm:text-xl font-semibold text-gray-700">Lecturas por Hora</h2>
            </div>
            <div class="h-48 sm:h-56">
              <ScatterChart :data="scatterData" :options="scatterOptions" />
            </div>
          </div>

          <section class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col">
            <div class="mb-3 flex items-center justify-between">
              <h3 class="text-md sm:text-lg font-semibold text-gray-700">
                Registros ({{ filteredRecords.length }})
              </h3>
            </div>
            <div
              class="w-full max-h-[400px] overflow-y-auto rounded-lg border border-gray-200 flex-1"
            >
              <table class="min-w-full text-sm divide-y divide-gray-200">
                <thead class="bg-indigo-100 text-xs sticky top-0 z-10">
                  <tr>
                    <th class="px-3 py-2 text-left font-medium text-indigo-700">Fecha</th>
                    <th class="px-3 py-2 text-left font-medium text-indigo-700">Hora</th>
                    <th class="px-3 py-2 text-left font-medium text-indigo-700">Glucosa</th>
                    <th class="px-3 py-2 text-left font-medium text-indigo-700">Estado</th>
                    <th class="px-3 py-2 text-left font-medium text-indigo-700">Rango</th>
                    <th class="px-3 py-2 text-left font-medium text-indigo-700">Momento</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr
                    v-for="rec in paginatedRecords"
                    :key="rec.id"
                    class="hover:bg-indigo-50 transition"
                  >
                    <td class="px-3 py-2">{{ rec.fecha }}</td>
                    <td class="px-3 py-2">{{ rec.hora }}</td>
                    <td class="px-3 py-2 font-semibold">{{ rec.value }}</td>
                    <td class="px-3 py-2 text-gray-700">{{ rec.estado?.nombreEstado }}</td>
                    <td class="px-3 py-2 flex items-center gap-2">
                      <span>{{ rec.rango?.nombreRango }}</span>
                      <span
                        class="w-4 h-4 rounded-full"
                        :style="{ backgroundColor: rec.rango?.color || '#ccc' }"
                      ></span>
                    </td>
                    <td class="px-3 py-2 text-gray-600">{{ rec.momento }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="flex justify-center items-center gap-2 mt-4">
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-1 rounded bg-indigo-100 text-indigo-700 disabled:opacity-40"
              >
                ◀
              </button>

              <span class="text-sm text-gray-600">
                Página {{ currentPage }} de {{ totalPages }}
              </span>

              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 rounded bg-indigo-100 text-indigo-700 disabled:opacity-40"
              >
                ▶
              </button>
            </div>
          </section>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import HeaderApp from './HeaderApp.vue'
import { ref, computed, onMounted } from 'vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Filler as FillerPlugin
} from 'chart.js'
import {
  Line as LineChart,
  Bar as BarChart,
  Pie as PieChart,
  Scatter as ScatterChart
} from 'vue-chartjs'
import { useGlucometriasStore } from '@/stores/glucometrias/AllGlucometrias'

// 👇 recibimos el id desde el padre
const props = defineProps<{
  pacienteId: number
}>()
const router = useRouter() // ✅ Inicialización

const volver = () => router.push('/doctor/pacientes')
const store = useGlucometriasStore()
const loading = ref(false)
const error = ref<string | null>(null)
const userRecords = ref<any[]>([])
const filteredRecords = ref<any[]>([])
const currentUserId = computed(() => props.pacienteId)


const currentPage = ref(1)
const pageSize = ref(2)

const totalPages = computed(() => Math.ceil(filteredRecords.value.length / pageSize.value) || 1)
const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRecords.value.slice(start, start + pageSize.value)
})

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}


const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 10
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#1f2937',
      bodyColor: '#1f2937',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      titleFont: {
        size: 11
      },
      bodyFont: {
        size: 11
      }
    }
  }
}

const lineOptions = {
  ...baseChartOptions,
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        maxTicksLimit: 8,
        font: {
          size: 9
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(0,0,0,0.1)' },
      ticks: {
        callback: function (value: any) {
          return value + ' mg/dL'
        },
        font: {
          size: 9
        }
      }
    }
  }
}

const barOptions = {
  ...baseChartOptions,
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        maxTicksLimit: 6,
        font: {
          size: 9
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(0,0,0,0.1)' },
      ticks: {
        callback: function (value: any) {
          return value + ' mg/dL'
        },
        font: {
          size: 9
        }
      }
    }
  }
}

const pieOptions = {
  ...baseChartOptions,
  plugins: {
    ...baseChartOptions.plugins,
    legend: {
      ...baseChartOptions.plugins.legend,
      labels: {
        usePointStyle: true,
        padding: 10,
        font: {
          size: 9
        }
      }
    }
  }
}

const scatterOptions = {
  ...baseChartOptions,
  scales: {
    x: {
      title: {
        display: true,
        text: 'Hora del día',
        font: {
          size: 10
        }
      },
      ticks: {
        font: {
          size: 9
        }
      }
    },
    y: {
      title: {
        display: true,
        text: 'Glucosa (mg/dL)',
        font: {
          size: 10
        }
      },
      beginAtZero: true,
      grid: { color: 'rgba(0,0,0,0.1)' },
      ticks: {
        callback: function (value: any) {
          return value + ' mg/dL'
        },
        font: {
          size: 9
        }
      }
    }
  }
}

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  FillerPlugin
)

const downloadReport = async () => {
  const element = document.getElementById('capture')
  if (!element) return

  const canvas = await html2canvas(element, { scale: 2 })
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')

  const imgProps = pdf.getImageProperties(imgData)
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
  pdf.save(`informe-glucosa-${currentUserId.value || 'usuario'}.pdf`)
}

const loadUserData = async () => {
  if (!currentUserId.value) {
    error.value = 'No hay usuario identificado'
    return
  }
  loading.value = true
  error.value = null
  try {
    userRecords.value = []
    await store.verGlucos(currentUserId.value)
    const userGlucometrias = store.glucometrias.filter(
      (g: any) => g.usuario?.idUsuario === currentUserId.value
    )
    userRecords.value = userGlucometrias
      .map((g: any) => {
        try {
          return {
            id: g.idGlucometria,
            fecha: g.fechaGlucometria,
            hora: g.horaGlucometria,
            value: g.nivelGlucometria,
            momento: g.momento,
            estado: g.estado,
            rango: g.rango,
            timestamp:
              new Date(g.fechaGlucometria + ' ' + g.horaGlucometria).getTime() || Date.now()
          }
        } catch (err) {
          return null
        }
      })
      .filter((r: any) => r !== null)
    filterRecords()
  } catch (err) {
    error.value = 'Error al cargar los datos del usuario'
  } finally {
    loading.value = false
  }
}

const filterRecords = () => {
  filteredRecords.value = userRecords.value.sort((a, b) => b.timestamp - a.timestamp)
  currentPage.value = 1
}

const lineData = computed(() => {
  const labels = filteredRecords.value.map((r) => `${r.fecha} ${r.hora}`)
  const values = filteredRecords.value.map((r) => r.value)
  return {
    labels,
    datasets: [
      {
        label: 'Glucosa (mg/dL)',
        data: values,
        borderColor: '#5c6ac4',
        backgroundColor: 'rgba(92, 106, 196, 0.2)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#5c6ac4',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 3
      }
    ]
  }
})

const barData = computed(() => {
  const dailyData: Record<string, number[]> = {}
  filteredRecords.value.forEach((r) => {
    if (!dailyData[r.fecha]) dailyData[r.fecha] = []
    dailyData[r.fecha].push(r.value)
  })
  const labels = Object.keys(dailyData)

  const colorPalette = [
    '#8b5cf6',
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444'
  ]

  const averages = labels.map((date) => {
    const values = dailyData[date]
    return values.reduce((s, v) => s + v, 0) / values.length
  })

  return {
    labels,
    datasets: [
      {
        label: 'Promedio Diario (mg/dL)',
        data: averages,
        backgroundColor: labels.map((_, index) => colorPalette[index % colorPalette.length]),
        borderColor: labels.map((_, index) => colorPalette[index % colorPalette.length]),
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  }
})

const pieData = computed(() => {
  const counts: Record<string, { value: number; color: string }> = {}

  filteredRecords.value.forEach((r) => {
    const nombre = r.rango?.nombreRango || 'Sin rango'
    const color = r.rango?.color || '#9ca3af'
    if (!counts[nombre]) counts[nombre] = { value: 0, color }
    counts[nombre].value++
  })

  const labels = Object.keys(counts)

  const defaultColors = [
    '#ef4444',
    '#f59e0b',
    '#10b981',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#84cc16',
    '#f97316',
    '#6366f1'
  ]

  return {
    labels,
    datasets: [
      {
        data: labels.map((n) => counts[n].value),
        backgroundColor: labels.map(
          (n, index) => counts[n].color || defaultColors[index % defaultColors.length]
        ),
        borderColor: '#ffffff',
        borderWidth: 2
      }
    ]
  }
})

const scatterData = computed(() => {
  const dataPoints = filteredRecords.value.map((r) => {
    let hour = 12
    try {
      const timeStr = r.hora.replace(' AM', '').replace(' PM', '')
      const [h, m] = timeStr.split(':')
      hour = parseInt(h) + parseInt(m || 0) / 60
      if (r.hora.includes('PM') && hour < 12) hour += 12
      if (r.hora.includes('AM') && hour === 12) hour = 0
    } catch (e) {}
    return { x: hour, y: r.value }
  })
  return {
    datasets: [
      {
        label: 'Glucosa vs Hora del día',
        data: dataPoints,
        backgroundColor: '#c084fc',
        borderColor: '#a855f7',
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  }
})

const chartConfigs = computed(() => [
  {
    title: 'Tendencia Temporal',
    icon: '📈',
    component: LineChart,
    data: lineData.value,
    options: lineOptions
  },
  {
    title: 'Promedio Diario',
    icon: '📊',
    component: BarChart,
    data: barData.value,
    options: barOptions
  },
  {
    title: 'Distribución de Estados',
    icon: '🧭',
    component: PieChart,
    data: pieData.value,
    options: pieOptions
  },
  {
    title: 'Lecturas por Hora',
    icon: '⏱️',
    component: ScatterChart,
    data: scatterData.value,
    options: scatterOptions
  }
])

onMounted(() => {
  if (currentUserId.value) loadUserData()
})

</script>
