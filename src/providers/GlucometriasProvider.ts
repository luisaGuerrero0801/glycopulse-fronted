import instance from '@/providers/axiosInstance';
import type { 
  Glucometria, 
  CrearGlucometriaDto, 
  ActualizarGlucometriaDto 
} from '@/types/glucometria';

const BASE_URL = 'glucometrias';

/**
 * Crear una nueva glucometría (Paciente autenticado).
 */
const crearGlucometria = (data: CrearGlucometriaDto) => {
  return instance.post<Glucometria>(BASE_URL, data);
};

/**
 * Buscar glucometría por ID.
 */
const obtenerGlucometriaPorId = (id: number) => {
  return instance.get<Glucometria>(`${BASE_URL}/${id}`);
};

/**
 * Obtener la última glucometría registrada de un usuario.
 * Retorna solo { fecha, hora }.
 */
const obtenerUltimaPorUsuario = (userId: number) => {
  return instance.get<{ fecha: string; hora: string }>(`${BASE_URL}/last/${userId}`);
};

/**
 * Listar todas las glucometrías de un usuario, con filtros opcionales.
 */
const todasGlucometrias = (
  userId: number,
  filters?: {
    fechaGlucometria?: string;
    horaGlucometria?: string;
    rangoGlucometria?: string;
    orderFecha?: 'ASC' | 'DESC';
    orderFechaHora?: 'ASC' | 'DESC';
    orderNivel?: 'ASC' | 'DESC';
  }
) => {
  return instance.get<Glucometria[]>(`${BASE_URL}/user/${userId}`, {
    params: filters,
  });
};

/**
 * Actualizar glucometría (Paciente autenticado).
 */
const actualizarGlucometria = (idGlucometria: number, data: ActualizarGlucometriaDto) => {
  return instance.patch<Glucometria>(`${BASE_URL}/${idGlucometria}`, data);
};

const obtenerRangos = () => {
  return instance.get<string[]>(`${BASE_URL}/rangos/nombres`);
}

export default {
  todasGlucometrias, 
  crearGlucometria, 
  obtenerGlucometriaPorId, 
  obtenerUltimaPorUsuario,
  actualizarGlucometria,
  obtenerRangos
};
