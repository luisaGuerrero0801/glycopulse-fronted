<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavbarApp from '@/components/molecules/NavbarApp.vue'
import CardGlucometria from '@/components/molecules/glucometries/CardGlucometria.vue'
import PopUp from '@/components/molecules/glucometries/PopUp.vue'
import ProxGluco from '@/components/molecules/glucometries/ProxGluco.vue'
import FiltrosGluco from '@/components/molecules/glucometries/FiltrosGluco.vue'
import { useGlucometriasStore } from '@/stores/glucometrias/AllGlucometrias'
import Paginate from 'vuejs-paginate-next'
import { usePagination } from '@/composables/pagination/usePagination'
import type { Glucometria } from '@/types/glucometria'
// @ts-ignore
import { UserIcon } from '@heroicons/vue/20/solid'
import UserHeader from '@/components/molecules/UserHeader.vue'

// Router y params
const router = useRouter()
const route = useRoute()
const pacienteId = Number(route.params.id)

// Store
const storeGluco = useGlucometriasStore()
const glucometrias = computed(() => storeGluco.glucometrias)

// Nombre del paciente
const pacienteNombre = computed(() => {
  if (glucometrias.value.length > 0 && glucometrias.value[0].usuario) {
    return `${glucometrias.value[0].usuario.nombres} ${glucometrias.value[0].usuario.apellidos}`
  }
  return ''
})

// Filtros locales
const filtroFecha = ref<string>('')
const filtroRango = ref<string>('')

// Configuración de ordenamiento
const sortConfig = ref({
  fecha: null as 'ASC' | 'DESC' | null,
  hora: null as 'ASC' | 'DESC' | null,
  glucosa: null as 'ASC' | 'DESC' | null
})

// Función para convertir hora 12h AM/PM a segundos
function parseHora(hora: string | null | undefined): number {
  if (!hora) return Infinity
  const [time, modifier] = hora.split(' ')
  if (!time) return Infinity
  const [hStr, mStr] = time.split(':')
  let h = Number(hStr)
  const m = Number(mStr || 0)
  if (modifier?.toUpperCase() === 'PM' && h !== 12) h += 12
  if (modifier?.toUpperCase() === 'AM' && h === 12) h = 0
  return h * 3600 + m * 60
}

// Función para parsear fecha de la API a YYYY-MM-DD
function parseApiFecha(fechaApi: string): string {
  const partes = fechaApi.split(' ')
  if (partes.length !== 4) return ''
  const dia = partes[1]
  const mesStr = partes[2].toLowerCase()
  const año = partes[3]
  const meses: Record<string, string> = {
    ene: '01', feb: '02', mar: '03', abr: '04', may: '05', jun: '06',
    jul: '07', ago: '08', sep: '09', oct: '10', nov: '11', dic: '12'
  }
  const mes = meses[mesStr] || '01'
  return `${año}-${mes}-${dia.padStart(2, '0')}`
}

// Filtrar por fecha y rango
const filteredGlucometrias = computed(() => {
  return glucometrias.value.filter(g => {
    let ok = true
    if (filtroFecha.value) ok = ok && g.fechaGlucometria.includes(filtroFecha.value)
    if (filtroRango.value && filtroRango.value !== 'no') ok = ok && g.momento === filtroRango.value
    return ok
  })
})

// Ordenar localmente
const sortedGlucometrias = computed(() => {
  return [...filteredGlucometrias.value].sort((a, b) => {
    if (sortConfig.value.fecha) {
      const fechaA = new Date(parseApiFecha(a.fechaGlucometria))
      const fechaB = new Date(parseApiFecha(b.fechaGlucometria))
      return sortConfig.value.fecha === 'ASC'
        ? fechaA.getTime() - fechaB.getTime()
        : fechaB.getTime() - fechaA.getTime()
    }
    if (sortConfig.value.hora) {
      const horaA = parseHora(a.horaGlucometria)
      const horaB = parseHora(b.horaGlucometria)
      return sortConfig.value.hora === 'ASC' ? horaA - horaB : horaB - horaA
    }
    if (sortConfig.value.glucosa) {
      return sortConfig.value.glucosa === 'ASC'
        ? a.nivelGlucometria - b.nivelGlucometria
        : b.nivelGlucometria - a.nivelGlucometria
    }
    return 0
  })
})

// Paginación
const { paginatedItems, totalPages, goToPage } = usePagination(sortedGlucometrias, 4)

// Toggle sort
function toggleSort(key: 'fecha' | 'hora' | 'glucosa') {
  if (sortConfig.value[key] === 'ASC') sortConfig.value[key] = 'DESC'
  else if (sortConfig.value[key] === 'DESC') sortConfig.value[key] = null
  else sortConfig.value[key] = 'ASC'
}

// Modal
const isModalVisible = ref(false)
const glucometriaSeleccionada = ref<Glucometria | null>(null)

const verDetalleGlucometria = async (idGlucometria: number) => {
  try {
    const data = await storeGluco.verDetalleGlucometria(idGlucometria)
    glucometriaSeleccionada.value = data ?? null
    isModalVisible.value = true
  } catch (error) {
    console.error(error)
  }
}

const closeModal = () => {
  isModalVisible.value = false
  glucometriaSeleccionada.value = null
}

const volver = () => router.push('/doctor/pacientes')

