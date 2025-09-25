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
  nivel: string
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
        const token = sessionStorage.getItem('token')
        const res = await fetch(`${import.meta.env.VITE_API_URL}recetas`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
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
        // obtener idUsuario desde sessionStorage si existe
        const storedId = sessionStorage.getItem('idUsuario')
        const idUsuario = storedId ? Number(storedId) : 0
        if (!idUsuario) {
          console.warn(
            'crearReceta: idUsuario no encontrado en sessionStorage, usando 1 como fallback'
          )
        }

        // obtener token de sesión
        const token = sessionStorage.getItem('token')
        if (!token) {
          throw new Error('Token no encontrado en sessionStorage')
        }

        const body = {
          nombreReceta: receta.nombre,
          descripcionReceta: receta.descripcion,
          porcionesReceta: Number(receta.porciones),
          caloriasReceta: Number(receta.calorias),
          tiempoReceta: receta.tiempo,
          imagenReceta: receta.imagen || 'no-image', // por ahora solo nombre
          nivelReceta: receta.nivel,
          categoriaReceta: 'Favoritos',
          ingredientes: mapIngredientesFrontToBack(receta.ingredientes),
          pasos: mapPasosFrontToBack(receta.pasosPreparacion),
          idUsuario: idUsuario || 1
        }

        console.log('Payload que se envía a backend:', body)

        const res = await fetch(`${import.meta.env.VITE_API_URL}recetas`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` // 👈 token en header
          },
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
