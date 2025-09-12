// src/stores/graficosAdmin.ts
import { defineStore } from 'pinia'
import graficosAdmin from '@/providers/graficosProvider'
import { toast } from 'vue3-toastify'
import type { ConteoRolRh } from '@/types/usuarios'

export const useGraficosAdminStore = defineStore('graficosAdmin', {
  state: () => ({
    conteoRolRh: [] as ConteoRolRh[],

    // KPIs
    totalUsuarios: 0 as number,
    totalAdmins: 0 as number,
    totalDoctores: 0 as number,
    totalPacientes: 0 as number,
    promedioPacientesPorDoctor: 0 as number,      // numérico
    porcentajeConDoctor: 0 as string | number,    // string por toFixed()
    pacientesSinDoctor: 0 as number,

    // Charts (lo más simple: any)
    chartUsuariosPorRol: null as any,
    chartDoctoresVsPacientes: null as any,
    chartPacientesPorDoctor: null as any,
    chartTopDoctores: null as any,
    chartEvolucionRegistros: null as any,
    chartActividadUsuarios: null as any,
    chartPacientesPorUbicacion: null as any,

    // control
    loading: false,
    error: ''
  }),

  actions: {
    async cargarDatos() {
      this.loading = true
      this.error = ''

      try {
        const response = await graficosAdmin.ConteoPorRol()
        this.conteoRolRh = response.data

        // === KPIs básicos ===
        this.totalUsuarios = this.conteoRolRh.reduce((acc, item) => acc + Number(item.cantidad), 0)
        this.totalAdmins = Number(this.conteoRolRh.find(r => r.rol === 'Admin')?.cantidad || 0)
        this.totalDoctores = Number(this.conteoRolRh.find(r => r.rol === 'Doctor')?.cantidad || 0)
        this.totalPacientes = Number(this.conteoRolRh.find(r => r.rol === 'Paciente')?.cantidad || 0)

        this.promedioPacientesPorDoctor = this.totalDoctores > 0
          ? parseFloat((this.totalPacientes / this.totalDoctores).toFixed(1))
          : 0

        this.pacientesSinDoctor = 10 // 👈 cambiar si tu API lo devuelve
        this.porcentajeConDoctor = this.totalPacientes > 0
          ? ((this.totalPacientes - this.pacientesSinDoctor) / this.totalPacientes * 100).toFixed(1)
          : 0

        // === Charts ===
        this.chartUsuariosPorRol = {
          labels: this.conteoRolRh.map(r => r.rol),
          datasets: [{
            data: this.conteoRolRh.map(r => Number(r.cantidad)),
            backgroundColor: ['#22c55e','#6366f1','#f97316','#3b82f6']
          }]
        }

        this.chartDoctoresVsPacientes = {
          labels: ['Doctores', 'Pacientes'],
          datasets: [{
            data: [this.totalDoctores, this.totalPacientes],
            backgroundColor: ['#8b5cf6','#f59e0b']
          }]
        }

        this.chartPacientesPorDoctor = {
          labels: ['Dr. A','Dr. B','Dr. C'],
          datasets: [{
            data: [10,20,15],
            backgroundColor: ['#3b82f6','#22c55e','#ef4444']
          }]
        }

        this.chartTopDoctores = {
          labels: ['Dr. X','Dr. Y','Dr. Z','Dr. M','Dr. N'],
          datasets: [{
            data: [30,25,20,15,10],
            backgroundColor: '#14b8a6'
          }]
        }

        this.chartEvolucionRegistros = {
          labels: ['Ene','Feb','Mar','Abr','May'],
          datasets: [{
            label: 'Usuarios',
            data: [5,10,20,40,60],
            borderColor: '#2563eb'
          }]
        }

        this.chartActividadUsuarios = {
          labels: ['Login','Consultas','Registros'],
          datasets: [{
            data: [50,80,30],
            backgroundColor: ['#f43f5e','#3b82f6','#22c55e']
          }]
        }

        this.chartPacientesPorUbicacion = {
          Bogotá: 40,
          Medellín: 25,
          Cali: 15,
          Barranquilla: 10,
          Otros: 5
        }

      } catch (err) {
        this.error = 'Error al obtener datos de gráficos'
        toast.error(this.error)
      } finally {
        this.loading = false
      }
    }
  }
})
