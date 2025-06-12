<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ButtonLogin from '../atoms/ButtonLogin.vue'
import { LabelForm, InputForm } from '../atoms/index.js'
import { CountrySelect, RegionSelect } from 'vue3-country-region-select'
import { useRegisterStore } from '@/stores/register'

const router = useRouter()
const registerStore = useRegisterStore()

// Estados del formulario
const form = ref({
  nombresUsuario: '',
  apellidosUsuario: '',
  fechaNacimientoUsuario: '',
  generoUsuario: '',
  rhUsuario: '',
  correoUsuario: '',
  contrasenaUsuario: '',
  country: '',
  region: ''
})
const idRol = ref(2)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Mapeo de códigos a nombres completos
const countryMap: Record<string, string> = {
  CO: 'Colombia',
  US: 'Estados Unidos',
  MX: 'México',
  ES: 'España',
  AR: 'Argentina',
  PE: 'Perú',
  CL: 'Chile',
  BR: 'Brasil'
}

const regionMap: Record<string, Record<string, string>> = {
  CO: {
    'DC': 'Bogotá D.C.',
    'ANT': 'Antioquia',
    'VAL': 'Valle del Cauca',
    'SAN': 'Santander',
    'BOY': 'Boyacá'
  },
  US: {
    'NY': 'New York',
    'CA': 'California',
    'FL': 'Florida',
    'TX': 'Texas',
    'IL': 'Illinois'
  }
}

// Funciones de validación
const validarEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const validarContrasena = (password: string) => password.length >= 8

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toISOString().split('T')[0]
}

const obtenerNombreCompletoPais = (codigoPais: string) => {
  return codigoPais.length > 4 || codigoPais.includes(' ') ? codigoPais : countryMap[codigoPais] || codigoPais
}

const obtenerNombreCompletoCiudad = (codigoCiudad: string, codigoPais: string) => {
  return codigoCiudad.length > 4 || codigoCiudad.includes(' ') ? codigoCiudad : 
    (regionMap[codigoPais] || {})[codigoCiudad] || codigoCiudad
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

const resetForm = () => {
  form.value = {
    nombresUsuario: '',
    apellidosUsuario: '',
    fechaNacimientoUsuario: '',
    generoUsuario: '',
    rhUsuario: '',
    correoUsuario: '',
    contrasenaUsuario: '',
    country: '',
    region: ''
  }
  errorMessage.value = ''
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
  <div class="min-h-screen bg-white flex items-center justify-center p-4 overflow-x-hidden">
    <div class="flex flex-col md:flex-row w-full max-w-5xl shadow-lg bg-white rounded-xl overflow-hidden" style="min-height: 90vh;">
      <!-- Imagen (oculta en móviles) -->
      <div class="hidden md:block md:w-1/2 bg-gray-100">
        <img
          class="w-full h-full object-cover"
          src="/assets/img/fondoLogin.png"
          alt="Imagen de registro"
        />
      </div>

      <!-- Formulario -->
      <div class="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
        <h1 class="text-2xl font-bold text-gray-700 mb-4 text-center">Crea una cuenta fácil</h1>

        <!-- Mensajes de estado -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
          {{ successMessage }}
        </div>

        <form @submit.prevent="registrarUsuario" class="space-y-4 flex-grow">
          <!-- Nombre -->
          <div>
            <LabelForm nameForm="Nombre" />
            <InputForm 
              namePlaceholder="Nombre" 
              v-model="form.nombresUsuario"
              @blur="validarFormulario"
            />
          </div>

          <!-- Apellido -->
          <div>
            <LabelForm nameForm="Apellido" />
            <InputForm 
              namePlaceholder="Apellido" 
              v-model="form.apellidosUsuario"
              @blur="validarFormulario"
            />
          </div>

          <!-- Fecha de Nacimiento -->
          <div>
            <LabelForm nameForm="Fecha de Nacimiento" />
            <InputForm
              namePlaceholder="Fecha de nacimiento"
              inputType="date"
              v-model="form.fechaNacimientoUsuario"
              @blur="validarFormulario"
            />
          </div>

          <!-- Tipo de Sangre -->
          <div>
            <LabelForm nameForm="Tipo de Sangre" />
            <select
              v-model="form.rhUsuario"
              class="border border-gray-300 rounded-2xl w-full p-3 mt-1 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="validarFormulario"
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

          <!-- Género -->
          <div>
            <LabelForm nameForm="Género" />
            <select
              v-model="form.generoUsuario"
              class="border border-gray-300 rounded-2xl w-full p-3 mt-1 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="validarFormulario"
            >
              <option disabled value="">Selecciona tu género</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Otro">Otro</option>
              <option value="Prefiero no decirlo">Prefiero no decirlo</option>
            </select>
          </div>

          <!-- Correo -->
          <div>
            <LabelForm nameForm="Correo" />
            <InputForm 
              namePlaceholder="Correo" 
              inputType="email" 
              v-model="form.correoUsuario"
              @blur="validarFormulario"
            />
          </div>

          <!-- Contraseña -->
          <div>
            <LabelForm nameForm="Contraseña" />
            <InputForm 
              namePlaceholder="Contraseña" 
              inputType="password" 
              v-model="form.contrasenaUsuario"
              @blur="validarFormulario"
            />
          </div>

          <!-- País -->
          <div>
            <LabelForm nameForm="País" />
            <CountrySelect
              v-model="form.country"
              placeholder="Seleccione país"
              class="border border-gray-300 rounded-2xl w-full p-3 mt-1 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              countryName
              @change="validarFormulario"
            />
          </div>

          <!-- Ciudad -->
          <div>
            <LabelForm nameForm="Ciudad" />
            <RegionSelect
              v-model="form.region"
              :country="form.country"
              placeholder="Seleccione ciudad"
              class="border border-gray-300 rounded-2xl w-full p-3 mt-1 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              regionName
              @change="validarFormulario"
            />
          </div>

          <!-- Botón de registro -->
          <div class="pt-4">
            <ButtonLogin 
              text="Registrate" 
              :disabled="isLoading"
              :loading="isLoading"
              class="w-full"
            />
          </div>
        </form>

        <p class="text-gray-600 text-sm mt-4 text-center">
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
/* Estilos personalizados si son necesarios */
.rounded-2xl {
  border-radius: 1rem;
}
</style>