<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { loginStore } from '@/stores/login'
import { useGlucometriasStore } from '@/stores/glucometrias/AllGlucometrias'
import { toast } from 'vue3-toastify'

const auth = loginStore()
const storeGluco = useGlucometriasStore()
const userId = auth.getUserId()

const ultimaGluco = ref<{ fecha: string; hora: string } | null>(null)

const cargarUltimaGlucometria = async () => {
  if (!userId) return
  try {
    const data = await storeGluco.obtenerUltimaGlucometria(userId)
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
  { deep: true } // detecta cambios dentro del array
)
</script>

<template>
  <div class="bg-white px-6 py-4 rounded-md shadow">
    <p class="font-semibold text-lg text-indigo-950 mb-2">Ultima toma de Glucometría:</p>
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
