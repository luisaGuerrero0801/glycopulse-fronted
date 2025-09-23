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
  idUsuario?: number   // 👈 paciente asignado
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
     * crearReceta: recibe el objeto del front, paciente asignado y opcionalmente el File de imagen
     */
    async crearReceta(
      receta: Omit<Receta, 'idReceta'>,
      imagen?: File
    ) {
      try {
        if (!receta.idUsuario) {
          throw new Error('⚠️ No se seleccionó paciente para la receta')
        }

        const body = {
          nombreReceta: receta.nombre,
          descripcionReceta: receta.descripcion,
          porcionesReceta: Number(receta.porciones),
          caloriasReceta: Number(receta.calorias),
          tiempoReceta: receta.tiempo,
          imagenReceta: receta.imagen || 'no-image',
          nivelReceta: receta.nivel,
          categoriaReceta: 'General',
          ingredientes: mapIngredientesFrontToBack(receta.ingredientes),
          pasos: mapPasosFrontToBack(receta.pasosPreparacion),
          idUsuario: receta.idUsuario   // 👈 paciente seleccionado en el form
        }

        console.log('Payload que se envía a backend:', body)

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
