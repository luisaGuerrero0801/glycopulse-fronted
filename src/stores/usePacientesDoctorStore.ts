// src/stores/usePacientesDoctorStore.ts
import { defineStore } from 'pinia'

interface Paciente {
  id: number
  nombre: string
  edad: number | null
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
        // ✅ Leer idDoctor desde sessionStorage
        const idDoctor = sessionStorage.getItem('idDoctor')
        if (!idDoctor) throw new Error('No se ha encontrado el ID del doctor en sessionStorage')

        // ✅ Fetch a la ruta correcta de backend
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}usuarios/doctor/${idDoctor}/pacientes`
        )

        if (!res.ok) {
          throw new Error(`Error al cargar pacientes: ${res.status} ${res.statusText}`)
        }

        const data = await res.json()
        console.log('👉 Datos recibidos de la API:', data)

        // 🔄 Mapear backend → interfaz Paciente
        this.pacientes = data.map((p: any) => ({
          id: p.idUsuario,
          nombre: `${p.nombresUsuario} ${p.apellidosUsuario}`,
          edad: this.calcularEdad(p.fechaNacimientoUsuario),
          email: p.correoUsuario,
          telefono: p.celularUsuario,
          rh: p.rhUsuario,
          ubicacion: p.ciudadUsuario,
           fechaNacimiento: p.fechaNacimientoUsuario,
        }))
      } catch (err: any) {
        this.error = err.message
        console.error('❌ Error en fetchPacientesDoctor:', err)
      } finally {
        this.loading = false
      }
    },

    calcularEdad(fecha: string) {
      if (!fecha) return null
      const hoy = new Date()
      const nacimiento = new Date(fecha)
      let edad = hoy.getFullYear() - nacimiento.getFullYear()
      const mes = hoy.getMonth() - nacimiento.getMonth()
      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--
      }
      return edad
    },
  },
})
