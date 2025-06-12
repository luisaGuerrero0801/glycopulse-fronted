// src/stores/register.ts
// import { defineStore } from 'pinia'
// import AuthService from '@/providers/Register.Provider'
// import { toast } from 'vue3-toastify'
// import router from '@/router'

// import type { UsuarioRegistro } from '@/types/Usuario'

// export const registerStore = defineStore('register', {
//   state: () => ({
//     isRegistering: false
//   }),
//   actions: {
//     async registerUser(usuario: UsuarioRegistro) {
//       this.isRegistering = true
//       try {
//         await AuthService.register(usuario)
//         toast('Usuario registrado con éxito', { type: toast.TYPE.SUCCESS })
//         router.push('/')
//       } catch (error) {
//         console.error('Error al registrar:', error)
//         toast('Error al registrar usuario', { type: toast.TYPE.ERROR })
//       } finally {
//         this.isRegistering = false
//       }
//     }
//   }
// })

import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'

export const useRegisterStore = defineStore('register', {
  actions: {
    async registerUser(userData: any) {
      try {
        const response = await axios.post('http://localhost:3000/api/v1/usuarios/', userData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        router.push('/')
        return response.data
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Mostrar el mensaje de error específico del backend
          const errorMessage = error.response?.data?.message || 
                             error.response?.data?.error ||
                             'Error al registrar usuario'
          throw new Error(errorMessage)
        }
        throw error
      }
    }
  }
})
