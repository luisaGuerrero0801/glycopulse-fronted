<template>
  <div class="flex justify-center items-center w-full">
    <div class="bg-white shadow-md rounded-2xl p-6 w-full max-w-3xl">
      <h1 class="text-xl font-bold text-gray-700 mb-0.5 text-center">Registrar Usuario</h1>

      <!-- Mensaje de éxito -->
      <div
        v-if="successMessage"
        class="mb-4 p-1 bg-green-100 text-green-700 rounded-lg text-sm text-center"
      >
        {{ successMessage }}
      </div>

      <form @submit.prevent="registrarUsuario" class="flex flex-col gap-0.5 flex-grow">
        <!-- Nombre -->
        <LabelForm nameForm="Nombre" />
        <InputForm
          namePlaceholder="Nombre"
          v-model="form.nombresUsuario"
          @input="
            () => {
              form.nombresUsuario = startCase(toLower(form.nombresUsuario))
              soloLetras('nombresUsuario')
            }
          "
          @keypress="onlyLetters($event)"
          @blur="validarFormulario"
        />

        <!-- Apellido -->
        <LabelForm nameForm="Apellido" />
        <InputForm
          namePlaceholder="Apellido"
          v-model="form.apellidosUsuario"
          @input="
            () => {
              form.apellidosUsuario = startCase(toLower(form.apellidosUsuario))
              soloLetras('apellidosUsuario')
            }
          "
          @keypress="onlyLetters($event)"
          @blur="validarFormulario"
        />

        <!-- Fecha de Nacimiento y Tipo de Sangre -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <LabelForm nameForm="Fecha de Nacimiento" />
            <InputForm
              namePlaceholder="Fecha de nacimiento"
              inputType="date"
              v-model="form.fechaNacimientoUsuario"
              @blur="validarFormulario"
            />
          </div>

          <div>
            <LabelForm nameForm="Tipo de Sangre" />
            <select
              v-model="form.rhUsuario"
              class="border border-gray-300 rounded-2xl w-full p-2 mt-0.5 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Selecciona tu tipo de sangre</option>
              <option value="A+">A+</option>
              <option value="O+">O+</option>
              <option value="B+">B+</option>
              <option value="AB+">AB+</option>
              <option value="A-">A-</option>
              <option value="O-">O-</option>
              <option value="B-">B-</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
        </div>

        <!-- Género y Rol -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <LabelForm nameForm="Género" />
            <select
              v-model="form.generoUsuario"
              class="border border-gray-300 rounded-2xl w-full p-2 mt-1 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option disabled value="">Selecciona género</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Otro">Otro</option>
              <option value="Prefiero no decirlo">Prefiero no decirlo</option>
            </select>
          </div>

          <div>
            <LabelForm nameForm="Rol" />
            <select
              v-model="form.idRol"
              class="border border-gray-300 rounded-2xl w-full p-2 mt-1 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option disabled value="">Selecciona rol</option>
              <option value="2">Administrador</option>
              <option value="3">Doctor</option>
            </select>
          </div>
        </div>

        <!-- Correo -->
        <LabelForm nameForm="Correo" />
        <InputForm
          namePlaceholder="Correo electrónico"
          inputType="email"
          v-model="form.correoUsuario"
          @blur="validarFormulario"
        />

        <!-- Contraseña -->
        <LabelForm nameForm="Contraseña" />
        <InputForm
          namePlaceholder="Contraseña"
          inputType="password"
          v-model="form.contrasenaUsuario"
          @blur="validarFormulario"
        />

        <!-- Celular -->
        <LabelForm nameForm="Celular" />
        <InputForm
          namePlaceholder="Número de celular"
          inputType="tel"
          v-model="form.celularUsuario"
          @keypress="permitirSoloNumeros"
          @blur="validarFormulario"
        />

        <!-- Ciudad -->
        <LabelForm nameForm="Ciudad" />
        <select
          v-model="form.region"
          class="border border-gray-300 rounded-2xl w-full p-2 mt-0.5 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccione ciudad</option>
          <option v-for="(cityName, cityCode) in availableCities" :key="cityCode" :value="cityCode">
            {{ cityName }}
          </option>
        </select>

        <!-- Botón de registro -->
        <div class="pt-4">
          <button
            type="submit"
            class="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Registrando...' : 'Registrar Usuario' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useNotificacionesStore } from '@/stores/notificaciones'
import { toast } from 'vue3-toastify'
import { useRegisterStore } from '@/stores/register'
import LabelForm from '@/components/atoms/LabelForm.vue'
import InputForm from '@/components/atoms/InputForm.vue'
import { startCase, toLower } from 'lodash'

// Emitir evento hacia el padre cuando el registro sea exitoso
const emit = defineEmits(['registro-exitoso'])

