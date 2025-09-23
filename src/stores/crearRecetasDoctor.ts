// src/stores/crearRecetasDoctor.ts
import { defineStore } from 'pinia'
import { mapPasosFrontToBack } from '@/helpers/mapPasos'
import { mapIngredientesFrontToBack } from '@/helpers/mapIngredientes'

interface Ingrediente {
  nombre: string
  cantidad: number | null
  unidad: string
}

interface Receta {
  idReceta?: number
  nombre: string
  descripcion: string
  dificultad: string
  porciones: number
  calorias: number
  tiempo: string
  imagen?: string
  ingredientes: Ingrediente[]
  pasosPreparacion: string[]
}

export const useRecetasStore = defineStore('recetas', {
  state: () => ({
    recetas: [] as Receta[],
    cargando: false,
    error: null as string | null
  }),

  actions: {
    async fetchRecetas() {
      this.cargando = true
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}recetas`)
        if (!res.ok) throw new Error('Error al cargar recetas')
        this.recetas = await res.json()
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.cargando = false
      }
    },

    /**
     * crearReceta: recibe el objeto del front y opcionalmente el File de imagen
     * Mapea ingredientes y pasos y hace POST al backend en formato JSON.
     */
    async crearReceta(receta: Omit<Receta, 'idReceta'>, imagen?: File) {
      try {
        // obtener idUsuario desde sessionStorage si existe (recomendado)
        const storedId = sessionStorage.getItem('idUsuario')
        const idUsuario = storedId ? Number(storedId) : 0
        if (!idUsuario) {
          console.warn('crearReceta: idUsuario no encontrado en sessionStorage, usando 1 como fallback')
        }

        const body = {
          nombreReceta: receta.nombre,
          descripcionReceta: receta.descripcion,
          porcionesReceta: Number(receta.porciones),
          caloriasReceta: Number(receta.calorias),
          tiempoReceta: receta.tiempo,
          imagenReceta: imagen ? imagen.name : 'no-image', // por ahora mandamos el nombre para pasar la validación
          nivelReceta: receta.dificultad,
          categoriaReceta: 'General',
          ingredientes: mapIngredientesFrontToBack(receta.ingredientes),
          pasos: mapPasosFrontToBack(receta.pasosPreparacion),
          idUsuario: idUsuario || 1
        }
 // 👇 Aquí mostramos el JSON que realmente viaja al backend
    console.log("Payload que se envía a backend:", body)

        

        const res = await fetch(`${import.meta.env.VITE_API_URL}recetas`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
})

        if (!res.ok) {
          const text = await res.text().catch(() => null)
          throw new Error(text || 'Error al crear receta')
        }

        const nueva = await res.json()
        this.recetas.push(nueva)
        return nueva
      } catch (err: any) {
        this.error = err.message
        throw err
      }
    }
  }
})