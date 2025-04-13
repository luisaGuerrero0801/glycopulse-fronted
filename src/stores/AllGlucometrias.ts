import { defineStore } from 'pinia'
import GlucometriasProvider from '@/providers/GlucometriasProvider'
import { toast } from 'vue3-toastify'
import type { Glucometria } from '@/types/glucometria'

export const useGlucometriasStore = defineStore('glucometrias', {
  state: () => ({
    glucometrias: [] as Glucometria[],
    loading: false,
    error: ''
  }),

  actions: {
    async verGlucos() {
      this.loading = true
      this.error = ''

      try {
        const response = await GlucometriasProvider.todasGlucometrias()
        this.glucometrias = response.data
      } catch (err: any) {
        this.error = 'Error al obtener las glucometrias'
        toast.error(this.error)
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async crearGlucometria(data: { fechaGlucometria: string; horaGlucometria: string; nivelGlucometria: number }) {
      this.loading = true
      this.error = ''
      try {
        const response = await GlucometriasProvider.crearGlucometria(data)
        console.log('Datos recibidos:', response.data)
        this.glucometrias.push(response.data)
        console.log()
        toast.success('Glucometría creada exitosamente')
      } catch (err) {
        this.error = 'Error al crear la glucometría'
        toast.error(this.error)
      } finally {
        this.loading = false
      }
    },

    async verDetalleGlucometria(id: number): Promise<Glucometria | null> {
      this.loading = true
      this.error = ''
      try {
        const response = await GlucometriasProvider.obtenerGlucometriaPorId(id)
        return response.data
      } catch (err) {
        this.error = 'Error al obtener el detalle de la glucometría'
        toast.error(this.error)
        console.error(err)
        return null
      } finally {
        this.loading = false
      }
    }
  }
})
