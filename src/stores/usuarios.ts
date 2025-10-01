import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
const { VITE_API_URL } = import.meta.env

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
  activo: boolean
}

export const useUsuariosStore = defineStore('usuariosGestion', () => {
  const usuariosFiltrados = ref<Usuario[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchUsuarios = async () => {
    loading.value = true
    try {
      const response = await axios.get(`${VITE_API_URL}usuarios`)
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

  const fetchPacientesByDoctor = async (idDoctor: number) => {
    loading.value = true
    try {
      const response = await axios.get(
        `${VITE_API_URL}usuarios/doctor/${idDoctor}/pacientes`
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
        activo: usuarioEditado.activo,
        idRol: usuarioEditado.rol.idRol
      }

      const response = await axios.patch(
        `${VITE_API_URL}usuarios/${usuarioEditado.idUsuario}`,
        datosActualizados
      )

      if (response.status === 200) {
        const index = usuariosFiltrados.value.findIndex(
          (usuario) => usuario.idUsuario === usuarioEditado.idUsuario
        )

        if (index !== -1) {
          usuariosFiltrados.value[index] = {
            ...response.data,
            activo: response.data.estado === 'Activo'
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
        `${VITE_API_URL}usuarios/${idUsuario}/estado`,
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

  const asignarDoctor = async (idPaciente: number, idDoctor: number) => {
    loading.value = true
    try {
      const response = await axios.post(
        `${VITE_API_URL}usuarios/${idPaciente}/asignar-doctor`,
        { idDoctor }
      )

      if (response.status === 200) {
        const index = usuariosFiltrados.value.findIndex(
          (usuario) => usuario.idUsuario === idPaciente
        )

        if (index !== -1) {
          usuariosFiltrados.value[index] = {
            ...response.data,
            activo: response.data.estado === 'Activo'
          }
        }
      }

      return response.data
    } catch (err) {
      error.value = 'Error al asignar el doctor.'
      console.error('Error al asignar doctor:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    usuariosFiltrados,
    loading,
    error,
    fetchUsuarios,
    editarUsuario,
    fetchPacientesByDoctor,
    cambiarEstadoUsuario,
    asignarDoctor
  }
})
