import { defineStore } from 'pinia'
import GlucometriasProvider from '@/providers/GlucometriasProvider'
import { toast } from 'vue3-toastify'
import type {
  ActualizarGlucometriaDto,
  CrearGlucometriaDto,
  Glucometria
} from '@/types/glucometria'

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
        console.log("Payload glucometria STORE ******", data)
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
        this.error = 'Error al obtener eldetalle de la glucometría'
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
        const { data } = await GlucometriasProvider.obtenerUltimaPorUsuario(userId)
        return data
      } catch (err: any) {
        this.error = 'Error al obtener última glucometría'
        toast.error(this.error)
        console.error(err)
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
