import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRegisterStore } from '@/stores/register'
import { toast } from 'vue3-toastify'
import { computed } from 'vue'

export function useRegister() {
  const router = useRouter()
  const registerStore = useRegisterStore()
  const soloNumeros = (texto: string) => /^[0-9]+$/.test(texto)
  const availableCities = computed(() => {
    return regionMap['CO']
  })

  const form = ref({
    nombresUsuario: '',
    apellidosUsuario: '',
    fechaNacimientoUsuario: '',
    generoUsuario: '',
    rhUsuario: '',
    correoUsuario: '',
    contrasenaUsuario: '',
    celularUsuario: '',
    region: ''
  })

  const idRol = ref(1)
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

  const validarEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  // Debe tener: mínimo 8 caracteres, mayúscula, minúscula, número y caracter especial
  const validarContrasena = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,_-]).{8,}$/
    return regex.test(password)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return new Date(dateString).toISOString().split('T')[0]
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
      {
        value: form.value.fechaNacimientoUsuario,
        message: 'La fecha de nacimiento es obligatoria'
      },
      { value: form.value.generoUsuario, message: 'Por favor selecciona tu género' },
      { value: form.value.rhUsuario, message: 'Por favor selecciona tu tipo de sangre' },
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
      toast.error(
        'La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y un caracter especial'
      )
      return false
    }
    if (
      !form.value.celularUsuario ||
      form.value.celularUsuario.length < 10 ||
      !soloNumeros(form.value.celularUsuario)
    ) {
      toast.error('El número de teléfono debe tener al menos 10 dígitos y solo números')
      return false
    }

    const ciudadCompleta = obtenerNombreCompletoCiudad(form.value.region, 'CO')
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
      celularUsuario: '',
      region: ''
    }
    successMessage.value = ''
  }

  const registrarUsuario = async () => {
    if (!validarFormulario()) return
    try {
      isLoading.value = true
      successMessage.value = ''

      const ciudadCompleta = obtenerNombreCompletoCiudad(form.value.region, 'CO')

      const usuario = {
        nombresUsuario: form.value.nombresUsuario.trim(),
        apellidosUsuario: form.value.apellidosUsuario.trim(),
        fechaNacimientoUsuario: formatDate(form.value.fechaNacimientoUsuario),
        generoUsuario: form.value.generoUsuario,
        rhUsuario: form.value.rhUsuario,
        correoUsuario: form.value.correoUsuario.trim().toLowerCase(),
        contrasenaUsuario: form.value.contrasenaUsuario,
        ciudadUsuario: ciudadCompleta,
        paisUsuario: 'Colombia', // 👈 agregado fijo aquí
        celularUsuario: form.value.celularUsuario,
        idRol: idRol.value
      }

      await registerStore.registerUser(usuario)


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

  return {
    form,
    registrarUsuario,
    resetForm,
    isLoading,
    successMessage,
    validarFormulario,
    soloLetras,
    onlyLetters,
    availableCities
  }
}
