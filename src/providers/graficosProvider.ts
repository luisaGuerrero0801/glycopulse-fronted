import axios from '@/providers/axiosInstance'
import type { ConteoRolRh } from '@/types/usuarios'

const BASE_URL = import.meta.env.VITE_API_URL + 'usuarios'

const ConteoPorRol = (): Promise<{ data: ConteoRolRh[] }> => {
  return axios.get(`${BASE_URL}/conteo-rol-rh`)
}

export default {
  ConteoPorRol
}