onMounted(() => {
  if (pacienteId) storeGluco.verGlucos(pacienteId, { orderFecha: 'DESC' })
})
</script>

<template>
  <div class="flex">
    <!-- Sidebar -->
    <div class="w-64">
      <NavbarApp :links="[{ name: 'Pacientes', to: '/doctor/pacientes', icon: UserIcon }]" />
    </div>

    <!-- Contenido principal -->
    <div class="flex-1 p-8 ml-12 mr-6">
      <!-- Header general -->
      <UserHeader :pagename="'Panel de Control'" />

      <!-- Título del paciente y botón centrado -->
      <div class="flex items-center justify-between mt-14 mb-4">
        <h2 class="text-4xl font-bold text-indigo-950 mb-4">
          Glucometrías del paciente {{ pacienteNombre || pacienteId }}
        </h2>
        <button
          @click="volver"
          class="bg-indigo-950 hover:bg-gray-200 text-white px-5 py-3 rounded-lg text-lg font-medium"
        >
          ← Volver
        </button>
      </div>

      <!-- Próxima glucosa y filtros -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ProxGluco :pacienteId="pacienteId" />
        <FiltrosGluco
          :pacienteId="pacienteId"
          class="col-span-2"
          v-model:fecha="filtroFecha"
          v-model:rango="filtroRango"
        />
      </div>

      <!-- Estados de carga / error / sin registros / tabla -->
      <div>
        <div v-if="storeGluco.loading" class="text-gray-600 mb-4">
          Cargando glucometrías...
        </div>
        <div v-else-if="storeGluco.error" class="text-red-600 mb-4">
          {{ storeGluco.error }}
        </div>
        <div v-else-if="!storeGluco.glucometrias || storeGluco.glucometrias.length === 0" class="text-gray-500 italic">
          No hay registros de glucometrías.
        </div>

        <div v-else>
          <!-- Tabla encabezado -->
          <div class="hidden md:block bg-gray-50 p-4 rounded-2xl shadow mb-4">
            <div class="grid" style="grid-template-columns: 0.9fr 0.8fr 0.8fr 2fr 1fr">
              <button
                class="text-left px-4 py-0 hover:bg-gray-200 transition-colors duration-150 rounded flex items-center gap-1 min-w-0"
                @click="toggleSort('fecha')"
              >
                <span class="truncate text-indigo-950 text-lg">FECHA</span>
                <span v-if="sortConfig.fecha" class="text-indigo-950 flex-shrink-0 text-xl font-semibold">
                  {{ sortConfig.fecha === 'ASC' ? '↑' : '↓' }}
                </span>
              </button>

              <button
                class="text-left px-4 py-0 hover:bg-gray-200 transition-colors duration-150 rounded flex items-center gap-1 min-w-0"
                @click="toggleSort('hora')"
              >
                <span class="truncate text-indigo-950 text-lg">HORA</span>
                <span v-if="sortConfig.hora" class="text-indigo-950 flex-shrink-0 text-xl font-semibold">
                  {{ sortConfig.hora === 'ASC' ? '↑' : '↓' }}
                </span>
              </button>

              <button
                class="text-left px-4 py-0 hover:bg-gray-200 transition-colors duration-150 rounded flex items-center gap-1 min-w-0"
                @click="toggleSort('glucosa')"
              >
                <span class="truncate text-indigo-950 text-lg">GLUCOMETRÍA</span>
                <span v-if="sortConfig.glucosa" class="text-indigo-950 flex-shrink-0 text-xl font-semibold">
                  {{ sortConfig.glucosa === 'ASC' ? '↑' : '↓' }}
                </span>
              </button>

              <div class="text-left px-1 py-0">
                <span class="truncate text-indigo-950 text-lg">RECOMENDACIÓN</span>
              </div>

              <div class="text-center px-4 py-0">
                <span class="truncate text-indigo-950 text-lg">ACCIONES</span>
              </div>
            </div>
          </div>

          <!-- Cards -->
          <div class="grid grid-cols-1 gap-2">
            <CardGlucometria
              v-for="g in paginatedItems"
              :key="g.idGlucometria"
              :id="g.idGlucometria"
              :fecha="g.fechaGlucometria"
              :hora="g.horaGlucometria || ''"
              :glucosa="g.nivelGlucometria"
              :comentario="g.recomendaciones.find(r => r.tipoRecomendacion.toLowerCase() === 'general')?.descripcionRecomendacion || ''"
              :mostrar-editar="false"
              :mostrar-ver="true"
              @verGluco="verDetalleGlucometria(g.idGlucometria)"
            />
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div class="flex justify-center mt-6 mb-6">
        <paginate
          :page-count="totalPages"
          :click-handler="goToPage"
          :prev-text="'Anterior'"
          :next-text="'Siguiente'"
          :container-class="'flex flex-wrap justify-center gap-2'"
          :page-class="'px-4 py-2 border rounded cursor-pointer text-sm text-gray-700 hover:bg-gray-200 transition'"
          :active-class="'bg-blue-600 text-white font-semibold'"
        />
      </div>

      <!-- Modal detalles -->
      <PopUp
        :isVisible="isModalVisible"
        :modalType="'info'"
        :glucometria="glucometriaSeleccionada"
        @closeModal="closeModal"
      />
    </div>
  </div>
</template>
