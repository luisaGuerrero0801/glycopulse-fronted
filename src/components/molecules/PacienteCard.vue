<!-- PacientesCard.vue -->
<template>
  <div
    class="bg-white shadow rounded-xl p-4 sm:p-5 mt-4 md:p-6 flex flex-col sm:flex-row items-center justify-between w-full transition hover:bg-gray-50"
  >
    <div
      class="grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-4 items-center w-full text-center sm:text-left"
    >
      <!-- Avatar -->
      <div class="flex flex-col items-center sm:items-start">
        <div
          class="bg-[#D4E1FC] text-indigo-800 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold mb-3 shadow-lg"
        >
          <p class="text-black font-bold">
            {{ paciente.nombre.charAt(0) }}
          </p>
        </div>
      </div>

      <!-- Nombre -->
      <div class="flex flex-col items-center sm:items-start">
        <p class="text-black text-2xl font-bold">Nombre</p>
        <p class="text-gray-500 text-sm sm:text-base truncate">
          {{ paciente.nombre }}
        </p>
      </div>

      <!-- Ubicación -->
      <div class="flex flex-col items-center sm:items-start">
        <p class="text-black text-2xl font-bold">Ubicación</p>
        <p class="text-gray-500 text-sm sm:text-base">
          {{ paciente.ubicacion || 'No disponible' }}
        </p>
      </div>

      <!-- Email -->
      <div class="flex flex-col items-center sm:items-start">
        <p class="text-black text-2xl font-bold">Email</p>
        <p class="text-gray-500 text-sm sm:text-base truncate max-w-[160px]">
          {{ paciente.email }}
        </p>
      </div>

      <!-- RH -->
      <div class="flex flex-col items-center sm:items-start">
        <p class="text-black text-2xl font-bold">RH</p>
        <p class="text-gray-500 text-sm sm:text-base">
          {{ paciente.rh }}
        </p>
      </div>

      <!-- Opciones -->
      <div class="flex justify-center sm:justify-end">
        <select
          class="border rounded-md px-2 py-1 text-sm text-gray-600"
          @change="irAOpcion($event, paciente.id)"
        >
          <option disabled selected>Selecciona</option>
          <option value="reportes">Reportes</option>
          <option value="glucometrias">Glucometrias</option>
          <option value="recetas">Recetas</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { defineEmits, defineProps } from 'vue'
const router = useRouter()

const emit = defineEmits<{
  (e: 'mostrarGlucometrias', pacienteId: number): void
}>()

const irAOpcion = (event: Event, pacienteId: number) => {
  const select = event.target as HTMLSelectElement
  const opcion = select.value
  if (opcion === 'reportes') {
    router.push({ name: 'DoctorReportesHome', params: { id: pacienteId } })
  }

  if (opcion === 'recetas') {
    router.push({ name: 'DoctorRecetasHome', params: { id: pacienteId } })
  }
 if (opcion === 'glucometrias') {
    // Emitimos el evento al padre en lugar de hacer router.push
    emit('mostrarGlucometrias', pacienteId)
  }

  // Resetear select
  select.value = ''
}

defineProps<{
  paciente: {
    id: number
    nombre: string
    email: string
    telefono: string
    rh: string
    ubicacion: string
    fechaNacimiento: string
  }
}>()
</script>
