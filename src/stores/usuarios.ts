import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

interface Usuario {
  idUsuario: number
  nombresUsuario: string
  apellidosUsuario: string
  correoUsuario: string
  rhUsuario: string
  activo: boolean
}

export const useUsuariosStore = defineStore('usuarios', () => {
  const usuariosFiltrados = ref<Usuario[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

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

  const editarUsuario = async (usuarioEditado: Usuario) => {
    try {
      const response = await axios.put(`/api/usuarios/${usuarioEditado.idUsuario}`, usuarioEditado)

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
    }
  }

  return {
    usuariosFiltrados,
    loading,
    error,
    fetchUsuarios,
    editarUsuario,
  }
})
