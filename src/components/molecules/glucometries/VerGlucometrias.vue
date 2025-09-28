<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import ButtomNew from '../../atoms/ButtomNew.vue'
import CardGlucometria from './CardGlucometria.vue'
import PopUp from '@/components/molecules/glucometries/PopUp.vue'
import ProxGluco from '@/components/molecules/glucometries/ProxGluco.vue'
import FiltrosGluco from '@/components/molecules/glucometries/FiltrosGluco.vue'
import { loginStore } from '@/stores/login'
import { useGlucometriasStore } from '@/stores/glucometrias/AllGlucometrias'
import { toast } from 'vue3-toastify'
import Paginate from 'vuejs-paginate-next' /** esto se importa para paginado */
import { usePagination } from '@/composables/pagination/usePagination'
import type { Glucometria } from '@/types/glucometria'

const props = defineProps<{
  pacienteId?: number
}>()

const storeGluco = useGlucometriasStore()
const auth = loginStore()
const userId = auth.getUserId()
const userRol = auth.getRol()

const idParaCargar = computed(() => props.pacienteId || userId)

/** ---------- ORDEN Y PAGINACIÓN ---------- */
const sortConfig = ref({
  fecha: null as 'ASC' | 'DESC' | null,
  hora: null as 'ASC' | 'DESC' | null,
  glucosa: null as 'ASC' | 'DESC' | null
})

function toggleSort(key: 'fecha' | 'hora' | 'glucosa') {
  // Si ya tiene valor ASC -> cambia a DESC
  if (sortConfig.value[key] === 'ASC') {
    sortConfig.value = { fecha: null, hora: null, glucosa: null }
    sortConfig.value[key] = 'DESC'
  }
  // Si ya tiene valor DESC -> limpia (quita orden)
  else if (sortConfig.value[key] === 'DESC') {
    sortConfig.value = { fecha: null, hora: null, glucosa: null }
  }
  // Si no tiene nada -> activa ASC
  else {
    sortConfig.value = { fecha: null, hora: null, glucosa: null }
    sortConfig.value[key] = 'ASC'
  }
}

const glucometrias = computed(() => storeGluco.glucometrias)

function parseHora(hora: string | null | undefined): number {
  if (!hora) return Infinity // sin hora → al final
  const [h, m, s] = hora.split(':').map(Number)
  return (h || 0) * 3600 + (m || 0) * 60 + (s || 0)
}

function parseApiFecha(fechaApi: string): string {
  const partes = fechaApi.split(' ')
  if (partes.length !== 4) return ''
  const dia = partes[1]
  const mesStr = partes[2].toLowerCase()
  const año = partes[3]
  const meses: Record<string, string> = {
    ene: '01',
    feb: '02',
    mar: '03',
    abr: '04',
    may: '05',
    jun: '06',
    jul: '07',
    ago: '08',
    sep: '09',
    oct: '10',
    nov: '11',
    dic: '12'
  }
  const mes = meses[mesStr] || '01'
  return `${año}-${mes}-${dia.padStart(2, '0')}`
}

const sortedGlucometrias = computed(() => {
  return [...glucometrias.value].sort((a, b) => {
    // FECHA
    if (sortConfig.value.fecha) {
      const fechaA = new Date(parseApiFecha(a.fechaGlucometria))
      const fechaB = new Date(parseApiFecha(b.fechaGlucometria))
      return sortConfig.value.fecha === 'ASC'
        ? fechaA.getTime() - fechaB.getTime()
        : fechaB.getTime() - fechaA.getTime()
    }

    // HORA
    if (sortConfig.value.hora) {
      const horaA = parseHora(a.horaGlucometria)
      const horaB = parseHora(b.horaGlucometria)
      return sortConfig.value.hora === 'ASC' ? horaA - horaB : horaB - horaA
    }

    // GLUCOMETRÍA
    if (sortConfig.value.glucosa) {
      return sortConfig.value.glucosa === 'ASC'
        ? a.nivelGlucometria - b.nivelGlucometria
        : b.nivelGlucometria - a.nivelGlucometria
    }

    return 0
  })
})
// Usa el composable pasándole la lista de glucometrías   esto es para paginado tambien
const { currentPage, itemsPerPage, paginatedItems, totalPages, goToPage } = usePagination(
  computed(() => sortedGlucometrias.value),
  4
)

/** ---------- MODAL Y FORMULARIO ---------- */
const isModalVisible = ref(false)
const modalType = ref<'form' | 'info'>('form')
const glucometriaSeleccionada = ref<Glucometria | null>(null)

