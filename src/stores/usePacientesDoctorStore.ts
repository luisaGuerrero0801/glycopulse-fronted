// src/stores/usePacientesDoctorStore.ts
import { defineStore } from 'pinia'

interface Paciente {
  id: number
  nombre: string
  edad: number
  email: string
  telefono: string
  rh: string
  ubicacion: string
}

export const usePacientesDoctorStore = defineStore('pacientesDoctor', {
  state: () => ({
    pacientes: [] as Paciente[],
    loading: false,
    error: '' as string,
    searchQuery: '',
    selectedUbicacion: '',
  }),

  getters: {
    ubicacionesUnicas(state) {
      return [...new Set(state.pacientes.map(p => p.ubicacion))]
    },
    pacientesFiltrados(state) {
      return state.pacientes.filter((p) => {
        const coincideNombre = p.nombre.toLowerCase().includes(state.searchQuery.toLowerCase())
        const coincideUbicacion = state.selectedUbicacion
          ? p.ubicacion === state.selectedUbicacion
          : true
        return coincideNombre && coincideUbicacion
      })
    },
  },

  actions: {
    async fetchPacientesDoctor() {
      this.loading = true
      this.error = ''
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}usuarios/pacientes`)
        if (!res.ok) throw new Error('Error al cargar pacientes')
        this.pacientes = await res.json()
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
  },
})

