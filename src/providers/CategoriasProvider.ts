import axios from '@/providers/axiosInstance'
import type { Categoria } from '@/types/recetas'

const BASE_URL = import.meta.env.VITE_API_URL + 'categorias'

const todasCategorias = (): Promise<{ data: Categoria[] }> => {
  return axios.get(BASE_URL)
}

export default {
    todasCategorias
}