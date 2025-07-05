import { defineStore } from 'pinia'
import axios from '@/providers/axiosInstance'
import { toast } from 'vue3-toastify'

export const useResetPasswordStore = defineStore('resetPassword', {
  state: () => ({
    nuevaContrasena: '',
    confirmarContrasena: '',
    token: '',
    cargando: false
  }),

  actions: {
    async enviarNuevaContrasena() {
      if (!this.nuevaContrasena || !this.confirmarContrasena) {
        toast.error('⚠️ Por favor llena todos los campos.')
        return
      }

      if (this.nuevaContrasena !== this.confirmarContrasena) {
        toast.error('⚠️ Las contraseñas no coinciden.')
        return
      }

      this.cargando = true
      // ✅ Validación del token
      if (!this.token) {
        toast.error('⚠️ Token inválido o ausente.')
        return false
      }

      try {
        await axios.post('/auth/reset-password', {
          nuevaContrasena: this.nuevaContrasena,
          token: this.token
        })

        toast.success('✅ Contraseña actualizada correctamente.')
        this.resetFormulario()
        return true
      } catch (error: any) {
        toast.error(error?.response?.data?.message || '❌ Error al cambiar la contraseña.')
        return false
      } finally {
        this.cargando = false
      }
    },

    resetFormulario() {
      this.nuevaContrasena = ''
      this.confirmarContrasena = ''
      this.token = ''
      this.cargando = false
    }
  }
})
