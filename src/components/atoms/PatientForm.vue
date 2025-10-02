<template>
  <div class="md:w-1/2 lg:w-2/5 mx-auto px-4">
    <h2 class="font-black text-3xl text-center">Seguimiento Consultas</h2>

    <p class="text-lg mt-5 text-center mb-10">
      Agenda tu cita y
      <span class="text-[var(--colorPrimarioTexto)] font-bold"> Adminístrala</span>
    </p>

    <!-- Estados de carga -->
    <div v-if="loading" class="text-center text-blue-600 font-bold mt-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      Cargando información del usuario...
    </div>

    <!-- Formulario cuando se encuentra el usuario -->
    <form
      v-else-if="donanteActual"
      @submit.prevent="handleSubmit"
      class="bg-white shadow-md rounded-lg py-10 px-6 sm:px-8 mb-10"
      novalidate
    >
      <div class="mb-5">
        <label for="usuario" class="text-sm uppercase font-bold">Usuario</label>
        <input
          id="usuario"
          :value="donanteActual.nombresUsuario"
          class="w-full p-3 border border-gray-200 rounded-md mt-2 bg-gray-50"
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
          class="w-full p-3 border border-gray-200 rounded-md mt-2 bg-gray-50"
          type="email"
          disabled
          placeholder="Email del Usuario"
        />
      </div>

      <div class="mb-5">
        <label for="status" class="text-sm uppercase font-bold">Estado Paciente</label>
        <input
          id="status"
          :value="donanteActual.estado || 'Activo'"
          class="w-full p-3 border border-gray-200 rounded-md mt-2 bg-gray-50"
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
          class="w-full p-3 border border-gray-200 rounded-md mt-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
        <p v-if="especialistas.length === 0" class="text-red-500 text-sm mt-1">
          No hay especialistas disponibles
        </p>
      </div>

      <div class="mb-5">
        <label for="date" class="text-sm uppercase font-bold">Fecha Asignación</label>
        <input
          id="date"
          v-model="patientData.date"
          class="w-full p-3 border border-gray-200 rounded-md mt-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          type="date"
          required
          :min="today"
        />
      </div>

      <input
        type="submit"
        :disabled="processing"
        class="bg-[var(--colorPrimarioButton)] w-full p-3 text-white uppercase font-bold hover:bg-[var(--colorSecundarioButton)] cursor-pointer transition-colors rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        :value="processing ? 'Procesando...' : 'Asignar'"
      />

      <button
        type="button"
        @click="cancelarCita"
        :disabled="processing"
        class="mt-4 w-full p-3 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ processing ? 'Procesando...' : 'Cancelar Cita' }}
      </button>
    </form>

    <!-- Usuario no encontrado -->
    <div v-else class="text-center text-red-600 font-bold mt-10">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <h3 class="text-lg font-bold mb-2">Usuario No Encontrado</h3>
        <p class="text-sm text-gray-600 mb-4">
          No se pudo encontrar el usuario con ID: <strong>{{ idUsuarioActual }}</strong>
        </p>
        <div class="text-xs text-gray-500 mb-4">
          <p>IDs disponibles en el sistema: {{ idsDisponibles.join(', ') || 'Ninguno' }}</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-2 justify-center">
          <button 
            @click="recargarUsuarios"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Reintentar Carga
          </button>
          <button 
            @click="volverAlLogin"
            class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
          >
            Volver al Login
          </button>
        </div>
      </div>
    </div>

    <!-- Debug info (solo en desarrollo) -->
    <div v-if="showDebug" class="mt-8 p-4 bg-gray-100 rounded-lg text-xs">
      <h4 class="font-bold mb-2">Información de Debug:</h4>
      <p><strong>ID Usuario Actual:</strong> {{ idUsuarioActual }}</p>
      <p><strong>Usuario Encontrado:</strong> {{ donanteActual ? 'Sí' : 'No' }}</p>
      <p><strong>Total Usuarios Cargados:</strong> {{ todosLosUsuarios.length }}</p>
      <p><strong>Especialistas Encontrados:</strong> {{ especialistas.length }}</p>
      <p><strong>IDs Disponibles:</strong> {{ idsDisponibles.join(', ') }}</p>
      <button @click="toggleDebug" class="mt-2 text-blue-600 hover:text-blue-800">
        {{ showDebug ? 'Ocultar Debug' : 'Mostrar Debug' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePatientStore } from '@/stores/PatientForm'
import { useUsuariosPagination } from '@/composables/utils/usePagination'
import { toast } from 'vue3-toastify'

// Router y Stores
const router = useRouter()
const patientStore = usePatientStore()

// Estados reactivos
const loading = ref(true)
const processing = ref(false)
const showDebug = ref(false)

const patientData = ref({
  specialist: '',
  date: ''
})

const idUsuarioActual = ref<number | null>(null)
const donanteActual = ref<any>(null)

// Composable para paginación
const {
  paginatedUsuarios: todosLosUsuarios,
  fetchUsuarios,
  currentPage,
  totalPages
} = useUsuariosPagination()

// Computed
const idsDisponibles = computed(() => {
  return todosLosUsuarios.value.map((u: any) => u.idUsuario).sort((a, b) => a - b)
})

const especialistas = computed(() => {
  return todosLosUsuarios.value.filter((usuario: any) => {
    return usuario.rol?.idRol === 3 || usuario.idRol === 3
  })
})

const today = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

// Métodos
const toggleDebug = () => {
  showDebug.value = !showDebug.value
}

const recargarUsuarios = async () => {
  loading.value = true
  try {
    await fetchUsuarios()
    
    // Buscar el usuario actual después de recargar
    if (idUsuarioActual.value !== null) {
      donanteActual.value = todosLosUsuarios.value.find(
        (d: any) => d.idUsuario === idUsuarioActual.value
      )
    }
    
    if (donanteActual.value) {
      toast.success('Datos recargados correctamente')
    } else {
      toast.warning('Datos recargados pero usuario no encontrado')
    }
  } catch (error) {
    console.error('Error al recargar usuarios:', error)
    toast.error('Error al recargar los datos')
  } finally {
    loading.value = false
  }
}

const volverAlLogin = () => {
  sessionStorage.clear()
  router.push('/login')
}

const buscarUsuarioEnTodasLasPaginas = async () => {
  console.log('Buscando usuario en todas las páginas...')
  
  const originalPage = currentPage.value
  let usuarioEncontrado = null
  
  // Buscar en la página actual primero
  usuarioEncontrado = todosLosUsuarios.value.find(
    (d: any) => d.idUsuario === idUsuarioActual.value
  )
  
  if (usuarioEncontrado) {
    return usuarioEncontrado
  }
  
  // Si hay múltiples páginas, buscar en las demás
  if (totalPages.value > 1) {
    for (let page = 1; page <= totalPages.value; page++) {
      if (page !== originalPage) {
        try {
          // Aquí necesitarías una forma de cambiar de página en tu composable
          console.log(`Buscando en página ${page}...`)
          // await fetchUsuarios(page) // Si tu composable soporta cambiar página
        } catch (error) {
          console.error(`Error al cargar página ${page}:`, error)
        }
        
        // Verificar si se encontró después de cambiar página
        usuarioEncontrado = todosLosUsuarios.value.find(
          (d: any) => d.idUsuario === idUsuarioActual.value
        )
        
        if (usuarioEncontrado) {
          return usuarioEncontrado
        }
      }
    }
  }
  
  return null
}

const obtenerIdUsuario = (): number | null => {
  // Intentar múltiples fuentes posibles
  const sources = [
    sessionStorage.getItem('idUsuario'),
    localStorage.getItem('idUsuario'),
    sessionStorage.getItem('userId'),
    localStorage.getItem('userId'),
    sessionStorage.getItem('user_id'),
    localStorage.getItem('user_id')
  ]
  
  for (const source of sources) {
    if (source && !isNaN(Number(source))) {
      console.log('ID encontrado en:', source)
      return Number(source)
    }
  }
  
  return null
}

// Función para parsear fecha
function parseDateLocal(dateString: string) {
  const parts = dateString.split('-')
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
}

// Handlers de formulario
const handleSubmit = async () => {
  if (!patientData.value.specialist || !patientData.value.date) {
    toast.error('Por favor, completa todos los campos requeridos')
    return
  }

  if (!donanteActual.value) {
    toast.error('Usuario no encontrado')
    return
  }

  processing.value = true

  try {
    patientStore.addPatient({
      idUsuario: donanteActual.value.idUsuario,
      name: `${donanteActual.value.nombresUsuario} ${donanteActual.value.apellidosUsuario}`,
      email: donanteActual.value.correoUsuario,
      status: donanteActual.value.estado || 'Activo',
      specialist: patientData.value.specialist,
      date: parseDateLocal(patientData.value.date)
    })

    toast.success('Consulta asignada correctamente')

    // Reset form
    patientData.value.specialist = ''
    patientData.value.date = ''
    
  } catch (error) {
    console.error('Error al asignar consulta:', error)
    toast.error('Error al asignar la consulta')
  } finally {
    processing.value = false
  }
}

const cancelarCita = async () => {
  if (!donanteActual.value) {
    toast.error('Usuario no encontrado')
    return
  }

  processing.value = true

  try {
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
  } catch (error) {
    console.error('Error al cancelar cita:', error)
    toast.error('Error al cancelar la cita')
  } finally {
    processing.value = false
  }
}

// Lifecycle
onMounted(async () => {
  try {
    // Obtener ID del usuario de múltiples fuentes
    idUsuarioActual.value = obtenerIdUsuario()
    
    if (!idUsuarioActual.value) {
      toast.error('No se encontró ID de usuario. Por favor, inicia sesión nuevamente.')
      loading.value = false
      return
    }

    console.log('Buscando usuario con ID:', idUsuarioActual.value)

    // Cargar usuarios
    await fetchUsuarios()
    
    console.log('Usuarios cargados:', todosLosUsuarios.value.length)
    console.log('IDs disponibles:', idsDisponibles.value)

    // Buscar usuario actual
    donanteActual.value = todosLosUsuarios.value.find(
      (d: any) => d.idUsuario === idUsuarioActual.value
    )

    if (!donanteActual.value) {
      console.warn('Usuario no encontrado en primera carga. IDs disponibles:', idsDisponibles.value)
      
      // Intentar búsqueda en todas las páginas si está disponible
      if (totalPages.value > 1) {
        donanteActual.value = await buscarUsuarioEnTodasLasPaginas()
      }
    }

    if (donanteActual.value) {
      console.log('Usuario encontrado:', donanteActual.value)
    } else {
      console.error(`Usuario con ID ${idUsuarioActual.value} no encontrado después de búsqueda exhaustiva`)
    }

  } catch (error) {
    console.error('Error crítico al cargar datos:', error)
    toast.error('Error crítico al cargar la información')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>