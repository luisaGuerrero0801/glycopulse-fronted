import { defineStore } from 'pinia'

export const useNotificacionesStore = defineStore('notificaciones', {
  state: () => ({
    lista: [] as { mensaje: string; fecha: string; leido: boolean; emergente?: boolean }[]
  }),

  actions: {
    agregar(mensaje: string, emergente = false) {
      const fecha = new Date().toLocaleString()
      this.lista.unshift({ mensaje, fecha, leido: false, emergente })
    },

    marcarLeido(index: number) {
      this.lista[index].leido = true
    },

    limpiar() {
      this.lista = []
    },

    dobleNotificacion(mensaje: string) {
      this.agregar(mensaje) // para la bandeja (persistente)
      this.agregar(mensaje, true) // para el toast emergente
    }
  }
})
