<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ButtonLogin from '../atoms/ButtonLogin.vue'
import { LabelForm, InputForm } from '../atoms/index.js'
import { CountrySelect, RegionSelect } from 'vue3-country-region-select'
import { useRegisterStore } from '@/stores/register'
import { useNotificacionesStore } from '@/stores/notificaciones'
import { toast } from 'vue3-toastify'
import _ from 'lodash'

const router = useRouter()
const registerStore = useRegisterStore()
const notificaciones = useNotificacionesStore()

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

const idRol = ref(2)
const isLoading = ref(false)
const successMessage = ref('')

const countryMap: Record<string, string> = {
  CO: 'Colombia'
}

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

const soloLetras = (campo: 'nombresUsuario' | 'apellidosUsuario') => {
  const texto = form.value[campo]
  const limpio = texto.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
  form.value[campo] = limpio
}

const soloLetrasValidas = (texto: string) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(texto.trim())

const onlyLetters = (e: KeyboardEvent) => {
  const char = String.fromCharCode(e.keyCode)
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/
  if (!regex.test(char)) {
    e.preventDefault()
  }
  successMessage.value = ''
}

const calcularEdad = (fechaNacimiento: string) => {
  const hoy = new Date()
  const nacimiento = new Date(fechaNacimiento)
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }

  return edad
}

const validarFormulario = () => {
  soloLetras('nombresUsuario')
  soloLetras('apellidosUsuario')

  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com)$/

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
      toast.error(campo.message)
      return false
    }
  }

  if (!soloLetrasValidas(form.value.nombresUsuario)) {
    toast.error('El nombre solo debe contener letras')
    return false
  }

  if (!soloLetrasValidas(form.value.apellidosUsuario)) {
    toast.error('El apellido solo debe contener letras')
    return false
  }

  const edad = calcularEdad(form.value.fechaNacimientoUsuario)
  if (edad < 10) {
    toast.error('Debes tener al menos 10 años para registrarte')
    return false
  }

  if (!validarEmail(form.value.correoUsuario) || !emailRegex.test(form.value.correoUsuario)) {
    toast.error('Por favor ingresa un correo electrónico válido')
    return false
  }

  if (!validarContrasena(form.value.contrasenaUsuario)) {
    toast.error('La contraseña debe tener al menos 8 caracteres')
    return false
  }

  const paisCompleto = obtenerNombreCompletoPais(form.value.country)
  if (paisCompleto.length < 4) {
    toast.error('El nombre del país es demasiado corto')
    return false
  }

  const ciudadCompleta = obtenerNombreCompletoCiudad(form.value.region, form.value.country)
  if (ciudadCompleta.length < 4) {
    toast.error('El nombre de la ciudad es demasiado corto')
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
  successMessage.value = ''
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

    notificaciones.agregar(`👤 Nuevo usuario registrado: ${usuario.nombresUsuario} ${usuario.apellidosUsuario}`)

    successMessage.value = '¡Registro exitoso! Redirigiendo...'
    router.push('/')
  } catch (error: any) {
    console.error('Error completo:', error)
    console.dir(error)

    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      String(error)

    if (typeof msg === 'string' && msg.toLowerCase().includes('correo')) {
      toast.error('El correo ya está en uso. Por favor, usa otro correo.')
    } else {
      toast.error(msg || 'Error al registrar usuario. Por favor intenta nuevamente.')
    }
  } finally {
    isLoading.value = false
  }
}
</script>
<template>
  <div class="min-h-screen bg-indigo-50 flex items-center justify-center p-1 overflow-x-hidden">
    <div
      class="flex flex-col md:flex-row w-full max-w-5xl shadow-lg bg-white rounded-xl overflow-hidden"
      style="min-height: 90vh"
    >
      <!-- Imagen (oculta en móviles) -->
      <div class="hidden md:block md:w-1/2 bg-gray-100">
        <img
          class="w-full h-full object-cover"
          src="/assets/img/fondoLogin.png"
          alt="Imagen de registro"
        />
      </div>

      <!-- Formulario -->
      <div class="w-full md:w-1/2 p-2 md:p-4 flex flex-col">
        <h1 class="text-xl font-bold text-gray-700 mb-0.5 text-center">Crea una cuenta fácil</h1>

        <!-- Mensaje de éxito -->
        <div v-if="successMessage" class="mb-4 p-1 bg-green-100 text-green-700 rounded-lg text-sm">
          {{ successMessage }}
        </div>

        <form @submit.prevent="registrarUsuario" class="flex flex-col gap-1 flex-grow">
          <!-- Nombre -->
          <LabelForm nameForm="Nombre" />
          <InputForm
            namePlaceholder="Nombre"
            v-model="form.nombresUsuario"
            @input="
              () => {
                form.nombresUsuario = _.startCase(_.toLower(form.nombresUsuario))
                soloLetras('nombresUsuario')
              }
            "
            @keypress="onlyLetters($event)"
            @blur="validarFormulario"
          />

          <!-- Apellido -->
          <div>
            <LabelForm nameForm="Apellido" />
            <InputForm
              namePlaceholder="Apellido"
              v-model="form.apellidosUsuario"
              @input="
                () => {
                  form.apellidosUsuario = _.startCase(_.toLower(form.apellidosUsuario))
                  soloLetras('apellidosUsuario')
                }
              "
              @keypress="onlyLetters($event)"
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
              class="border border-gray-300 rounded-2xl w-full p-2 mt-0.5 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              class="border border-gray-300 rounded-2xl w-full p-2 mt-1 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <select
              v-model="form.country"
              class="border border-gray-300 rounded-2xl w-full p-2 mt-0.5 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="validarFormulario"
            >
              <option disabled value="">Seleccione país</option>
              <option v-for="pais in paisesDisponibles" :key="pais.code" :value="pais.code">
                {{ pais.name }}
              </option>
            </select>
          </div>

          <!-- Ciudad -->
          <div>
            <LabelForm nameForm="Ciudad" />
            <RegionSelect
              v-model="form.region"
              :country="form.country"
              placeholder="Seleccione ciudad"
              class="border border-gray-300 rounded-2xl w-full p-2 mt-0.5 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <p class="text-gray-600 text-sm mt-2 text-center">
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
