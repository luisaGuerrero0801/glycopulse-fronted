<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
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
import type { MomentoGlucometria } from '@/enums/momento-glucometria.enum'
import type { Glucometria } from '@/types/glucometria'

const storeGluco = useGlucometriasStore()
const auth = loginStore()
const userId = auth.getUserId()

const sortKey = ref<'fechaGlucometria' | 'hora' | 'nivelGlucometria'>('fechaGlucometria')
const sortOrder = ref<'ASC' | 'DESC'>('DESC')

function sortBy(key: typeof sortKey.value) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'ASC' ? 'DESC' : 'ASC'
  } else {
    sortKey.value = key
    sortOrder.value = 'ASC'
  }
}

// Computed: glucometrías ordenadas
const sortedGlucometrias = computed(() => {
  return [...storeGluco.glucometrias].sort((a, b) => {
    const valA = a[sortKey.value as keyof typeof a]
    const valB = b[sortKey.value as keyof typeof b]
    if (valA == null || valB == null) return 0
    if (valA < valB) return sortOrder.value === 'ASC' ? -1 : 1
    if (valA > valB) return sortOrder.value === 'ASC' ? 1 : -1
    return 0
  })
})

// Usa el composable pasándole la lista de glucometrías   esto es para paginado tambien
const { currentPage, itemsPerPage, paginatedItems, totalPages, goToPage } = usePagination(
  computed(() => sortedGlucometrias.value),
  4
)

const isModalVisible = ref(false)
const modalType = ref<'form' | 'info'>('form')

interface FormData {
  id: number | null
  fecha: string
  hora: string
  glucosa: number
  momento: MomentoGlucometria | ''
  comentario: string
}

const emptyForm: FormData = {
  id: null,
  fecha: '',
  hora: '',
  glucosa: 0,
  momento: '',
  comentario: ''
}

const form = ref<FormData>({ ...emptyForm })

const resetForm = () => {
  form.value = { ...emptyForm }
}

onMounted(() => {
  const userId = auth.getUserId()
  if (userId) {
    storeGluco.verGlucos(userId, { orderFechaHora: 'DESC' })
  }
})

const openModal = () => {
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

const glucometriaSeleccionada = ref<Glucometria | null>(null)

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
  try {
    const detalle = await storeGluco.verDetalleGlucometria(id)
    if (detalle) {
      form.value = {
        id: detalle.idGlucometria,
        fecha: parseApiFecha(detalle.fechaGlucometria),
        hora: detalle.hora,
        glucosa: detalle.nivelGlucometria,
        momento: detalle.momento || '',
        comentario: detalle.recomendacionGlucometria || ''
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
  if (isNaN(glucosa) || glucosa < 30 || glucosa > 600) {
    toast.error('El valor de glucosa debe estar entre 30 y 600 mg/dL.')
    return false
  }
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    if (form.value.id) {
      await storeGluco.actualizarGlucometria(form.value.id, {
        fechaGlucometria: form.value.fecha,
        horaGlucometria: form.value.hora,
        nivelGlucometria: form.value.glucosa,
        momento: form.value.momento
      })
    } else {
      await storeGluco.crearGlucometria(userId, {
        fechaGlucometria: form.value.fecha,
        hora: form.value.hora,
        nivelGlucometria: form.value.glucosa,
        momento: form.value.momento
      })
    }

    const userId = auth.getUserId()
    if (userId) {
      await storeGluco.verGlucos(userId, { orderFechaHora: 'DESC' })
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
      <ButtomNew nameButton="Nuevo" iconButton="add_circle" @click="openModal" />
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
            <!-- FECHA - mismo ancho que w-1/6 en la tabla -->
            <button
              class="text-left px-4 py-0 hover:bg-gray-200 transition-colors duration-150 rounded flex items-center gap-1 min-w-0"
              @click="sortBy('fechaGlucometria')"
            >
              <span class="truncate text-indigo-950 text-lg">FECHA</span>
              <span
                v-if="sortKey === 'fechaGlucometria'"
                class="text-indigo-950 flex-shrink-0 text-xl font-semibold"
              >
                {{ sortOrder === 'ASC' ? '↑' : '↓' }}
              </span>
            </button>

            <!-- HORA - mismo ancho que w-1/6 en la tabla -->
            <button
              class="text-left px-4 py-0 hover:bg-gray-200 transition-colors duration-150 rounded flex items-center gap-1 min-w-0"
              @click="sortBy('hora')"
            >
              <span class="truncate text-indigo-950 text-lg">HORA</span>
              <span
                v-if="sortKey === 'hora'"
                class="text-indigo-950 flex-shrink-0 text-xl font-semibold"
              >
                {{ sortOrder === 'ASC' ? '↑' : '↓' }}
              </span>
            </button>

            <!-- GLUCOMETRÍA - mismo ancho que w-1/6 en la tabla -->
            <button
              class="text-left px1 py-0 hover:bg-gray-200 transition-colors duration-150 rounded flex items-center gap-1 min-w-0"
              @click="sortBy('nivelGlucometria')"
            >
              <span class="truncate text-indigo-950 text-lg">GLUCOMETRÍA</span>
              <span
                v-if="sortKey === 'nivelGlucometria'"
                class="text-indigo-950 flex-shrink-0 text-xl font-semibold"
              >
                {{ sortOrder === 'ASC' ? '↑' : '↓' }}
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
          @editarGluco="editarGlucometria(g.idGlucometria)"
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
