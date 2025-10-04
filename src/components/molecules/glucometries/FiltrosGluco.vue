<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import InputAtom from '@/components/atoms/ImputAtom.vue'
import { useGlucometriasStore } from '@/stores/glucometrias/AllGlucometrias'
import { loginStore } from '@/stores/login'

interface Props {
  pacienteId?: number
}
const props = defineProps<Props>()

const storeGluco = useGlucometriasStore()
const auth = loginStore()
const userId = auth.getUserId()

// Valores de filtro
const fecha = ref<string>('')
const rango = ref<string>('')

// Rangos dinámicos desde el store
const rangos = ref<{ value: string; label: string }[]>([])

const cargarRangos = async () => {
  await storeGluco.obtenerRangosStore()
  rangos.value = storeGluco.rangos.map(r => ({
    value: r,
    label: r.charAt(0).toUpperCase() + r.slice(1)
  }))
  rangos.value.unshift({ value: 'no', label: 'Todas' })
}

// Función para aplicar filtros
const aplicarFiltros = () => {
  const idParaCargar = props.pacienteId ?? userId
  if (!idParaCargar) return

  const filters: Record<string, string> = {}
  if (fecha.value) filters.fechaGlucometria = fecha.value
  if (rango.value && rango.value !== 'no') filters.rangoGlucometria = rango.value

  storeGluco.verGlucos(idParaCargar, filters)
}

// Observadores para aplicar filtro automáticamente
watch([fecha, rango], () => {
  aplicarFiltros()
})

// Cargar rangos al montar
onMounted(() => {
  cargarRangos()
})
</script>

<template>
  <div class="flex w-full items-center bg-white pr-6 pl-6 pt-4 pb-4 rounded-md shadow space-x-6">
    <InputAtom 
      label="Fecha" 
      type="date" 
      class="text-lg flex-1"
      v-model="fecha"
    />
    
    <InputAtom 
      label="Rango de Glucometría" 
      type="select" 
      placeholder="Selecciona"
      :options="rangos"
      class="text-lg flex-1"
      v-model="rango"
    />
  </div>
</template>
