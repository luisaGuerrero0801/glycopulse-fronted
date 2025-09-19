<template>
  <div class="w-full sm:w-full md:w-3/4 lg:w-4/5 xl:w-3/4 2xl:w-2/3 mx-auto px-4">
    <h2 class="font-black text-3xl text-center">Consultas Agendadas</h2>

    <p class="text-lg mt-5 text-center mb-10">
      Revisa y
      <span class="text-[var(--colorPrimarioTexto)] font-bold"> haz seguimiento</span>
    </p>

    <!-- Mensaje cuando no hay citas -->
    <div
      v-if="patients.length === 0"
      class="text-lg mt-5 text-center mb-10 bg-white shadow-md rounded-lg py-10 px-5"
    >
      No hay citas registradas
    </div>

    <!-- Tabla de citas -->
    <div
      v-else
      class="bg-white shadow-md rounded-lg py-6 px-4 sm:px-6 mb-10 overflow-x-auto"
    >
      <table class="min-w-full text-sm text-left border border-gray-200 divide-y divide-gray-200">
        <thead class="bg-gray-100 uppercase text-gray-600 text-xs">
          <tr>
            <th class="px-4 py-3">Paciente</th>
            <th class="px-4 py-3">Email</th>
            <th class="px-4 py-3">Estado</th>
            <th class="px-4 py-3">Especialista</th>
            <th class="px-4 py-3">Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="donante in donantesFiltrados"
            :key="donante.idUsuario"
            @click="seleccionarDonante(donante)"
            class="hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <td class="px-4 py-2 whitespace-nowrap border-b">
              {{ donante.nombresUsuario }} {{ donante.apellidosUsuario }}
            </td>
            <td class="px-4 py-2 whitespace-nowrap border-b">{{ donante.correoUsuario }}</td>
            <td class="px-4 py-2 whitespace-nowrap border-b">{{ donante.estado }}</td>
            <td class="px-4 py-2 whitespace-nowrap border-b">{{ donante.estado }}</td>
            <td class="px-4 py-2 whitespace-nowrap border-b">
              {{ donante.fechaAsignacion ? new Date(donante.fechaAsignacion).toLocaleDateString() : 'No disponible' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUsuariosPagination } from '@/composables/utils/usePagination'
import { usePatientStore } from '@/stores/PatientForm'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'

const patientStore = usePatientStore()
const { patients } = storeToRefs(patientStore)

const emits = defineEmits(['donante-seleccionado'])

onMounted(() => {
  patientStore.loadFromLocalStorage()
})

const {
  paginatedUsuarios: todosLosUsuarios,
  currentPage,
  totalPages,
  goToPage,
  loading,
  error,
  fetchUsuarios
} = useUsuariosPagination()

const seleccionarDonante = (donante: any) => {
  emits('donante-seleccionado', donante)
}

const idRolDeseado = 1
const idUsuarioActual = ref<number | null>(null)
const donantesFiltrados = computed(() => {
  if (idUsuarioActual.value !== null) {
    return todosLosUsuarios.value.filter(
      (d: any) => d.rol?.idRol === idRolDeseado && d.idUsuario !== idUsuarioActual.value
    )
  }
  return todosLosUsuarios.value.filter((d: any) => d.rol?.idRol === idRolDeseado)
})
</script>
