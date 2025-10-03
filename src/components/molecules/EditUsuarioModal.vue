<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300"
    :class="{ 'opacity-100': visible, 'opacity-0': !visible }"
  >
    <div
      class="bg-white rounded-2xl shadow-3xl overflow-hidden text-gray-800 w-full max-w-xl max-h-[95vh] transform transition-transform duration-300 scale-95"
      :class="{ 'scale-100': visible }"
    >
      <button
        @click="cancelar"
        class="absolute top-5 right-6 text-gray-400 hover:text-gray-700 transition-colors"
        aria-label="Cerrar"
      >
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <form @submit.prevent="guardar" class="p-8 space-y-8 overflow-y-auto max-h-[85vh]">
        <div class="border-b border-gray-300 pb-6">
          <h3 class="text-2xl font-semibold text-center text-gray-900 mb-6">Información Personal</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <LabelForm nameForm="Nombre" />
              <InputForm
                namePlaceholder="Nombre"
                inputType="text"
                v-model="form.nombresUsuario"
                class="focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div>
              <LabelForm nameForm="Apellido" />
              <InputForm
                namePlaceholder="Apellido"
                inputType="text"
                v-model="form.apellidosUsuario"
                class="focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div>
              <LabelForm nameForm="Celular" />
              <InputForm
                namePlaceholder="Número de celular"
                inputType="tel"
                v-model="form.celularUsuario"
                @keypress="permitirSoloNumeros"
                class="focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div>
              <LabelForm nameForm="Ciudad" />
              <select
                v-model="form.ciudadUsuario"
                class="border border-gray-300 rounded-3xl w-full p-3 mt-1 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="" disabled>Seleccione ciudad</option>
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
                class="border border-gray-300 rounded-3xl w-full p-3 mt-1 bg-gray-100 text-gray-500 cursor-not-allowed"
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
              <LabelForm nameForm="Género" />
              <select
                v-model="form.generoUsuario"
                class="border border-gray-300 rounded-3xl w-full p-3 mt-1 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <LabelForm nameForm="Fecha de Nacimiento" />
              <InputForm
                namePlaceholder="Fecha de Nacimiento"
                inputType="date"
                v-model="form.fechaNacimientoUsuario"
                class="focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div v-if="form.idRol === 1">
              <LabelForm nameForm="Rol del Usuario" />
              <select
                :disabled="true"
                v-model="form.rolUsuario"
                class="border border-gray-300 rounded-3xl w-full p-3 mt-1 bg-gray-100 text-gray-500 cursor-not-allowed"
              >
                <option value="1">Paciente</option>
              </select>
            </div>

            <div v-if="form.idRol === 2">
              <LabelForm nameForm="Rol del Usuario" />
              <select
                v-model="form.rolUsuario"
                class="border border-gray-300 rounded-3xl w-full p-3 mt-1 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="1">Paciente</option>
                <option value="2">Administrador</option>
                <option value="3">Doctor</option>
              </select>
            </div>

            <div v-if="form.idRol === 3">
              <LabelForm nameForm="Rol del Usuario" />
              <select
                :disabled="true"
                v-model="form.rolUsuario"
                class="border border-gray-300 rounded-3xl w-full p-3 mt-1 bg-gray-100 text-gray-500 cursor-not-allowed"
              >
                <option value="3">Doctor</option>
              </select>
            </div>

            <div class="md:col-span-2">
              <LabelForm nameForm="Correo" />
              <InputForm
                namePlaceholder="Correo electrónico"
                inputType="email"
                v-model="form.correoUsuario"
                class="focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div class="md:col-span-2">
              <LabelForm nameForm="Nueva Contraseña (opcional)" />
              <InputForm
                namePlaceholder="Nueva contraseña"
                inputType="password"
                v-model="form.nuevaContrasenaUsuario"
                class="focus:ring-blue-600 focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-300 flex justify-end space-x-4">
          <button
            type="button"
            @click="cancelar"
            class="px-6 py-3 border border-gray-300 rounded-full text-gray-700 font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition"
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

const availableCities = computed(() => regionMap['CO'])

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
  idRol: 0,
  nuevaContrasenaUsuario: ''
})

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
      form.nuevaContrasenaUsuario = ''
    }
  },
  { immediate: true }
)

function cancelar() {
  emit('close')
}
function validarContrasena(password: string): boolean {
  // Al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return regex.test(password)
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

if (form.nuevaContrasenaUsuario.trim() !== '') {
  if (!validarContrasena(form.nuevaContrasenaUsuario.trim())) {
    showToast(
      'La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y carácter especial',
      '#ff9800'
    )
    return
  }
}


    const datosActualizados: Record<string, any> = {
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

    if (form.nuevaContrasenaUsuario.trim() !== '') {
      datosActualizados.contrasenaUsuario = form.nuevaContrasenaUsuario.trim()
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
      showToast(`❌ Error: ${error.response.data.message || 'No se pudo actualizar.'}`, '#f44336')
    } else {
      showToast('❌ Error al actualizar el usuario.', '#f44336')
    }
  }
}

function showToast(message: string, bgColor: string) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: 'top',
    position: 'right',
    backgroundColor: bgColor,
    stopOnFocus: true
  }).showToast()
}

function permitirSoloNumeros(event: KeyboardEvent) {
  const charCode = event.charCode
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
  }
}
</script>
