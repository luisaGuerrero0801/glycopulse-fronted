// VistaHomeRecetas.ts
import { defineStore } from 'pinia'
import axios from 'axios'

interface Ingrediente {
  nombre: string
  cantidad: number | null
  unidad: string
}

interface Paso {
  numero: number
  descripcion: string
}

interface Receta {
  idReceta: number
  nombre: string
  descripcion: string
  nivel: string
  porciones: number
  calorias: number
  tiempo: string
  imagenReceta?: string
  ingredientes?: Ingrediente[]
  pasosPreparacion?: Paso[]
  esFavorito?: boolean   // 👈 agregado
}

export const useRecetasPacienteStore = defineStore('recetasPaciente', {
  state: () => ({
    recetas: [] as Receta[],
    cargando: false,
    error: '' as string | null
    
  }),
  actions: {
    async fetchRecetasPaciente(idUsuario: number) {
      this.cargando = true
      this.error = null
      try {
        const token = sessionStorage.getItem('token')
        if (!token) throw new Error('Token no encontrado en sessionStorage')

        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}recetas/usuario/${idUsuario}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        // 🔹 Mapear datos del backend → frontend
        this.recetas = Array.isArray(data)
          ? data.map((r: any) => ({
              idReceta: r.idReceta,
              nombre: r.nombreReceta,
              descripcion: r.descripcionReceta,
              nivel: r.nivelReceta,
              porciones: r.porcionesReceta,
              calorias: r.caloriasReceta,
              tiempo: r.tiempoReceta,
              imagenReceta: r.imagenReceta,
              ingredientes: r.ingredientes.map((i: any) => ({
                nombre: i.ingrediente.nombreIngrediente,
                cantidad: i.cantidadIngredienteReceta,
                unidad: i.medidaIngredienteReceta
              })),
              pasosPreparacion: r.pasos
                .sort((a: any, b: any) => a.ordenPasoReceta - b.ordenPasoReceta)
                .map((p: any) => ({
                  descripcion: p.descripcionPasoReceta
                })),esFavorito:false       
            }))
          : []
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Error al cargar recetas'
      } finally {
        this.cargando = false
      }
    }
  }
})
