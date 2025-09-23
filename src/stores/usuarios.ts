import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

interface Usuario {
  idUsuario: number
  nombresUsuario: string
  apellidosUsuario: string
  correoUsuario: string
  rhUsuario: string
  fechaNacimientoUsuario: string
  generoUsuario: string
  ciudadUsuario: string
  paisUsuario: string
  activo: boolean // <- Este lo usaremos para traducir desde "estado"
}

export const useUsuariosStore = defineStore('usuariosGestion', () => {
  const usuariosFiltrados = ref<Usuario[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // 🔄 Obtener todos los usuarios y adaptar "estado" a "activo"
  const fetchUsuarios = async () => {
    loading.value = true
    try {
      const response = await axios.get('https://glycopulse-back-production.up.railway.app/api/v1/usuarios')

      // Transformamos estado: 'Activo' | 'Inactivo' a activo: boolean
      usuariosFiltrados.value = response.data.map((usuario: any) => ({
        ...usuario,
        activo: usuario.estado === 'Activo'
      }))
    } catch (err) {
      error.value = 'Error al cargar los usuarios.'
      console.error('Error al cargar los usuarios:', err)
    } finally {
      loading.value = false
    }
  }
   // 👩‍⚕️ Obtener pacientes asignados a un doctor
  const fetchPacientesByDoctor = async (idDoctor: number) => {
    loading.value = true
    try {
      const response = await axios.get(
        `https://glycopulse-back-production.up.railway.app/api/v1/usuarios/doctor/${idDoctor}/pacientes`
      )
      usuariosFiltrados.value = response.data.map((usuario: any) => ({
        ...usuario,
        activo: usuario.estado === 'Activo'
      }))
      return usuariosFiltrados.value
    } catch (err) {
      error.value = 'Error al cargar pacientes del doctor.'
      console.error('Error al cargar pacientes del doctor:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // ✏️ Editar usuario
  const editarUsuario = async (usuarioEditado: any) => {
    try {
      const datosActualizados = {
        nombresUsuario: usuarioEditado.nombresUsuario,
        apellidosUsuario: usuarioEditado.apellidosUsuario,
        correoUsuario: usuarioEditado.correoUsuario,
        rhUsuario: usuarioEditado.rhUsuario,
        fechaNacimientoUsuario: usuarioEditado.fechaNacimientoUsuario,
        generoUsuario: usuarioEditado.generoUsuario,
        ciudadUsuario: usuarioEditado.ciudadUsuario,
        paisUsuario: usuarioEditado.paisUsuario,
        activo: usuarioEditado.activo, // será ignorado si backend usa "estado"
        idRol: usuarioEditado.rol.idRol //  el idRol se envía correctamente
      }

      // **CAMBIO AQUÍ: de axios.put a axios.patch**
      const response = await axios.patch(
        `https://glycopulse-back-production.up.railway.app/usuarios/${usuarioEditado.idUsuario}`,
        datosActualizados
      )

      if (response.status === 200) {
        const index = usuariosFiltrados.value.findIndex(
          (usuario) => usuario.idUsuario === usuarioEditado.idUsuario
        )

        if (index !== -1) {
          usuariosFiltrados.value[index] = {
            ...response.data,
            activo: response.data.estado === 'Activo' // Adaptar también aquí
          }
        }
      }
    } catch (err) {
      error.value = 'Error al editar el usuario.'
      console.error('Error al editar usuario:', err)
      throw new Error('Error al guardar los cambios: ' + err)
    }
  }

  
  const cambiarEstadoUsuario = async (idUsuario: number, nuevoEstado: boolean) => {
    try {
      const response = await axios.patch(
        `https://glycopulse-back-production.up.railway.app/api/v1/usuarios/${idUsuario}/estado/`,
        { activo: nuevoEstado }
      )

      if (response.status === 200) {
        const index = usuariosFiltrados.value.findIndex(
          (usuario) => usuario.idUsuario === idUsuario
        )
        if (index !== -1) {
          usuariosFiltrados.value[index].activo = nuevoEstado
        }
      }
    } catch (err) {
      error.value = 'Error al cambiar el estado del usuario.'
      console.error('Error al cambiar el estado del usuario:', err)
      throw err
    }
  }

  return {
    usuariosFiltrados,
    loading,
    error,
    fetchUsuarios,
    editarUsuario,
    fetchPacientesByDoctor, // ✅ nuevo
    cambiarEstadoUsuario
  }
})