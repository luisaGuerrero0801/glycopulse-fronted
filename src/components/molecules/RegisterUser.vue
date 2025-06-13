<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ButtonLogin from '../atoms/ButtonLogin.vue'
import { LabelForm, InputForm } from '../atoms/index.js'
import { CountrySelect, RegionSelect } from 'vue3-country-region-select'
import { useRegisterStore } from '@/stores/register'

const router = useRouter()
const registerStore = useRegisterStore()

const form = ref({
  nombresUsuario: '',
  apellidosUsuario: '',
  fechaNacimientoUsuario: '',
  generoUsuario: '',
  rhUsuario: '',
  correoUsuario: '',
  contrasenaUsuario: '',
  country: 'CO',
  region: ''
})

const countryMap: Record<string, string> = {
  CO: 'Colombia'
}

const idRol = ref(2)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const regionMap: Record<string, Record<string, string>> = {
  CO: {
    DC: 'Bogotá D.C.',
    ANT: 'Antioquia',
    VAL: 'Valle del Cauca',
    SAN: 'Santander',
    BOY: 'Boyacá',
    CUN: 'Cundinamarca',
    ATL: 'Atlántico',
    BOL: 'Bolívar',
    CAL: 'Caldas',
    HUI: 'Huila',
    NAR: 'Nariño',
    MAG: 'Magdalena'
  }
}

const paisesDisponibles = [{ code: 'CO', name: 'Colombia' }]

const validarEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const validarContrasena = (password: string) => password.length >= 8

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toISOString().split('T')[0]
}

const obtenerNombreCompletoPais = (codigoPais: string) => {
  return codigoPais.length > 4 || codigoPais.includes(' ')
    ? codigoPais
    : countryMap[codigoPais] || codigoPais
}

const obtenerNombreCompletoCiudad = (codigoCiudad: string, codigoPais: string) => {
  return codigoCiudad.length > 4 || codigoCiudad.includes(' ')
    ? codigoCiudad
    : (regionMap[codigoPais] || {})[codigoCiudad] || codigoCiudad
}

const validarFormulario = () => {
  errorMessage.value = ''

  const camposRequeridos = [
    { value: form.value.nombresUsuario, message: 'El nombre es obligatorio' },
    { value: form.value.apellidosUsuario, message: 'El apellido es obligatorio' },
    { value: form.value.fechaNacimientoUsuario, message: 'La fecha de nacimiento es obligatoria' },
    { value: form.value.generoUsuario, message: 'Por favor selecciona tu género' },
    { value: form.value.rhUsuario, message: 'Por favor selecciona tu tipo de sangre' },
    { value: form.value.country, message: 'Por favor selecciona tu país' },
    { value: form.value.region, message: 'Por favor selecciona tu ciudad' }
  ]

  for (const campo of camposRequeridos) {
    if (!campo.value) {
      errorMessage.value = campo.message
      return false
    }
  }

  if (!validarEmail(form.value.correoUsuario)) {
    errorMessage.value = 'Por favor ingresa un correo electrónico válido'
    return false
  }

  if (!validarContrasena(form.value.contrasenaUsuario)) {
    errorMessage.value = 'La contraseña debe tener al menos 8 caracteres'
    return false
  }

  const paisCompleto = obtenerNombreCompletoPais(form.value.country)
  if (paisCompleto.length < 4) {
    errorMessage.value = 'El nombre del país es demasiado corto'
    return false
  }

  const ciudadCompleta = obtenerNombreCompletoCiudad(form.value.region, form.value.country)
  if (ciudadCompleta.length < 4) {
    errorMessage.value = 'El nombre de la ciudad es demasiado corto'
    return false
  }

  return true
}

