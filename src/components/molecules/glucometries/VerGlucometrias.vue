<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import ButtomNew from '../../atoms/ButtomNew.vue'
import CardGlucometria from './CardGlucometria.vue'
import PopUp from '@/components/molecules/glucometries/PopUp.vue'
import { useGlucometriasStore } from '@/stores/AllGlucometrias'
import { toast } from 'vue3-toastify'
import Paginate from 'vuejs-paginate-next'   /** esto se importa para paginado */
import { usePagination } from '@/composables/pagination/usePagination'

const storeGluco = useGlucometriasStore()

// Usa el composable pasándole la lista de glucometrías   esto es para paginado tambien
const { currentPage, itemsPerPage, paginatedItems, totalPages, goToPage } = usePagination(
  computed(() => storeGluco.glucometrias),
  5 
)

const isModalVisible = ref(false)
const modalType = ref<'form' | 'info'>('form')


/** Convierte la fecha de API a formato YYYY-MM-DD */
function parseApiFecha(fechaApi: string): string {
  const partes = fechaApi.split(' ')
  if (partes.length !== 4) return ''

  const dia = partes[1]
  const mesStr = partes[2].toLowerCase()
  const año = partes[3]

  const meses: Record<string, string> = {
    ene: '01', feb: '02', mar: '03', abr: '04',
    may: '05', jun: '06', jul: '07', ago: '08',
    sep: '09', oct: '10', nov: '11', dic: '12'
  }

  const mes = meses[mesStr] || '01'
  return `${año}-${mes}-${dia.padStart(2, '0')}`
}

interface FormData {
  id: number | null
  fecha: string
  hora: string
  glucosa: number
  comentario: string
}

const emptyForm: FormData = {
  id: null,
  fecha: '',
  hora: '',
  glucosa: 0,
  comentario: ''
}

const form = ref<FormData>({ ...emptyForm })

const resetForm = () => {
  form.value = { ...emptyForm }
}

onMounted(() => {
  storeGluco.verGlucos()
})

const openModal = () => {
  isModalVisible.value = true
  modalType.value = 'form'
  resetForm()
}

const closeModal = () => {
  isModalVisible.value = false
  resetForm()
}

/** Muestra detalles de una glucometría en modal solo lectura */
const verDetalleGlucometria = async (id: number) => {
  try {
    const detalle = await storeGluco.verDetalleGlucometria(id)

    if (detalle) {
      form.value = {
        id: detalle.idGlucometria,
        fecha: detalle.fechaGlucometria,
        hora: detalle.hora,
        glucosa: detalle.nivelGlucometria,
        comentario: detalle.recomendacionGlucometria || ''
      }

      modalType.value = 'info'
      isModalVisible.value = true
    }
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

/** Valida el formulario antes de enviar */
function validateForm(): boolean {
  if (!form.value.fecha || !form.value.hora || form.value.glucosa <= 0) {
    toast.error('Por favor, complete todos los campos correctamente.')
    return false
  }

  if (isNaN(form.value.glucosa)) {
    toast.error('Por favor, ingrese un valor numérico válido para la glucosa.')
    return false
  }

  const glucosa = Number(form.value.glucosa)
  if (glucosa < 30 || glucosa > 600) {
    toast.error('El valor de glucosa debe estar entre 30 y 600 mg/dL.')
    return false
  }

  return true
}

/** Maneja el envío del formulario, crea o actualiza registro */
const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    if (form.value.id) {
      await storeGluco.actualizarGlucometria(form.value.id, {
        fechaGlucometria: form.value.fecha,
        horaGlucometria: form.value.hora,
        nivelGlucometria: form.value.glucosa
      })
    } else {
      await storeGluco.crearGlucometria({
        fechaGlucometria: form.value.fecha,
        horaGlucometria: form.value.hora,
        nivelGlucometria: form.value.glucosa
      })
    }

    await storeGluco.verGlucos()
    resetForm()
    closeModal()
  } catch (error) {
    toast.error('Ocurrió un error al guardar la glucometría.')
    console.error(error)
  }
}
</script>

<template>
  <section class="px-12 py-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-4">
      <h1 class="titulo font-semibold text-gray-800">Glucometrías</h1>
      <ButtomNew nameButton="Nuevo" iconButton="add_circle" @click="openModal" />
    </div>

    <hr class="border-t-2 border-gray-200 mb-6" />

    <div v-if="storeGluco.loading" class="text-gray-600">Cargando glucometrías...</div>
    <div v-else-if="storeGluco.error" class="text-red-600">{{ storeGluco.error }}</div>

    <div v-else>
      <!-- Usa paginatedItems del composable en lugar de paginatedGlucometrias -->
      <CardGlucometria
        v-for="(g) in paginatedItems"
        :key="g.idGlucometria"
        :id="g.idGlucometria"
        :fecha="g.fechaGlucometria"
        :hora="g.hora || ''"
        :glucosa="g.nivelGlucometria"
        :comentario="g.recomendacionGlucometria || ''"
        @verGluco="verDetalleGlucometria(g.idGlucometria)"
        @editarGluco="editarGlucometria(g.idGlucometria)"
      />
    </div>

    <!-- Paginación abajo -->
    <div class="flex justify-center mt-6">
      <paginate
        :page-count="totalPages"
        :click-handler="goToPage"
        :prev-text="'Anterior'"
        :next-text="'Siguiente'"
        :container-class="'flex space-x-2'"
        :page-class="'px-4 py-2 border rounded cursor-pointer text-sm text-[var(--colorBlanco)] font-bold hover:bg-[var(--colorSecundarioButton)] transition'"
        :active-class="'bg-[var(--colorPrimarioButton)] text-[var(--colorBlanco)] font-semibold'"
        :prev-class="'px-4 py-2 border rounded cursor-pointer text-sm text-gray-700 hover:bg-gray-200 transition'"
        :next-class="'px-4 py-2 border rounded cursor-pointer text-sm text-gray-700 hover:bg-gray-200 transition'"
      />
    </div>

    <PopUp
      :isVisible="isModalVisible"
      :modalType="modalType"
      v-model:form="form"
      :submitForm="handleSubmit"
      @closeModal="closeModal"
    />
  </section>
</template>