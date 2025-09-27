import axios from "@/providers/axiosInstance";

export interface ConteoRolRh {
  rol: string;
  rh: string;
  cantidad: number;
}

const BASE_URL = import.meta.env.VITE_API_URL + "usuarios";

export const getConteoPorRolRh = async (): Promise<ConteoRolRh[]> => {
  const res = await axios.get(`${BASE_URL}/conteo-rol-rh`);
  return res.data;
};
