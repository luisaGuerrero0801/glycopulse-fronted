<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGlucometriasStore } from '@/stores/glucometrias/AllGlucometrias'
import CardGlucometria from '@/components/molecules/glucometries/CardGlucometria.vue'
import Paginate from 'vuejs-paginate-next'
import { usePagination } from '@/composables/pagination/usePagination'



const storeGluco = useGlucometriasStore()
const glucometrias = computed(() => storeGluco.glucometrias)

const { currentPage, itemsPerPage, paginatedItems, totalPages, goToPage } = usePagination(
  computed(() => glucometrias.value),
  4
)
const props = defineProps<{
  pacienteId: number
}>()

onMounted(() => {
  if (props.pacienteId) {
    storeGluco.verGlucos(props.pacienteId, { orderFecha: 'DESC' })
  }
})

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
  return `${año}-${mes}-${dia.padStart(2,'0')}`
}
</script>

<template>
  <section class="px-8 py-6 w-full mx-auto">
    <h2 class="text-3xl font-semibold text-indigo-950 mb-6">Glucometrías del paciente</h2>

    <div v-if="storeGluco.loading" class="text-gray-600">Cargando glucometrías...</div>
    <div v-else-if="storeGluco.error" class="text-red-600">{{ storeGluco.error }}</div>

    <div v-else>
      <div class="grid grid-cols-1 gap-2 mt-2">
        <CardGlucometria
          v-for="g in paginatedItems"
          :key="g.idGlucometria"
          :id="g.idGlucometria"
          :fecha="g.fechaGlucometria"
          :hora="g.horaGlucometria || ''"
          :glucosa="g.nivelGlucometria"
          :comentario="g.recomendaciones.find(r => r.tipoRecomendacion.toLowerCase() === 'general')?.descripcionRecomendacion || ''"
        />
      </div>

      <div class="flex justify-center mt-6">
        <paginate
          :page-count="totalPages"
          :click-handler="goToPage"
          :prev-text="'Anterior'"
          :next-text="'Siguiente'"
        />
      </div>
    </div>
  </section>
</template>
