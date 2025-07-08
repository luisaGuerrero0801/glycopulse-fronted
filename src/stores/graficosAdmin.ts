import { defineStore } from 'pinia'
import graficosAdmin from '@/providers/graficosProvider'
import { toast } from 'vue3-toastify'
import type { ConteoRolRh } from '@/types/usuarios'

export const graficosStore = defineStore('GRAFICOS', {
  state: () => ({
    conteoRolRh: [] as ConteoRolRh[],
    loading: false,
    error: ''
  }),

  actions: {
    async cargarConteoRolRh() {
      this.loading = true
      this.error = ''

      try {
        const response = await graficosAdmin.ConteoPorRol()
        this.conteoRolRh = response.data
        // console.log('Conteo obtenido:', this.conteoRolRh)
      } catch (err) {
        this.error = 'Error al obtener conteo de usuarios por rol y RH'
        toast.error(this.error)
        // console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
})
