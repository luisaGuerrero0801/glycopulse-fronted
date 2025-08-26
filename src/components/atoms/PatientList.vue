<script lang="ts" setup>
import { usePatientStore } from '@/stores/PatientForm'
import { storeToRefs } from 'pinia'
const patientStore = usePatientStore()
const { patients } = storeToRefs(patientStore)
import { onMounted } from 'vue'

onMounted(() => {
  patientStore.loadFromLocalStorage()
})
</script>

<template>
  <div class="md:w-1/2 lg:w-2/5 mx-5">
    <h2 class="font-black text-3xl text-center">Consulta Agendadas</h2>

    <p class="text-lg mt-5 text-center mb-10">
      Revisa y
      <span class="text-indigo-600 font-bold">haz seguimiento</span>
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
          <tr v-for="patient in patients" :key="patient.id" class="hover:bg-gray-50">
            <td class="px-4 py-2 border-b">{{ patient.name }}</td>
            <td class="px-4 py-2 border-b">{{ patient.email }}</td>
            <td class="px-4 py-2 border-b">{{ patient.status }}</td>
            <td class="px-4 py-2 border-b">{{ patient.specialist }}</td>
            <td class="px-4 py-2 border-b">
              {{ new Date(patient.date).toLocaleDateString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
