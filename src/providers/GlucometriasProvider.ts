import axios from '@/providers/axiosInstance';
import type { Glucometria } from '@/types/glucometria';

const BASE_URL = import.meta.env.VITE_API_URL +"glucometrias";

const todasGlucometrias = (): Promise<{ data: Glucometria[] }> => {

    return axios.get(BASE_URL);
};

export default {
    todasGlucometrias
}