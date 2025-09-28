// ====== Recomendaciones, Estado, Rango ======
export interface Recomendacion {
  idRecomendacion: number;
  tipoRecomendacion: string;
  descripcionRecomendacion: string;
}

export interface Estado {
  idEstado: number;
  nombreEstado: string;
  descripcionEstado: string;
}

export interface Rango {
  idRango: number;
  nombreRango: string;
  valorMinRango: number;
  valorMaxRango: number;
  momento: string;
  color:string;
}

// ====== Usuario ======
export interface Rol {
  idRol: number;
  nombreRol: string;
}

export interface Usuario {
  idUsuario: number;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: Rol;
}

// ====== RESPUESTA (ResponseGlucometriaDto) ======
export interface Glucometria {
  idGlucometria: number;
  fechaGlucometria: string; // Ejemplo: "Lun 23 Sep 2025"
  horaGlucometria: string;  // Ejemplo: "07:30 a. m."
  nivelGlucometria: number;
  momento: string; // Enum en backend
  usuario: Usuario;
  rango: Rango;
  estado: Estado;
  recomendaciones: Recomendacion[];
}

// ====== ENTRADAS (DTOs del backend) ======

// Para crear una glucometría (CreateGlucometriaDto)
export interface CrearGlucometriaDto {
  fechaGlucometria: string; // formato YYYY-MM-DD
  horaGlucometria: string;  // formato HH:mm:ss
  nivelGlucometria: number;
  momento: string;          //
}

// Para actualizar una glucometría (UpdateGlucometriaDto)
export interface ActualizarGlucometriaDto {
  fechaGlucometria?: string;
  horaGlucometria?: string;
  nivelGlucometria?: number;
  momento?: string;
}
