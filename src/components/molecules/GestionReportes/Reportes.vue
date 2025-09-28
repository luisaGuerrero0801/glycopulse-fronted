<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
    <!-- Header & Filters -->
    <header class="mb-8">
      <h1 class="text-4xl font-extrabold text-indigo-700 mb-4 text-center">
        Informe de Glucosa
      </h1>
      <div
        class="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg flex flex-wrap items-end gap-4"
      >
        <div class="flex-1 min-w-[160px]">
          <label for="from" class="block text-gray-600 mb-1">Desde</label>
          <input
            id="from"
            type="date"
            v-model="filters.startDate"
            class="w-full border border-indigo-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div class="flex-1 min-w-[160px]">
          <label for="to" class="block text-gray-600 mb-1">Hasta</label>
          <input
            id="to"
            type="date"
            v-model="filters.endDate"
            class="w-full border border-indigo-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <button
          @click="filterRecords"
          class="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Aplicar filtros
        </button>
      </div>
    </header>

    <!-- Gráficos y tabla -->
    <main class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <!-- Mensaje si no hay datos disponibles -->
      <div v-if="!filteredRecords.length" class="lg:col-span-3 text-center py-10 text-gray-500 bg-white rounded-xl shadow-lg">
          <p class="mt-2 font-semibold">No hay datos de glucosa disponibles para mostrar.</p>
          <p class="text-sm italic">Intente cambiar los filtros o revise si se cargaron los datos de prueba.</p>
      </div>

      <template v-else>
        <!-- Charts -->
        <div
          v-for="(chart, idx) in chartConfigs"
          :key="idx"
          :class="[ 'bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition',
            chart.title === 'Lecturas por Hora' ? 'lg:col-start-3 lg:row-start-1' : '' ]"
        >
          <div class="flex items-center mb-3">
            <span class="text-2xl mr-2">{{ chart.icon }}</span>
            <h2 class="text-xl font-semibold text-gray-700">{{ chart.title }}</h2>
          </div>
          <div class="h-56">
            <component
              :is="chart.component"
              :data="chart.data"
              :options="chart.options"
            />
          </div>
        </div>

        <!-- Tabla -->
        <section
          class="bg-white rounded-2xl shadow-lg overflow-auto col-span-1 md:col-span-2 lg:col-start-1 lg:col-span-2 lg:row-start-2 p-6"
        >
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-700">Registros</h3>
            <span class="text-sm text-gray-500">Mostrando {{ filteredRecords.length }} registros</span>
          </div>

          <div class="w-full">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-indigo-100">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-medium text-indigo-700">Fecha</th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-indigo-700">Hora</th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-indigo-700">Glucosa (mg/dL)</th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-indigo-700">Estado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr
                  v-for="rec in filteredRecords"
                  :key="rec.id"
                  class="hover:bg-indigo-50 transition"
                >
                  <td class="px-6 py-4">{{ formatDate(rec.datetime) }}</td>
                  <td class="px-6 py-4">{{ formatTime(rec.datetime) }}</td>
                  <td class="px-6 py-4">{{ rec.value }}</td>
                  <td class="px-6 py-4">
                    <span :class="statusClass(rec.value)">
                      {{ determineStatus(rec.value) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<script>
// No se necesita importar axios ni Pinia en esta versión con datos estáticos
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
import { Line, Bar, Pie, Scatter } from 'vue-chartjs'

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

// Datos de prueba estáticos para que los gráficos aparezcan
const MOCK_RECORDS = [
  // Fecha: 2025-09-20
  { id: 1, datetime: '2025-09-20T08:00:00', value: 110 },
  { id: 2, datetime: '2025-09-20T12:30:00', value: 155 },
  { id: 3, datetime: '2025-09-20T18:45:00', value: 95 },
  { id: 4, datetime: '2025-09-20T22:00:00', value: 65 }, // Baja

];


export default {
  name: 'GlucoReportNew',
  components: {
    LineChart: Line,
    BarChart: Bar,
    PieChart: Pie,
    ScatterChart: Scatter,
  },
  data() {
    return {
      filters: { startDate: '', endDate: '' },
      records: MOCK_RECORDS.map(r => ({
          ...r, 
          // Convertimos la fecha ISO a un objeto Date para facilitar la manipulación
          datetime: new Date(r.datetime)
      })),
      filteredRecords: [], // Inicialmente vacío, se llenará en mounted
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: false, }
        }
      },
    }
  },
  computed: {
    // --- Configuraciones de Gráficos ---
    chartConfigs() {
      return [
        { title: 'Tendencia Temporal', icon: '📈', component: 'LineChart', data: this.lineData, 
          options: { ...this.chartOptions, scales: { x: { grid: { display: false } }, y: { beginAtZero: false } } } 
        },
        { title: 'Promedio Diario', icon: '📊', component: 'BarChart', data: this.barData, options: this.chartOptions },
        { title: 'Estados', icon: '🧭', component: 'PieChart', data: this.pieData, options: this.chartOptions },
        { title: 'Lecturas por Hora', icon: '⏱️', component: 'ScatterChart', data: this.scatterData, 
          options: { ...this.chartOptions, scales: { x: { type: 'linear', position: 'bottom', title: { display: true, text: 'Hora del Día (0-24)' } }, y: { beginAtZero: false } } } 
        },
      ]
    },
    
    lineData() {
      return {
        labels: this.filteredRecords.map(r => this.formatDateShort(r.datetime)),
        datasets: [{ 
            label: 'Glucosa (mg/dL)', 
            data: this.filteredRecords.map(r => r.value), 
            borderColor: '#5c6ac4', 
            backgroundColor: 'rgba(92, 106, 196, 0.2)', 
            tension: 0.4, 
            fill: true 
        }]
      }
    },
    
    barData() {
      const map = {}
      this.filteredRecords.forEach(r => {
        const day = r.datetime.toLocaleDateString('es-ES')
        map[day] = map[day] || []
        map[day].push(r.value)
      })
      const dailyAverages = Object.entries(map).map(([day, vals]) => ({
        day,
        avg: (vals.reduce((a, b) => a + b, 0) / vals.length), 
      }))

      return {
        labels: dailyAverages.map(d => d.day),
        datasets: [{ 
            label: 'Promedio mg/dL', 
            data: dailyAverages.map(d => d.avg), 
            backgroundColor: '#8b5cf6', 
            borderRadius: 4 
        }]
      }
    },
    
    pieData() {
      const counts = { Baja: 0, Normal: 0, Alta: 0 }
      this.filteredRecords.forEach(r => {
        if (r.value < 70) counts.Baja++
        else if (r.value > 140) counts.Alta++
        else counts.Normal++
      })
      const statusDistribution = [
        { name: 'Baja (< 70)', value: counts.Baja, color: '#ef4444' },
        { name: 'Normal (70-140)', value: counts.Normal, color: '#10b981' },
        { name: 'Alta (> 140)', value: counts.Alta, color: '#f59e0b' }, 
      ].filter(s => s.value > 0) 

      return {
        labels: statusDistribution.map(s => s.name),
        datasets: [{ 
            data: statusDistribution.map(s => s.value), 
            backgroundColor: statusDistribution.map(s => s.color) 
        }]
      }
    },
    
    scatterData() {
      return {
        datasets: [{
          label: 'Glucosa vs Hora',
          data: this.filteredRecords.map(r => {
            // Calculamos la hora con minutos como decimal (ej: 8:30 = 8.5)
            return { x: r.datetime.getHours() + r.datetime.getMinutes() / 60, y: r.value }
          }),
          backgroundColor: '#c084fc',
          pointRadius: 6,
          pointHoverRadius: 8,
        }]
      }
    },
  },
  methods: {
    // Definición de estado de glucosa
    determineStatus(v) {
      if (v < 70) return 'Baja'
      if (v > 140) return 'Alta'
      return 'Normal'
    },

    formatDate(dt) {
      // Usamos toLocaleDateString en el objeto Date
      return dt.toLocaleDateString('es-ES')
    },
    formatDateShort(dt) {
      return dt.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
    },
    formatTime(dt) {
      // Usamos toLocaleTimeString en el objeto Date
      return dt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    },
    statusClass(v) {
      if (v < 70) return 'inline-block px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'
      if (v > 140) return 'inline-block px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800'
      return 'inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'
    },
    
    filterRecords() {
      const { startDate, endDate } = this.filters
      
      // Convertimos las fechas de filtro a timestamp al inicio y fin del día
      const start = startDate ? new Date(startDate).getTime() : 0
      const end = endDate ? new Date(endDate + 'T23:59:59').getTime() : Infinity 
      
      this.filteredRecords = this.records
        .filter(r => {
            const timestamp = r.datetime.getTime()
            return (timestamp >= start) && (timestamp <= end)
        })
        .sort((a, b) => a.datetime - new Date(b.datetime)) 
    },
  },
  mounted() {
    // Cargamos todos los datos iniciales para que la tabla y gráficos aparezcan
    this.filterRecords() 
  },
}
</script>