interface FormData {
  id: number | null
  fecha: string
  hora: string
  glucosa: number
  momento: string
}

const emptyForm: FormData = {
  id: null,
  fecha: '',
  hora: '',
  glucosa: 0,
  momento: ''
}

const form = ref<FormData>({ ...emptyForm })

const resetForm = () => {
  form.value = { ...emptyForm }
}

onMounted(() => {
  if (idParaCargar.value) storeGluco.verGlucos(idParaCargar.value, { orderFecha: 'DESC' })
})

const openModal = () => {
  if (userRol === 'doctor') return
  isModalVisible.value = true
  modalType.value = 'form'
  glucometriaSeleccionada.value = null
  resetForm()
}

const closeModal = () => {
  isModalVisible.value = false
  glucometriaSeleccionada.value = null
  resetForm()
}

const verDetalleGlucometria = async (idGlucometria: number) => {
  try {
    const data = await storeGluco.verDetalleGlucometria(idGlucometria)
    glucometriaSeleccionada.value = data ?? null
    modalType.value = 'info'
    isModalVisible.value = true
  } catch (error) {
    toast.error('Error al obtener detalles de la glucometría.')
    console.error(error)
  }
}

/** Carga la glucometría para editar en modal formulario */
const editarGlucometria = async (id: number) => {
  if (userRol === 'doctor') return
  try {
    const detalle = await storeGluco.verDetalleGlucometria(id)
    if (detalle) {
      form.value = {
        id: detalle.idGlucometria,
        fecha: parseApiFecha(detalle.fechaGlucometria),
        hora: detalle.horaGlucometria,
        glucosa: detalle.nivelGlucometria,
        momento: detalle.momento || ''
      }
      modalType.value = 'form'
      isModalVisible.value = true
    }
  } catch (error) {
    toast.error('Error al cargar la glucometría para edición.')
    console.error(error)
  }
}

const validateForm = (): boolean => {
  if (!form.value.fecha || !form.value.hora || !form.value.glucosa || !form.value.momento) {
    toast.error('Por favor, complete todos los campos correctamente.')
    return false
  }
  const glucosa = Number(form.value.glucosa)
  if (isNaN(glucosa) || glucosa < 30 || glucosa > 700) {
    toast.error('El valor de glucosa debe estar entre 30 y 700 mg/dL.')
    return false
  }
  if (!form.value.momento) {
    toast.error('Debe seleccionar el momento de la glucometría.')
    return false
  }
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return
  if (!userId) {
    return toast.error('Usuario no autenticado.')
  }

  try {
    if (form.value.id) {
      await storeGluco.actualizarGlucometria(userId, form.value.id, {
        fechaGlucometria: form.value.fecha,
        horaGlucometria: form.value.hora,
        nivelGlucometria: form.value.glucosa,
        momento: String(form.value.momento)
      })
    } else {
      await storeGluco.crearGlucometria(userId, {
        fechaGlucometria: form.value.fecha,
        horaGlucometria: form.value.hora,
        nivelGlucometria: form.value.glucosa,
        momento: String(form.value.momento)
      })
    }
    if (idParaCargar.value) {
      await storeGluco.verGlucos(idParaCargar.value, { orderFecha: 'DESC' })
    }
    resetForm()
    closeModal()
  } catch (error) {
    toast.error('Ocurrió un error al guardar la glucometría.')
    console.error(error)
  }
}
</script>

