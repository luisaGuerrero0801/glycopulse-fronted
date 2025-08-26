// src/types/patient.ts
export type Patient = {
  id: number;
  name: string;
  email: string;
  status: string;
  specialist: string;
  date: Date;
};

export type DraftPatient = {
  name: string;
  email: string;
  status: string;
  specialist: string;
  date: Date;
};