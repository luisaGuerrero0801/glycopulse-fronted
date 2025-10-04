<script lang="ts" setup>
import { ref, onMounted, watch, defineProps } from 'vue'
import { loginStore } from '@/stores/login'
import { useGlucometriasStore } from '@/stores/glucometrias/AllGlucometrias'
import { toast } from 'vue3-toastify'

interface Props {
  pacienteId?: number // Si lo recibe, usamos este ID (doctor viendo paciente)
}

const props = defineProps<Props>()

const auth = loginStore()
const storeGluco = useGlucometriasStore()

// Si props.pacienteId existe, usamos ese. Si no, usamos userId del login
const id = props.pacienteId ?? auth.getUserId()

const ultimaGluco = ref<{ fecha: string; hora: string } | null>(null)

const cargarUltimaGlucometria = async () => {
  if (!id) return
  try {
    const data = await storeGluco.obtenerUltimaGlucometria(id)
    ultimaGluco.value = data
  } catch (error) {
    console.error(error)
    toast.error('No se pudo cargar la última glucometría')
  }
}

onMounted(() => {
  cargarUltimaGlucometria()
})

watch(
  () => storeGluco.glucometrias,
  () => {
    cargarUltimaGlucometria()
  },
  { deep: true }
)
</script>

<template>
  <div class="bg-white px-6 py-4 rounded-md shadow">
    <p class="font-semibold text-lg text-indigo-950 mb-2">Última toma de Glucometría:</p>
    <p class="text-lg">
      <span class="font-semibold text-indigo-950 mr-4">Fecha:</span>
      <span class="text-zinc-500 text-lg">{{ ultimaGluco?.fecha || 'No hay registros' }}</span>
    </p>
    <p class="text-lg mt-1">
      <span class="font-semibold text-indigo-950 mr-4">Hora:</span>
      <span class="text-zinc-500 text-lg">{{ ultimaGluco?.hora || '--:--' }}</span>
    </p>
  </div>
</template>