<template>
  <section class="px-8 py-6 w-full mx-auto">
    <!-- Título y botón de nueva glucometría -->
    <div class="flex justify-between items-center w-full px-4">
      <span class="text-4xl font-semibold text-indigo-950 truncate">Glucometrías</span>
      <ButtomNew
        v-if="userRol !== 'doctor'"
        nameButton="Nuevo"
        iconButton="add_circle"
        @click="openModal"
      />
    </div>

    <!-- Próxima glucosa y filtros -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mx-2 mt-6 mb-6">
      <ProxGluco />
      <FiltrosGluco class="col-span-2" />
    </div>

    <hr class="border-t-2 border-gray-200 mb-6" />

    <!-- Estado de carga -->
    <div v-if="storeGluco.loading" class="text-gray-600">Cargando glucometrías...</div>
    <div v-else-if="storeGluco.error" class="text-red-600">{{ storeGluco.error }}</div>

    <!-- Tabla de glucometrías -->
    <div v-else>
      <!-- Encabezado tipo tabla-->
      <div
        class="hidden md:block bg-gray-50 p-5 sm:p-6 rounded-2xl shadow-md mb-4 overflow-hidden w-full"
      >
        <div class="w-full text-left text-base font-semibold text-indigo-950">
          <div class="grid" style="grid-template-columns: 0.9fr 0.8fr 0.8fr 2fr 1fr">
            <!-- FECHA -->
            <button
              class="text-left px-4 py-0 hover:bg-gray-200 transition-colors duration-150 rounded flex items-center gap-1 min-w-0"
              @click="toggleSort('fecha')"
            >
              <span class="truncate text-indigo-950 text-lg">FECHA</span>
              <span
                v-if="sortConfig.fecha"
                class="text-indigo-950 flex-shrink-0 text-xl font-semibold"
              >
                {{ sortConfig.fecha === 'ASC' ? '↑' : '↓' }}
              </span>
            </button>

            <!-- HORA - mismo ancho que w-1/6 en la tabla -->
            <button
              class="text-left px-4 py-0 hover:bg-gray-200 transition-colors duration-150 rounded flex items-center gap-1 min-w-0"
              @click="toggleSort('hora')"
            >
              <span class="truncate text-indigo-950 text-lg">HORA</span>
              <span
                v-if="sortConfig.hora"
                class="text-indigo-950 flex-shrink-0 text-xl font-semibold"
              >
                {{ sortConfig.hora === 'ASC' ? '↑' : '↓' }}
              </span>
            </button>

            <!-- GLUCOMETRÍA -->
            <button
              class="text-left px-1 py-0 hover:bg-gray-200 transition-colors duration-150 rounded flex items-center gap-1 min-w-0"
              @click="toggleSort('glucosa')"
            >
              <span class="truncate text-lg text-indigo-950">GLUCOMETRÍA</span>
              <span
                v-if="sortConfig.glucosa"
                class="text-indigo-950 flex-shrink-0 text-xl font-semibold"
              >
                {{ sortConfig.glucosa === 'ASC' ? '↑' : '↓' }}
              </span>
            </button>
            <!-- RECOMENDACIÓN - mismo ancho que w-1/3 en la tabla -->
            <div class="text-left px-1 py-0">
              <span class="truncate text-lg text-indigo-950">RECOMENDACIÓN</span>
            </div>

            <!-- ACCIONES - mismo ancho que la columna de botones (px-16) -->
            <div class="text-center px-16 py-0">
              <span class="truncate text-lg text-indigo-950">ACCIONES</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tarjetas de glucometrías -->
      <div class="grid grid-cols-1 gap-2 mt-2">
        <CardGlucometria
          v-for="g in paginatedItems"
          :key="g.idGlucometria"
          :id="g.idGlucometria"
          :fecha="g.fechaGlucometria"
          :hora="g.horaGlucometria || ''"
          :glucosa="g.nivelGlucometria"
          :comentario="
            g.recomendaciones.find((r) => r.tipoRecomendacion.toLowerCase() === 'general')
              ?.descripcionRecomendacion || ''
          "
          @verGluco="verDetalleGlucometria(g.idGlucometria)"
          @editarGluco="userRol !== 'doctor' ? editarGlucometria(g.idGlucometria) : null"
          :disableEdit="userRol === 'doctor'"
        />
      </div>
    </div>

    <!-- Paginación abajo -->
    <div class="flex justify-center mt-6">
      <paginate
        :page-count="totalPages"
        :click-handler="goToPage"
        :prev-text="'Anterior'"
        :next-text="'Siguiente'"
        :container-class="'flex space-x-2'"
        :page-class="'px-4 py-2 border rounded cursor-pointer text-lg  text-gray-300 font-bold hover:bg-[var(--colorSecundarioButton)] transition'"
        :active-class="'bg-[var(--colorPrimarioButton)] text-[var(--colorBlanco)] font-semibold'"
        :prev-class="'px-4 py-2 border rounded cursor-pointer text-lg text-gray-700 hover:bg-gray-200 transition'"
        :next-class="'px-4 py-2 border rounded cursor-pointer text-lg text-gray-700 hover:bg-gray-200 transition'"
      />
    </div>

    <PopUp
      :isVisible="isModalVisible"
      :modalType="modalType"
      v-model:form="form"
      :glucometria="glucometriaSeleccionada"
      :submitForm="handleSubmit"
      @closeModal="closeModal"
    />
  </section>
</template>
