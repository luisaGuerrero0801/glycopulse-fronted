<template>
  <div class="md:w-1/2 lg:w-2/5 mx-auto px-4">
    <h2 class="font-black text-3xl text-center">Seguimiento Consultas</h2>

    <p class="text-lg mt-5 text-center mb-10">
      Agenda tu cita y
      <span class="text-[var(--colorPrimarioTexto)] font-bold"> Adminístrala</span>
    </p>

    <form
      v-if="donanteActual"
      @submit.prevent="handleSubmit"
      class="bg-white shadow-md rounded-lg py-10 px-6 sm:px-8 mb-10"
      novalidate
    >
      <div class="mb-5">
        <label for="estado" class="text-sm uppercase font-bold">Usuario</label>
        <input
          id="estado"
          v-model="donanteActual.nombresUsuario"
          class="w-full p-3 border border-gray-200 rounded-md mt-2"
          type="text"
          disabled
          placeholder="Estado del Donante"
          required
        />
      </div>

      <div class="mb-5">
        <label for="email" class="text-sm uppercase font-bold">Email</label>
        <input
          id="email"
          v-model="donanteActual.correoUsuario"
          class="w-full p-3 border border-gray-200 rounded-md mt-2"
          type="email"
          disabled
          placeholder="Email de Registro"
          required
        />
      </div>

      <div class="mb-5">
        <label for="status" class="text-sm uppercase font-bold">Estado Paciente</label>
        <input
          id="status"
          v-model="donanteActual.estado"
          class="w-full p-3 border border-gray-200 rounded-md mt-2"
          type="text"
          disabled
          placeholder="Estado"
          required
        />
      </div>

      <div class="mb-5">
        <label for="specialist" class="text-sm uppercase font-bold">Especialista Disponible</label>
        <input
          id="specialist"
          v-model="patientData.specialist"
          class="w-full p-3 border border-gray-200 rounded-md mt-2"
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
          class="w-full p-3 border border-gray-200 rounded-md mt-2"
          type="date"
          required
        />
      </div>

      <input
        type="submit"
        class="bg-[var(--colorPrimarioButton)] w-full p-3 text-white uppercase font-bold hover:bg-[var(--colorSecundarioButton)] cursor-pointer transition-colors rounded-md"
        value="Asignar"
      />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import { usePatientStore } from '../../stores/PatientForm'
import { useUsuariosPagination } from '@/composables/utils/usePagination'

const patientStore = usePatientStore()

const patientData = ref({
  specialist: '',
  date: ''
})

const idUsuarioActual = ref<number | null>(null)

const {
  paginatedUsuarios: todosLosUsuarios,
  fetchUsuarios
} = useUsuariosPagination()

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

const handleSubmit = () => {
 
  if (
    !patientData.value.specialist || 
    !patientData.value.date 
  ) {
    toast.error('Por favor, completa todos los campos requeridos')
    return
  }

  const newPatient = {
    ...patientData.value,
    estado: donanteActual.value.estado, 
    nombresUsuario: donanteActual.value.nombresUsuario, 
    correoUsuario: donanteActual.value.correoUsuario, 
    date: new Date(patientData.value.date)
  }

  patientStore.addPatient(newPatient)
  toast.success('Paciente registrado correctamente')

  patientData.value = {
    specialist: '',
    date: ''
  }
}

const donanteActual = computed(() => {
  if (idUsuarioActual.value !== null) {
    return todosLosUsuarios.value.find(
      (d: any) => d.idUsuario === idUsuarioActual.value
    )
  }
  return null
})
</script>