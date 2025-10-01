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
        <label for="usuario" class="text-sm uppercase font-bold">Usuario</label>
        <input
          id="usuario"
          :value="donanteActual.nombresUsuario"
          class="w-full p-3 border border-gray-200 rounded-md mt-2"
          type="text"
          disabled
          placeholder="Nombre del Usuario"
        />
      </div>

      <div class="mb-5">
        <label for="email" class="text-sm uppercase font-bold">Email</label>
        <input
          id="email"
          :value="donanteActual.correoUsuario"
          class="w-full p-3 border border-gray-200 rounded-md mt-2"
          type="email"
          disabled
          placeholder="Email del Usuario"
        />
      </div>

      <div class="mb-5">
        <label for="status" class="text-sm uppercase font-bold">Estado Paciente</label>
        <input
          id="status"
          :value="donanteActual.estado"
          class="w-full p-3 border border-gray-200 rounded-md mt-2"
          type="text"
          disabled
          placeholder="Estado del Paciente"
        />
      </div>

      <div class="mb-5">
        <label for="specialist" class="text-sm uppercase font-bold">Especialista Disponible</label>
        <select
          id="specialist"
          v-model="patientData.specialist"
          class="w-full p-3 border border-gray-200 rounded-md mt-2"
          required
        >
          <option value="">Seleccione un especialista</option>
          <option
            v-for="usuario in especialistas"
            :key="usuario.idUsuario"
            :value="usuario.nombresUsuario + ' ' + usuario.apellidosUsuario"
          >
            {{ usuario.nombresUsuario }} {{ usuario.apellidosUsuario }}
          </option>
        </select>
      </div>

      <div class="mb-5">
        <label for="date" class="text-sm uppercase font-bold">Fecha Asignación</label>
        <input
          id="date"
          v-model="patientData.date"
          class="w-full p-3 border border-gray-200 rounded-md mt-2"
          type="date"
          required
          :min="today"
        />
      </div>

      <input
        type="submit"
        class="bg-[var(--colorPrimarioButton)] w-full p-3 text-white uppercase font-bold hover:bg-[var(--colorSecundarioButton)] cursor-pointer transition-colors rounded-md"
        value="Asignar"
      />

      <button
        type="button"
        @click="cancelarCita"
        class="mt-4 w-full p-3 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors"
      >
        Cancelar Cita
      </button>
    </form>

    <div v-else class="text-center text-red-600 font-bold mt-10">
      No se encontró el usuario logueado.
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { usePatientStore } from '@/stores/PatientForm'
import { useUsuariosPagination } from '@/composables/utils/usePagination'
import { toast } from 'vue3-toastify'

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

onMounted(async () => {
  const storedId = sessionStorage.getItem('idUsuario')
  if (storedId) idUsuarioActual.value = Number(storedId)
  await fetchUsuarios()
})

const donanteActual = computed(() => {
  if (idUsuarioActual.value !== null) {
    return todosLosUsuarios.value.find(
      (d: any) => d.idUsuario === idUsuarioActual.value
    )
  }
  return null
})

const especialistas = computed(() => {
  return todosLosUsuarios.value.filter((usuario: any) => usuario.rol?.idRol === 3)
})

function parseDateLocal(dateString: string) {
  const parts = dateString.split('-')
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
}

const today = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

const handleSubmit = () => {
  if (!patientData.value.specialist || !patientData.value.date) {
    toast.error('Por favor, completa todos los campos requeridos')
    return
  }

  if (!donanteActual.value) {
    toast.error('Usuario no encontrado')
    return
  }

  patientStore.addPatient({
    idUsuario: donanteActual.value.idUsuario,
    name: donanteActual.value.nombresUsuario + ' ' + donanteActual.value.apellidosUsuario,
    email: donanteActual.value.correoUsuario,
    status: donanteActual.value.estado,
    specialist: patientData.value.specialist,
    date: parseDateLocal(patientData.value.date)
  })

  toast.success('Consulta asignada correctamente')

  patientData.value.specialist = ''
  patientData.value.date = ''
}

const cancelarCita = () => {
  if (!donanteActual.value) {
    toast.error('Usuario no encontrado')
    return
  }

  const pacienteIndex = patientStore.patients.findIndex(
    (p) => p.idUsuario === donanteActual.value.idUsuario
  )

  if (pacienteIndex !== -1) {
    patientStore.patients.splice(pacienteIndex, 1)
    patientStore.saveToLocalStorage()
    toast.success('Consulta cancelada correctamente')
  } else {
    toast.info('No tienes citas asignadas')
  }
}
</script>
