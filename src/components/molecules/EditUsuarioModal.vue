<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300"
    :class="{ 'opacity-100': visible, 'opacity-0': !visible }"
  >
    <div
      class="bg-white rounded-xl shadow-2xl overflow-hidden text-gray-700 w-full max-w-lg max-h-[95vh] transform transition-transform duration-300 scale-95"
      :class="{ 'scale-100': visible }"
    >
      <button
        @click="cancelar"
        class="absolute top-4 right-6 text-blue-200 hover:text-white transition-colors"
      >
        <svg
          class="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>

      <form @submit.prevent="guardar" class="p-6 sm:p-8 space-y-6 overflow-y-auto">
        <div class="border-b border-gray-200 pb-5">
          <h3 class="text-xl font-bold text-gray-700 mb-0.5 text-center">Información Personal</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <LabelForm nameForm="Nombre" />
              <InputForm namePlaceholder="Nombre" inputType="text" v-model="form.nombresUsuario" />
            </div>

            <div>
              <LabelForm nameForm="Apellido" />
              <InputForm
                namePlaceholder="Apellido"
                inputType="text"
                v-model="form.apellidosUsuario"
              />
            </div>

            <div>
              <LabelForm nameForm="Celular" />
              <InputForm
                namePlaceholder="Número de celular"
                inputType="tel"
                v-model="form.celularUsuario"
                @keypress="permitirSoloNumeros"
              />
            </div>

            <div>
              <LabelForm nameForm="Ciudad" />
              <select
                v-model="form.ciudadUsuario"
                class="border border-gray-300 rounded-2xl w-full p-2 mt-0.5 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione ciudad</option>
                <option
                  v-for="(cityName, cityCode) in availableCities"
                  :key="cityCode"
                  :value="cityCode"
                >
                  {{ cityName }}
                </option>
              </select>
            </div>

            <div>
              <LabelForm nameForm="Tipo de Sangre (RH)" />
              <select
                :disabled="true"
                v-model="form.rhUsuario"
                class="border border-gray-300 rounded-2xl w-full p-2 mt-1 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <LabelForm nameForm="Genero" />
              <select
                v-model="form.generoUsuario"
                class="border border-gray-300 rounded-2xl w-full p-2 mt-1 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <LabelForm nameForm="Fecha de Nacimiento" />
              <InputForm
                namePlaceholder="fechaNacimiento"
                inputType="date"
                v-model="form.fechaNacimientoUsuario"
              />
            </div>

            <div v-if="form.idRol === 1">
              <div>
                <LabelForm nameForm="Rol del Usuario" />
                <select
                  :disabled="true"
                  v-model="form.rolUsuario"
                  class="border border-gray-300 rounded-2xl w-full p-2 mt-1 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">Paciente</option>
                </select>
              </div>
            </div>

            <div v-if="form.idRol === 2">
              <div>
                <LabelForm nameForm="Rol del Usuario" />
                <select
                  v-model="form.rolUsuario"
                  class="border border-gray-300 rounded-2xl w-full p-2 mt-1 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">Paciente</option>
                  <option value="2">Administrador</option>
                  <option value="3">Doctor</option>
                </select>
              </div>
            </div>

            <div v-if="form.idRol === 3">
              <div>
                <LabelForm nameForm="Rol del Usuario" />
                <select
                  :disabled="true"
                  v-model="form.rolUsuario"
                  class="border border-gray-300 rounded-2xl w-full p-2 mt-1 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="3">Doctor</option>
                </select>
              </div>
            </div>

            <div class="md:col-span-2">
              <LabelForm nameForm="Correo" />
              <InputForm
                namePlaceholder="Correo electrónico"
                inputType="email"
                v-model="form.correoUsuario"
              />
            </div>
          </div>
        </div>

        <div class="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            @click="cancelar"
            class="px-5 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors sm: text-lg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-5 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors sm: text-lg"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { watch, reactive, computed } from 'vue'
import axios from 'axios'
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

import LabelForm from '@/components/atoms/LabelForm.vue'
import InputForm from '@/components/atoms/InputForm.vue'

const { VITE_API_URL } = import.meta.env


const props = defineProps<{
  visible: boolean
  usuario: any
}>()

const emit = defineEmits(['close', 'save'])
const availableCities = computed(() => regionMap['CO'])

