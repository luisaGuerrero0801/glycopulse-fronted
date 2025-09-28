<template>
  <div class="w-full sm:w-full md:w-3/4 lg:w-4/5 xl:w-3/4 2xl:w-2/3 mx-auto px-4">
    <h2 class="font-black text-3xl text-center">Consultas Agendadas</h2>

    <p class="text-lg mt-5 text-center mb-10">
      Revisa y
      <span class="text-[var(--colorPrimarioTexto)] font-bold"> haz seguimiento</span>
    </p>

    <div
      v-if="donanteActual === null"
      class="text-lg mt-5 text-center mb-10 bg-white shadow-md rounded-lg py-10 px-5"
    >
      No hay citas registradas
    </div>

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
            v-if="donanteActual"
            :key="donanteActual.idUsuario"
            class="hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <td class="px-4 py-2 whitespace-nowrap border-b">
              {{ donanteActual.nombresUsuario }} {{ donanteActual.apellidosUsuario }}
            </td>
            <td class="px-4 py-2 whitespace-nowrap border-b">{{ donanteActual.correoUsuario }}</td>
            <td class="px-4 py-2 whitespace-nowrap border-b">{{ donanteActual.estado }}</td>
            <td class="px-4 py-2 whitespace-nowrap border-b">{{ donanteActual.estado }}</td>
            <td class="px-4 py-2 whitespace-nowrap border-b">
              {{ donanteActual.fechaAsignacion ? new Date(donanteActual.fechaAsignacion).toLocaleDateString() : 'No disponible' }}
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

const idUsuarioActual = ref<number | null>(null)

onMounted(() => {
  try {
    const storedId = sessionStorage.getItem('idUsuario') 
    if (storedId) {
      idUsuarioActual.value = Number(storedId)
      console.log('ID del usuario actual obtenido de sessionStorage:', idUsuarioActual.value)
    } else {
      console.log('No se encontró el ID del usuario en sessionStorage.')
    }
  } catch (e) {
    console.error('Error al obtener el ID del usuario de sessionStorage:', e)
  }
  fetchUsuarios()
})

const donanteActual = computed(() => {
  if (idUsuarioActual.value !== null) {
    return todosLosUsuarios.value.find(
      (d: any) => d.idUsuario === idUsuarioActual.value
    )
  }
  return null
})
</script>