const registrarUsuario = async () => {
  if (!validarFormulario()) return

  try {
    isLoading.value = true
    successMessage.value = ''

    const paisCompleto = obtenerNombreCompletoPais(form.value.country)
    const ciudadCompleta = obtenerNombreCompletoCiudad(form.value.region, form.value.country)

    const usuario = {
      nombresUsuario: form.value.nombresUsuario.trim(),
      apellidosUsuario: form.value.apellidosUsuario.trim(),
      fechaNacimientoUsuario: formatDate(form.value.fechaNacimientoUsuario),
      generoUsuario: form.value.generoUsuario,
      rhUsuario: form.value.rhUsuario,
      correoUsuario: form.value.correoUsuario.trim().toLowerCase(),
      contrasenaUsuario: form.value.contrasenaUsuario,
      ciudadUsuario: ciudadCompleta,
      paisUsuario: paisCompleto,
      idRol: idRol.value
    }

    await registerStore.registerUser(usuario)
    successMessage.value = '¡Registro exitoso! Redirigiendo...'
    router.push('/')
  } catch (error: any) {
    console.error('Error completo:', error)
    errorMessage.value = error.message || 'Error al registrar usuario. Por favor intenta nuevamente.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-white flex items-center justify-center p-4">
    <div class="flex flex-col md:flex-row w-full max-w-5xl shadow-lg bg-white rounded-xl overflow-hidden">
      <div class="hidden md:block md:w-1/2 bg-gray-100">
        <img
          class="w-full h-full object-cover"
          src="/assets/img/fondoLogin.png"
          alt="Imagen de registro"
        />
      </div>

      <div class="w-full md:w-1/2 p-4 md:p-5 flex flex-col justify-between">
        <h1 class="text-xl font-bold text-gray-700 mb-2 text-center">Crea una cuenta fácil</h1>

        <div v-if="errorMessage" class="mb-2 p-2 bg-red-100 text-red-700 rounded-lg text-sm">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="mb-2 p-2 bg-green-100 text-green-700 rounded-lg text-sm">
          {{ successMessage }}
        </div>

        <form @submit.prevent="registrarUsuario" class="space-y-1 flex-grow">
          <div>
            <LabelForm nameForm="Nombre" />
            <InputForm v-model="form.nombresUsuario" namePlaceholder="Nombre" inputClass="py-1.5 px-2 text-sm" />
          </div>

          <div>
            <LabelForm nameForm="Apellido" />
            <InputForm v-model="form.apellidosUsuario" namePlaceholder="Apellido" inputClass="py-1.5 px-2 text-sm" />
          </div>

          <div>
            <LabelForm nameForm="Fecha de Nacimiento" />
            <InputForm v-model="form.fechaNacimientoUsuario" inputType="date" inputClass="py-1.5 px-2 text-sm" />
          </div>

          <div>
            <LabelForm nameForm="Tipo de Sangre" />
            <select
              v-model="form.rhUsuario"
              class="border border-gray-300 rounded-2xl w-full py-2 px-3 bg-gray-50 text-gray-700 text-sm"
            >
              <option value="" disabled selected>Selecciona tu tipo de sangre</option>
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

          <div>
            <LabelForm nameForm="Género" />
            <select
              v-model="form.generoUsuario"
              class="border border-gray-300 rounded-2xl w-full py-2 px-3 bg-gray-50 text-gray-700 text-sm"
            >
              <option disabled value="">Selecciona tu género</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Otro">Otro</option>
              <option value="Prefiero no decirlo">Prefiero no decirlo</option>
            </select>
          </div>

          <div>
            <LabelForm nameForm="Correo" />
            <InputForm v-model="form.correoUsuario" inputType="email" namePlaceholder="Correo" inputClass="py-2 px-3 text-sm" />
          </div>

          <div>
            <LabelForm nameForm="Contraseña" />
            <InputForm v-model="form.contrasenaUsuario" inputType="password" namePlaceholder="Contraseña" inputClass="py-2 px-3 text-sm" />
          </div>

          <div>
            <LabelForm nameForm="País" />
            <select
              v-model="form.country"
              class="border border-gray-300 rounded-2xl w-full py-2 px-3 bg-gray-50 text-gray-700 text-sm"
            >
              <option disabled value="">Seleccione país</option>
              <option v-for="pais in paisesDisponibles" :key="pais.code" :value="pais.code">
                {{ pais.name }}
              </option>
            </select>
          </div>

          <div>
            <LabelForm nameForm="Ciudad" />
            <RegionSelect
              v-model="form.region"
              :country="form.country"
              placeholder="Seleccione ciudad"
              class="border border-gray-300 rounded-2xl w-full py-2 px-3 bg-gray-50 text-gray-700 text-sm"
              regionName
            />
          </div>

          <div class="pt-2">
            <ButtonLogin
              text="Registrate"
              :disabled="isLoading"
              :loading="isLoading"
              class="w-full"
            />
          </div>
        </form>

        <p class="text-gray-600 text-xs mt-2 text-center">
          ¿Tienes una cuenta?
          <RouterLink to="/" class="text-blue-500 hover:text-blue-700 font-medium">
            Iniciar Sesión
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rounded-2xl {
  border-radius: 1rem;
}
</style>
