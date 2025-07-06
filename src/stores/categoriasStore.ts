import { defineStore } from 'pinia'
import CategoriasProvider from '@/providers/CategoriasProvider'
import type { Categoria } from '@/types/recetas'
import { toast } from 'vue3-toastify'

export const useCategoriasStore = defineStore('categorias', {
  state: () => ({
    categorias: [] as Categoria[],
    loading: false,
    error: ''
  }),

  actions: {
    async cargarCategorias() {
      this.loading = true
      this.error = ''

      try {
        const response = await CategoriasProvider.todasCategorias()
        this.categorias = response.data
      } catch (err: any) {
        this.error = 'Error al cargar categorías'
        toast.error(this.error)
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
})
