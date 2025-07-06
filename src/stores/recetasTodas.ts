import { defineStore } from 'pinia'
import RecetasProvider from '@/providers/RecetasProvider'
import { toast } from 'vue3-toastify'
import type { receta } from '@/types/recetas'

export const useRecetasStore = defineStore('recetas', {
  state: () => ({
    recetas: [] as receta[],
    favoritos: [] as receta[],
    loading: false,
    error: ''
  }),

  actions: {
    async verTodasRecetas() {
      this.loading = true
      this.error = ''

      try {
        const response = await RecetasProvider.todasRecetas()
        this.recetas = response.data
      } catch (err: any) {
        this.error = 'Error al obtener recetas'
        toast.error(this.error)
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async crearReceta(data: {
      nombreReceta: string
      descripcionReceta: string
      porcionesReceta: number
      tiempoReceta: string
      imagenReceta: string
      nivelReceta: string
      ingredientesReceta: string
      preparacionReceta: string
      categoriaReceta: string[]
    }) {
      this.loading = true
      this.error = ''
      try {
        const response = await RecetasProvider.crearReceta(data)
        console.log('Datos recibidos:', response.data)
        this.recetas.push(response.data)
        toast.success('Receta creada exitosamente')
      } catch (err) {
        this.error = 'Error al crear la Receta'
        toast.error(this.error)
      } finally {
        this.loading = false
      }
    }
  }
})
