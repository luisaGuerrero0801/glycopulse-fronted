<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import InputAtom from '@/components/atoms/ImputAtom.vue'
import { useGlucometriasStore } from '@/stores/glucometrias/AllGlucometrias'
import { loginStore } from '@/stores/login'

const storeGluco = useGlucometriasStore()
const auth = loginStore()
const userId = auth.getUserId()

// Valores de filtro
const fecha = ref<string>('')
const hora = ref<string>('')
const rango = ref<string>('')

// Cargar rangos dinámicos desde el store
const rangos = ref<{ value: string; label: string }[]>([])

const cargarRangos = async () => {
  await storeGluco.obtenerRangosStore()
  rangos.value = storeGluco.rangos.map(r => ({
    value: r,
    label: r.charAt(0).toUpperCase() + r.slice(1) // capitaliza la primera letra
  }))
  rangos.value.unshift({ value: 'no', label: 'Todas' }) // opción por defecto
}

// Función para aplicar filtros
const aplicarFiltros = () => {
  if (!userId) return
  const filters: Record<string, string> = {}
  if (fecha.value) filters.fechaGlucometria = fecha.value
  if (hora.value) filters.horaGlucometria = hora.value
  if (rango.value && rango.value !== 'no') filters.rangoGlucometria = rango.value
  storeGluco.verGlucos(userId, filters)
}

// Observadores para que cada cambio en los inputs aplique el filtro automáticamente
watch([fecha, hora, rango], () => {
  aplicarFiltros()
})

// Cargar rangos al montar el componente
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

    <InputAtom 
      label="Hora" 
      type="time" 
      class="text-lg flex-1" 
    />
  </div>
</template>
