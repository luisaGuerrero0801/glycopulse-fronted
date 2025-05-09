import axios from '@/providers/axiosInstance';
import type { Glucometria } from '@/types/glucometria';

const BASE_URL = import.meta.env.VITE_API_URL +"glucometrias";

const todasGlucometrias = (): Promise<{ data: Glucometria[] }> => {

    return axios.get(BASE_URL);
};

const crearGlucometria = (data: {
    fechaGlucometria: string;
    horaGlucometria: string;
    nivelGlucometria: number;
  }): Promise<{ data: Glucometria }> => {
    return axios.post(BASE_URL, data);
  };

  const obtenerGlucometriaPorId = (id: number): Promise<{ data: Glucometria }> => {
    return axios.get(`${BASE_URL}/${id}`)
  }
  
  const actualizarGlucometria = (
    id: number,
    data: {
      fechaGlucometria: string;
      horaGlucometria: string;
      nivelGlucometria: number;
    }
  ): Promise<{ data: Glucometria }> => {
    return axios.patch(`${BASE_URL}/${id}`, data)
  }

export default {
    todasGlucometrias,
    crearGlucometria,
    obtenerGlucometriaPorId,
    actualizarGlucometria
}