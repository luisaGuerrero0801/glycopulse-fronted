import { defineStore } from 'pinia'
import GlucometriasProvider from '@/providers/GlucometriasProvider'
import { toast } from 'vue3-toastify'
import type {
  ActualizarGlucometriaDto,
  CrearGlucometriaDto,
  Glucometria
} from '@/types/glucometria'
import type { AxiosResponse } from 'axios'

export const useGlucometriasStore = defineStore('glucometrias', {
  state: () => ({
    rangos: [] as string[],
    glucometrias: [] as Glucometria[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async verGlucos(
      userId: number,
      filters?: {
        fechaGlucometria?: string
        rangoGlucometria?: string
        orderFecha?: 'ASC' | 'DESC'
        orderNivel?: 'ASC' | 'DESC'
      }
    ) {
      this.loading = true
      this.error = null

      try {
        const { data } = await GlucometriasProvider.todasGlucometrias(userId, filters)
        this.glucometrias = data
        if (!data || data.length === 0) {
          this.error = null
          console.info('No hay registros de glucometrías')
        }
      } catch (err: any) {
        this.error = 'Error al cargar glucometrías'
        toast.error(this.error)
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async crearGlucometria(userId: number, payload: CrearGlucometriaDto) {
      this.loading = true
      this.error = null
      try {
        const payloadConUsuario = {
          ...payload,
          idUsuario: userId
        }
        const { data } = await GlucometriasProvider.crearGlucometria(payloadConUsuario)
        toast.success('Glucometría creada correctamente')
        // Refrescar lista
        await this.verGlucos(userId)
        return data
      } catch (err: any) {
        this.error = 'Error al crear glucometría'
        toast.error(this.error)
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async actualizarGlucometria(
      userId: number,
      idGlucometria: number,
      payload: ActualizarGlucometriaDto
    ) {
      this.loading = true
      this.error = null
      try {
        const { data } = await GlucometriasProvider.actualizarGlucometria(idGlucometria, payload)
        toast.success('Glucometría actualizada correctamente')
        // Refrescar lista
        await this.verGlucos(userId)
        return data
      } catch (err: any) {
        this.error = 'Error al actualizar glucometría'
        toast.error(this.error)
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async verDetalleGlucometria(idGlucometria: number) {
      this.loading = true
      this.error = null
      try {
        const { data } = await GlucometriasProvider.obtenerGlucometriaPorId(idGlucometria)
        return data
      } catch (err: any) {
        this.error = 'Error al obtener el detalle de la glucometría'
        toast.error(this.error)
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async obtenerUltimaGlucometria(userId: number) {
      this.loading = true
      this.error = null
      try {
        const response: AxiosResponse<{ fecha: string; hora: string } | null> =
          await GlucometriasProvider.obtenerUltimaPorUsuario(userId)

        const data = response.data

        // Si el backend devuelve vacío o null
        if (!data) {
          console.info('No hay registros de glucometrías para este usuario.')
          return null
        }

        return data
      } catch (err: any) {
        // Si el backend devuelve 404 → significa que no hay registros
        if (err?.response?.status === 404) {
          console.info('No hay glucometrías registradas (404 del servidor).')
          return null
        }

        this.error = 'Error al obtener la última glucometría'
        console.error(err)
        return null
      } finally {
        this.loading = false
      }
    },

    async obtenerRangosStore() {
      try {
        const res = await GlucometriasProvider.obtenerRangos()
        this.rangos = res.data
      } catch (err) {
        console.error('Error al obtener rangos', err)
      }
    }
  }
})
