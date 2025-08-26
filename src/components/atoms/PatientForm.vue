<template>
  <div class="md:w-1/2 lg:w-2/5 mx-5">
    <div>

      <h2 className="font-black text-3xl text-center">Seguimiento Consultas</h2>
      
      <p className="text-lg mt-5 text-center mb-10">
        Agenda tu cita y
        <span className="text-indigo-600 font-bold">Administrala</span>
      </p>
      <form
      @submit.prevent="handleSubmit"
      class="bg-white shadow-md rounded-lg py-10 px-5 mb-10"
      novalidate
      >
      <div class="mb-5">
        <label for="name" class="text-sm uppercase font-bold">Paciente</label>
        <input
        id="name"
        v-model="patientData.name"
        class="w-full p-3 border border-gray-100"
        type="text"
        placeholder="Nombre del Paciente"
        required
        />
      </div>
      <div class="mb-5">
        <label for="email" class="text-sm uppercase font-bold">Email</label>
        <input
        id="email"
        v-model="patientData.email"
        class="w-full p-3 border border-gray-100"
        type="email"
        placeholder="Email de Registro"
        required
        />
      </div>
      <div class="mb-5">
        <label for="status" class="text-sm uppercase font-bold">Estado</label>
        <input
        id="status"
          v-model="patientData.status"
          class="w-full p-3 border border-gray-100"
          type="text"
          placeholder="Estado"
          required
        />
      </div>
      <div class="mb-5">
        <label for="specialist" class="text-sm uppercase font-bold">Especialista Disponible</label>
        <input
        id="specialist"
        v-model="patientData.specialist"
        class="w-full p-3 border border-gray-100"
        type="text"
        placeholder="Nombre del Doctor"
        required
        />
      </div>
      <div class="mb-5">
        <label for="date" class="text-sm uppercase font-bold">Fecha Asignación</label>
        <input
        id="date"
        v-model="patientData.date"
        class="w-full p-3 border border-gray-100"
        type="date"
        required
        />
      </div>
      
      <input
      type="submit"
      class="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-indigo-700 cursor-pointer transition-colors"
      value="Asignar"
      />
    </form>
  </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import { usePatientStore } from '../../stores/PatientForm'





const patientStore = usePatientStore()

const patientData = ref({
  name: '',
  email: '',
  status: '',
  specialist: '',
  date: ''
})

const handleSubmit = () => {
  if (
    !patientData.value.name ||
    !patientData.value.email ||
    !patientData.value.status ||
    !patientData.value.specialist ||
    !patientData.value.date
  ) {
    toast.error('Por favor, completa todos los campos')
    return
  }

  const newPatient = {
    ...patientData.value,
    date: new Date(patientData.value.date)
  }

  patientStore.addPatient(newPatient)

  toast.success('Paciente registrado correctamente')

  patientData.value = {
    name: '',
    email: '',
    status: '',
    specialist: '',
    date: ''
  }
}
</script>
