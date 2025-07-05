// src/stores/recoverAccountStore.ts
import { defineStore } from 'pinia'
import axios from '@/providers/axiosInstance'
import { toast } from 'vue3-toastify'

export const useRecoverAccountStore = defineStore('recoverAccount', {
  state: () => ({
    correo: '',
    cargando: false,
    enviado: false,
  }),

  actions: {
    async enviarCorreoRecuperacion() {
  // ✅ Validación de correo
  if (!this.correo || !this.correo.includes('@')) {
    toast.error('📧 Ingresa un correo válido.')
    return
  }

  this.cargando = true
  try {
    await axios.post('/auth/recuperar-cuenta', { correo: this.correo })
    this.enviado = true
    toast.success('✅ Si el correo está registrado, recibirás un mensaje con instrucciones.')
  } catch (error: any) {
    toast.error(error?.response?.data?.message || '❌ Error al intentar recuperar la cuenta.')
  } finally {
    this.cargando = false
  }
},


    limpiarEstado() {
      this.correo = ''
      this.cargando = false
      this.enviado = false
    }
  }
})
