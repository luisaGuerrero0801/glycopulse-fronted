// src/providers/Register.Provider.ts
import axios from './axiosInstance'

const BASE_URL = import.meta.env.VITE_API_URL + 'usuarios/'

const register = (usuario: {
  nombresUsuario: string
  apellidosUsuario: string
  fechaNacimientoUsuario: string
  generoUsuario: string
  rhUsuario: string
  correoUsuario: string
  contrasenaUsuario: string
  ciudadUsuario: string
  paisUsuario: string
  idRol: number
}) => {
  return axios.post(BASE_URL, usuario)
}

export default {
  register
}
