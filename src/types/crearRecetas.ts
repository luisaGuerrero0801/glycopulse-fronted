// src/types/crearRecetas.ts
export interface Ingrediente {
  nombre: string
  cantidad: number | null
  unidad: string
}

export interface Receta {
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
