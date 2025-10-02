<template>
  <div class="md:w-1/2 lg:w-2/5 mx-auto px-4">
    <h2 class="font-black text-3xl text-center">Seguimiento Consultas</h2>

    <p class="text-lg mt-5 text-center mb-10">
      Agenda tu cita y
      <span class="text-[var(--colorPrimarioTexto)] font-bold"> Adminístrala</span>
    </p>

    <!-- Estados de carga -->
    <div v-if="usuariosStore.loading" class="text-center text-blue-600 font-bold mt-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      Cargando información del usuario...
      <p class="text-sm mt-2">ID buscado: {{ idUsuarioActual }}</p>
      <p class="text-sm">Usuarios cargados: {{ todosLosUsuarios.length }}</p>
    </div>

    <!-- Error -->
    <div v-else-if="usuariosStore.error" class="text-center text-red-600 font-bold mt-10">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <p>Error: {{ usuariosStore.error }}</p>
        <button 
          @click="cargarUsuarios"
          class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
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
          <p>Total usuarios cargados: {{ todosLosUsuarios.length }}</p>
          <p>IDs disponibles: {{ idsDisponibles.join(', ') || 'Ninguno' }}</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-2 justify-center">
          <button 
            @click="cargarUsuarios"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Recargar Usuarios
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

    <!-- Debug info -->
    <div class="mt-8 p-4 bg-gray-100 rounded-lg text-xs">
      <h4 class="font-bold mb-2">Información del Sistema:</h4>
      <p><strong>ID Usuario Actual:</strong> {{ idUsuarioActual }}</p>
      <p><strong>Usuario Encontrado:</strong> {{ donanteActual ? 'Sí' : 'No' }}</p>
      <p><strong>Total Usuarios Cargados:</strong> {{ todosLosUsuarios.length }}</p>
      <p><strong>Especialistas Encontrados:</strong> {{ especialistas.length }}</p>
      <p><strong>IDs Disponibles:</strong> {{ idsDisponibles.join(', ') }}</p>
      
      <div class="mt-3">
        <h5 class="font-bold mb-1">Lista completa de usuarios:</h5>
        <div v-for="usuario in todosLosUsuarios" :key="usuario.idUsuario" 
             class="flex justify-between items-center p-1 border-b"
             :class="usuario.idUsuario === idUsuarioActual ? 'bg-green-100' : ''">
          <span>ID: {{ usuario.idUsuario }} - {{ usuario.nombresUsuario }} {{ usuario.apellidosUsuario }}</span>
          <span v-if="usuario.idUsuario === idUsuarioActual" class="bg-green-500 text-white px-2 py-1 rounded text-xs">
            ACTUAL
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePatientStore } from '@/stores/PatientForm'
import { useUsuariosStore } from '@/stores/donantes' // Importar el store correcto
import { toast } from 'vue3-toastify'

// Router y Stores
const router = useRouter()
const patientStore = usePatientStore()
const usuariosStore = useUsuariosStore() // Usar el store de usuarios

// Estados reactivos
const processing = ref(false)

const patientData = ref({
  specialist: '',
  date: ''
})

const idUsuarioActual = ref<number | null>(null)

// Computed - Usar directamente los usuarios del store
const todosLosUsuarios = computed(() => {
  return usuariosStore.usuariosFiltrados || []
})

const donanteActual = computed(() => {
  if (idUsuarioActual.value === null) return null
  
  const usuario = todosLosUsuarios.value.find(
    (d: any) => d.idUsuario === idUsuarioActual.value
  )
  
  console.log('🔍 Buscando usuario ID:', idUsuarioActual.value, 'Encontrado:', usuario)
  return usuario || null
})

const idsDisponibles = computed(() => {
  return todosLosUsuarios.value.map((u: any) => u.idUsuario).sort((a, b) => a - b)
})

const especialistas = computed(() => {
  return todosLosUsuarios.value.filter((usuario: any) => {
    // Ajusta según cómo esté estructurado el rol en tu API
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
const cargarUsuarios = async () => {
  try {
    console.log('🔄 Cargando usuarios desde el store...')
    await usuariosStore.fetchUsuarios()
    
    console.log('✅ Usuarios cargados:', todosLosUsuarios.value.length)
    console.log('📋 IDs disponibles:', idsDisponibles.value)
    
    if (donanteActual.value) {
      toast.success('Usuario encontrado correctamente')
    } else {
      toast.warning(`Usuario con ID ${idUsuarioActual.value} no encontrado`)
    }
  } catch (error) {
    console.error('❌ Error al cargar usuarios:', error)
    toast.error('Error al cargar los usuarios')
  }
}

const volverAlLogin = () => {
  sessionStorage.clear()
  router.push('/login')
}

const obtenerIdUsuario = (): number | null => {
  console.log('🔎 Buscando ID en sessionStorage...')
  
  // Revisar sessionStorage completo para debugging
  const sessionKeys = Object.keys(sessionStorage)
  console.log('🗝️ Llaves en sessionStorage:', sessionKeys)
  
  sessionKeys.forEach(key => {
    console.log(`📝 ${key}:`, sessionStorage.getItem(key))
  })

  const sources = [
    sessionStorage.getItem('idUsuario'),
    localStorage.getItem('idUsuario'),
    sessionStorage.getItem('userId'),
    localStorage.getItem('userId'),
    sessionStorage.getItem('user_id'),
    localStorage.getItem('user_id'),
    sessionStorage.getItem('id'),
    localStorage.getItem('id')
  ]
  
  for (const source of sources) {
    if (source && !isNaN(Number(source))) {
      console.log('🎯 ID encontrado en storage:', source)
      return Number(source)
    }
  }
  
  console.warn('❌ No se encontró ID en ningún storage')
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
    // Obtener ID del usuario
    idUsuarioActual.value = obtenerIdUsuario()
    
    if (!idUsuarioActual.value) {
      toast.error('No se encontró ID de usuario. Por favor, inicia sesión nuevamente.')
      return
    }

    console.log('🚀 Iniciando carga con ID:', idUsuarioActual.value)

    // Cargar usuarios desde el store
    await cargarUsuarios()

    if (donanteActual.value) {
      console.log('🎉 Usuario encontrado exitosamente:', donanteActual.value)
    } else {
      console.error('❌ Usuario NO encontrado después de carga')
      console.log('📊 Estado actual:')
      console.log('- ID buscado:', idUsuarioActual.value)
      console.log('- Total usuarios cargados:', todosLosUsuarios.value.length)
      console.log('- IDs disponibles:', idsDisponibles.value)
    }

  } catch (error) {
    console.error('💥 Error crítico al cargar datos:', error)
    toast.error('Error crítico al cargar la información')
  }
})
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>