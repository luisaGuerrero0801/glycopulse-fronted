
import { defineStore } from 'pinia'


import type { Patient } from '../types/patient'


interface DraftPatient {
  name: string;
  email: string;
  status: string;
  specialist: string;
  date: Date;
}

export const usePatientStore = defineStore('patientStore', {
  state: () => ({
    patients: [] as Patient[]
  }),
  actions: {
    addPatient(data: DraftPatient) {
      const newPatient: Patient = {
        id: Date.now(),
        ...data
      }
      this.patients.push(newPatient)
      this.saveToLocalStorage()
    },
    saveToLocalStorage() {
      localStorage.setItem('patients', JSON.stringify(this.patients))
    },
    loadFromLocalStorage() {
      const stored = localStorage.getItem('patients')
      if (stored) {
        this.patients = JSON.parse(stored).map((patient: any) => ({
          ...patient,
          date: new Date(patient.date)
        }))
      }
    }
  }
})