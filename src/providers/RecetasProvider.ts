import axios from '@/providers/axiosInstance'
import type { receta } from '@/types/recetas'

const BASE_URL = import.meta.env.VITE_API_URL + 'recetas'

const todasRecetas = (): Promise<{ data: receta[] }> => {
  return axios.get(BASE_URL)
}

const crearReceta = (data: {
  nombreReceta: string
  descripcionReceta: string
  porcionesReceta: number
  tiempoReceta: string
  imagenReceta: string
  nivelReceta: string
  ingredientesReceta: string
  preparacionReceta: string
  categoriaReceta: string[]
}): Promise<{ data: receta }> => {
  return axios.post(BASE_URL, data)
}

export default {
    todasRecetas,
    crearReceta
}