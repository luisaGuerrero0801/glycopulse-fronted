<script lang="ts" setup>
import { useUsuariosPagination } from '@/composables/utils/usePagination'
import { usePatientStore } from '@/stores/PatientForm'
import { storeToRefs } from 'pinia'
const patientStore = usePatientStore()
const { patients } = storeToRefs(patientStore)
import { computed, onMounted, ref } from 'vue'
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
  // Filtra por rol y excluye al usuario actual si el ID está disponible
  if (idUsuarioActual.value !== null) {
    return todosLosUsuarios.value.filter(
      (d: any) => d.rol?.idRol === idRolDeseado && d.idUsuario !== idUsuarioActual.value
    )
  }
  // Si no tenemos el ID del usuario actual, solo filtramos por rol
  return todosLosUsuarios.value.filter((d: any) => d.rol?.idRol === idRolDeseado)
})
</script>

<template>
  <div class="w-full sm:w-full md:w-3/4 lg:w-4/5 xl:w-3/4 2xl:w-2/3 mx-auto">
    <div>
      <h2 class="font-black text-3xl text-center">Consulta Agendadas</h2>

      <p class="text-lg mt-5 text-center mb-10">
        Revisa y
        <span class="text-[var(--colorPrimarioTexto)] font-bold">haz seguimiento</span>
      </p>

      <div
        v-if="patients.length === 0"
        class="text-lg mt-5 text-center mb-10 bg-white shadow-md rounded-lg py-10 px-5"
      >
        No hay citas registradas
      </div>

      <div v-else class="bg-white shadow-md rounded-lg py-10 px-5 mb-10 overflow-x-auto">
        <table class="min-w-full text-sm text-left border border-gray-200">
          <thead class="bg-gray-100 uppercase text-gray-600 text-xs">
            <tr>
              <th class="px-4 py-3 border-b">Paciente</th>
              <th class="px-4 py-3 border-b">Email</th>
              <th class="px-4 py-3 border-b">Estado</th>
              <th class="px-4 py-3 border-b">Especialista</th>
              <th class="px-4 py-3 border-b">Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="donante in donantesFiltrados"
              :key="donante.idUsuario"
              @click="seleccionarDonante(donante)"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-2 border-b">
                {{ donante.nombresUsuario }} {{ donante.apellidosUsuario }}
              </td>
              <td class="px-4 py-2 border-b">{{ donante.correoUsuario }}</td>
              <td class="px-4 py-2 border-b">{{ donante.estado }}</td>
              <td class="px-4 py-2 border-b">{{ donante.estado }}</td>
              <td class="px-4 py-2 border-b">
                <!-- {{ new Date(patient.date).toLocaleDateString() }} -->
                  <!--otro-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