const regionMap: Record<string, Record<string, string>> = {
  CO: {
    Bogotá: 'Bogotá',
    Medellín: 'Medellín',
    Cali: 'Cali',
    Barranquilla: 'Barranquilla',
    Cartagena: 'Cartagena',
    Cúcuta: 'Cúcuta',
    Bucaramanga: 'Bucaramanga',
    Pereira: 'Pereira',
    Manizales: 'Manizales',
    Ibagué: 'Ibagué',
    Pasto: 'Pasto',
    Neiva: 'Neiva',
    Armenia: 'Armenia',
    Montería: 'Montería',
    Riohacha: 'Riohacha',
    'Santa Marta': 'Santa Marta',
    Quibdó: 'Quibdó',
    Yopal: 'Yopal',
    Tunja: 'Tunja',
    Florencia: 'Florencia'
  }
}

const form = reactive({
  nombresUsuario: '',
  apellidosUsuario: '',
  correoUsuario: '',
  rhUsuario: '',
  fechaNacimientoUsuario: '',
  generoUsuario: '',
  ciudadUsuario: '',
  paisUsuario: '',
  rolUsuario: '',
  region: '',
  celularUsuario: '',
  idRol: 0
})
const correoLogueado = computed(() => sessionStorage.getItem('email'))

watch(
  () => props.usuario,
  (nuevoUsuario) => {
    if (nuevoUsuario) {

      form.nombresUsuario = nuevoUsuario.nombresUsuario || ''
      form.apellidosUsuario = nuevoUsuario.apellidosUsuario || ''
      form.correoUsuario = nuevoUsuario.correoUsuario || ''
      form.rhUsuario = nuevoUsuario.rhUsuario || ''
      form.generoUsuario = nuevoUsuario.generoUsuario || ''
      form.ciudadUsuario = nuevoUsuario.ciudadUsuario || ''
      form.paisUsuario = nuevoUsuario.paisUsuario || ''
      form.celularUsuario = nuevoUsuario.celularUsuario || ''

      form.idRol = Number(nuevoUsuario.rol?.idRol) || 0

      if (nuevoUsuario.rol && typeof nuevoUsuario.rol.idRol === 'number') {
        form.rolUsuario = String(nuevoUsuario.rol.idRol)
      } else {
        form.rolUsuario = ''
      }

      if (nuevoUsuario.fechaNacimientoUsuario) {
        form.fechaNacimientoUsuario = nuevoUsuario.fechaNacimientoUsuario.split('T')[0]
      }
    }
  },
  { immediate: true }
)

function cancelar() {
  emit('close')
}

async function guardar() {
  try {
    const usuarioId = props.usuario.idUsuario
    const urlApi = `${VITE_API_URL}usuarios/${usuarioId}`
    const token = localStorage.getItem('token')

    if (!usuarioId) {
      showToast('⚠️ No se pudo obtener el ID del usuario para actualizar.', '#ff9800')
      return
    }

    const datosActualizados = {
      nombresUsuario: form.nombresUsuario,
      apellidosUsuario: form.apellidosUsuario,
      correoUsuario: form.correoUsuario,
      rhUsuario: form.rhUsuario,
      fechaNacimientoUsuario: form.fechaNacimientoUsuario,
      generoUsuario: form.generoUsuario,
      ciudadUsuario: form.ciudadUsuario,
      celularUsuario: form.celularUsuario,
      paisUsuario: form.paisUsuario,
      idRol: Number(form.rolUsuario)
    }

    const response = await axios.patch(urlApi, datosActualizados, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (response.status === 200) {
      showToast('✅ Usuario actualizado correctamente!', '#4CAF50')
      emit('save', response.data)
      emit('close')
    }
  } catch (error) {
    console.error('Error al actualizar el usuario:', error)
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 400) {
        showToast('⚠️ Datos de la solicitud incorrectos. Verifique el formato.', '#ff9800')
      } else if (error.response.status === 403) {
        showToast('🚫 No tienes permisos para realizar esta acción.', '#f44336')
      } else if (error.response.status === 404) {
        showToast('❌ El usuario no fue encontrado.', '#f44336')
      } else {
        showToast('⚠️ Ocurrió un error en el servidor.', '#f44336')
      }
    } else {
      showToast('❌ Ocurrió un error de red o desconocido.', '#f44336')
    }
  }
}

function showToast(message: string, color: string) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: 'top',
    position: 'right',
    style: {
      background: color,  
    },
    close: true
  }).showToast()
}
function permitirSoloNumeros(e: KeyboardEvent) {
  const char = String.fromCharCode(e.keyCode)
  const regex = /[0-9]/

  if (!regex.test(char)) {
    e.preventDefault()
  }
}
</script>
