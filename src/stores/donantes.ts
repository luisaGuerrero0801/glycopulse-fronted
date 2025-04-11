import { defineStore } from 'pinia'

export const useUsuariosStore = defineStore('usuarios', {
  state: () => ({
    usuarios: [] as any[],
    loading: false,
    error: null as string | null
  }),
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
    }
  }
})