const registerStore = useRegisterStore()
const notificaciones = useNotificacionesStore()

const isLoading = ref(false)
const successMessage = ref('')

const regionMap: Record<string, Record<string, string>> = {
  CO: {
    BOG: 'Bogotá',
    MED: 'Medellín',
    CAL: 'Cali',
    BAR: 'Barranquilla',
    CAR: 'Cartagena',
    CUC: 'Cúcuta',
    BUI: 'Bucaramanga',
    PER: 'Pereira',
    MAN: 'Manizales',
    IBA: 'Ibagué',
    PAS: 'Pasto',
    NEI: 'Neiva',
    ARM: 'Armenia',
    MON: 'Montería',
    RIO: 'Riohacha',
    SMA: 'Santa Marta',
    QUI: 'Quibdó',
    YOP: 'Yopal',
    TUN: 'Tunja',
    FLO: 'Florencia'
  }
}

const availableCities = computed(() => regionMap['CO'])

const form = ref({
  nombresUsuario: '',
  apellidosUsuario: '',
  fechaNacimientoUsuario: '',
  generoUsuario: '',
  rhUsuario: '',
  correoUsuario: '',
  contrasenaUsuario: '',
  celularUsuario: '',
  region: '',
  idRol: '' // rol dinámico
})

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toISOString().split('T')[0]
}

const soloLetras = (campo: 'nombresUsuario' | 'apellidosUsuario') => {
  form.value[campo] = form.value[campo].replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
}
const onlyLetters = (e: KeyboardEvent) => {
  const char = String.fromCharCode(e.keyCode)
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/ // solo letras y espacios
  if (!regex.test(char)) e.preventDefault()
}

const soloNumeros = (texto: string) => /^[0-9]+$/.test(texto)
const validarEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
// Debe tener: mínimo 8 caracteres, mayúscula, minúscula, número y caracter especial
const validarContrasena = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,_-]).{8,}$/
  return regex.test(password)
}

const validarFormulario = () => {
  if (!form.value.idRol) {
    toast.error('Por favor selecciona un rol')
    return false
  }
  if (!validarEmail(form.value.correoUsuario)) {
    toast.error('Correo inválido')
    return false
  }
if (!validarContrasena(form.value.contrasenaUsuario)) {
  toast.error(
    'La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y carácter especial'
  )
  return false
}

  if (!soloNumeros(form.value.celularUsuario) || form.value.celularUsuario.length < 10) {
    toast.error('El número de teléfono debe tener al menos 10 dígitos')
    return false
  }
  return true
}

const resetForm = () => {
  form.value = {
    nombresUsuario: '',
    apellidosUsuario: '',
    fechaNacimientoUsuario: '',
    generoUsuario: '',
    rhUsuario: '',
    correoUsuario: '',
    contrasenaUsuario: '',
    celularUsuario: '',
    region: '',
    idRol: ''
  }
  successMessage.value = ''
}

const registrarUsuario = async () => {
  if (!validarFormulario()) return
  try {
    isLoading.value = true
    const usuario = {
      nombresUsuario: startCase(toLower(form.value.nombresUsuario)),
      apellidosUsuario: startCase(toLower(form.value.apellidosUsuario)),
      fechaNacimientoUsuario: formatDate(form.value.fechaNacimientoUsuario),
      generoUsuario: form.value.generoUsuario,
      rhUsuario: form.value.rhUsuario,
      correoUsuario: form.value.correoUsuario.trim().toLowerCase(),
      contrasenaUsuario: form.value.contrasenaUsuario,
      celularUsuario: form.value.celularUsuario,
      ciudadUsuario: regionMap.CO[form.value.region],
      paisUsuario: 'Colombia',
      idRol: Number(form.value.idRol),
      estado: 'Activo'
    }

    await registerStore.registerUser(usuario)

    notificaciones.agregar(
      `Nuevo ${usuario.idRol === 2 ? 'Administrador' : 'Doctor'} registrado: ${
        usuario.nombresUsuario
      } ${usuario.apellidosUsuario}`
    )

    successMessage.value = `¡${
      usuario.idRol === 2 ? 'Administrador' : 'Doctor'
    } registrado con éxito!`

    // Emitimos evento para avisar al padre que se registró correctamente
    emit('registro-exitoso')

    resetForm()
  } catch (error: any) {
    console.error('Error completo:', error)
    toast.error(error.response?.data?.message || 'Error al registrar usuario')
  } finally {
    isLoading.value = false
  }
}

function permitirSoloNumeros(e: KeyboardEvent) {
  const char = String.fromCharCode(e.keyCode)
  const regex = /[0-9]/ // solo permite dígitos

  if (!regex.test(char)) {
    e.preventDefault() // bloquea letras
  }
}
</script>
