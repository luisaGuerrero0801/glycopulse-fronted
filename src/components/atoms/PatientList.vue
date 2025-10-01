<template>
  <div class="w-full sm:w-full md:w-3/4 lg:w-4/5 xl:w-3/4 2xl:w-2/3 mx-auto px-4">
    <h2 class="font-black text-3xl text-center">Consultas Agendadas</h2>

    <p class="text-lg mt-5 text-center mb-10">
      Revisa y
      <span class="text-[var(--colorPrimarioTexto)] font-bold"> haz seguimiento</span>
    </p>

    <div
      v-if="patients.length === 0"
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
            v-for="patient in paginatedPatients"
            :key="patient.id"
            class="hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <td class="px-4 py-2 whitespace-nowrap border-b">{{ patient.name }}</td>
            <td class="px-4 py-2 whitespace-nowrap border-b">{{ patient.email }}</td>
            <td class="px-4 py-2 whitespace-nowrap border-b">{{ patient.status }}</td>
            <td class="px-4 py-2 whitespace-nowrap border-b">{{ patient.specialist }}</td>
            <td class="px-4 py-2 whitespace-nowrap border-b">
              {{ new Date(patient.date).toLocaleDateString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-center mt-6" v-if="totalPages > 1">
      <paginate
        :page-count="totalPages"
        :click-handler="goToPage"
        :prev-text="'Anterior'"
        :next-text="'Siguiente'"
        :container-class="'flex space-x-2'"
        :page-class="'px-2 py-1 border rounded cursor-pointer text-gray-700 hover:bg-gray-200 text-sm'"
        :active-class="'bg-blue-600 text-white font-semibold'"
        :prev-class="'px-2 py-1 border rounded cursor-pointer text-gray-700 hover:bg-gray-200 text-sm'"
        :next-class="'px-2 py-1 border rounded cursor-pointer text-gray-700 hover:bg-gray-200 text-sm'"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { usePatientStore } from '@/stores/PatientForm'
import { storeToRefs } from 'pinia'
import Paginate from 'vuejs-paginate-next'
import { usePagination } from '@/composables/pagination/usePagination'

const patientStore = usePatientStore()
const { patients } = storeToRefs(patientStore)

onMounted(() => {
  patientStore.loadFromLocalStorage()
})

const patientsPerPage = 10

const sortedPatients = computed(() => {
  return [...patients.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const { currentPage, paginatedItems, totalPages, goToPage } = usePagination(
  sortedPatients,
  patientsPerPage
)

const paginatedPatients = paginatedItems
</script>
