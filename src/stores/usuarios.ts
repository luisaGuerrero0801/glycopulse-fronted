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
  activo: boolean
}

export const useUsuariosStore = defineStore('usuarios', () => {
  const usuariosFiltrados = ref<Usuario[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // 🔄 Obtener todos los usuarios
  const fetchUsuarios = async () => {
    loading.value = true
    try {
      const response = await axios.get('http://localhost:3000/api/v1/usuarios')
      usuariosFiltrados.value = response.data
    } catch (err) {
      error.value = 'Error al cargar los usuarios.'
      console.error('Error al cargar los usuarios:', err)
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
        paissenaUsuario: usuarioEditado.paisUsuario,
        activo: usuarioEditado.activo
      }

      console.log('Enviando PUT con:', datosActualizados)

      const response = await axios.put(
        `http://localhost:3000/api/v1/usuarios/${usuarioEditado.idUsuario}`,
        datosActualizados
      )

      if (response.status === 200) {
        const index = usuariosFiltrados.value.findIndex(
          (usuario) => usuario.idUsuario === usuarioEditado.idUsuario
        )

        if (index !== -1) {
          usuariosFiltrados.value[index] = response.data
        }
      }
    } catch (err) {
      error.value = 'Error al editar el usuario.'
      console.error('Error al editar usuario:', err)
      throw new Error('Error al guardar los cambios: ' + err)
    }
  }

  // 🔄 Cambiar estado (activar / desactivar usuario)
  const cambiarEstadoUsuario = async (idUsuario: number, nuevoEstado: boolean) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/v1/usuarios/${idUsuario}`, {
        activo: nuevoEstado
      })

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
    cambiarEstadoUsuario
  }
})
