import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useUsuariosStore = defineStore('usuarios', {
  state: () => ({
    usuarios: [] as any[],
    loading: false,
    error: null as string | null,
    filtros: {
      busqueda: '',
      ubicacion: '',
      grupoSanguineo: ''
    }
  }),

  getters: {
    
    usuariosFiltrados: (state) => {
      return state.usuarios.filter((usuario) => {
        const textoBusqueda = state.filtros.busqueda.toLowerCase()
        const nombreCompleto = `${usuario.nombresUsuario} ${usuario.apellidosUsuario}`.toLowerCase()

        return (
          nombreCompleto.includes(textoBusqueda) &&
          (!state.filtros.ubicacion || usuario.ciudadUsuario === state.filtros.ubicacion) &&
          (!state.filtros.grupoSanguineo || usuario.rhUsuario === state.filtros.grupoSanguineo)
        )
      })
    },

    
    ubicacionesUnicas: (state) => {
      const ciudades = new Set(state.usuarios.map((u) => u.ciudadUsuario))
      return Array.from(ciudades).sort()
    }
  },

  actions: {
    async fetchUsuarios() {
      this.loading = true
      this.error = null
      try {
        const resp = await fetch('http://localhost:3000/api/v1/usuarios')
        if (!resp.ok) {
          throw new Error('Error al obtener usuarios')
        }
        const data = await resp.json()
        this.usuarios = data
      } catch (error: any) {
        this.error = error.message
        console.error('Error en fetchUsuarios:', error)
      } finally {
        this.loading = false
      }
    },

    actualizarFiltros(nuevosFiltros: {
      busqueda: string
      ubicacion: string
      grupoSanguineo: string
    }) {
      this.filtros = nuevosFiltros
    }
  }
})
