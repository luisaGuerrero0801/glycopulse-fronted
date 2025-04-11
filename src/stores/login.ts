// src/stores/login.ts
import { defineStore } from 'pinia'
import Login from '@/providers/LoginProvider'
import { toast } from 'vue3-toastify'
import router from '@/router'

export const loginStore = defineStore('login', {
  state: () => ({
    token: '',
    rol: ''
  }),
  actions: {
    async validateUser(correoUsuario: string, contrasenaUsuario: string) {
      try {
        const res = await Login.login({
          correoUsuario,
          contrasenaUsuario
        })

        this.token = res.data.token
        this.rol = res.data.rol

        sessionStorage.setItem('token', this.token)
        sessionStorage.setItem('rol', this.rol)

        toast('Login Correcto', { type: toast.TYPE.SUCCESS })

        if (this.rol === 'Paciente') {
          router.push('/recetas-saludables')
        } else if (this.rol === 'Doctor') {
          router.push('/register')
        } else {
          router.push('/register')
        }
      } catch (e) {
        toast('Login Incorrecto', { type: toast.TYPE.ERROR })
      }
    },

    logout() {
      this.token = ''
      this.rol = ''
      sessionStorage.clear()
      router.push('/')
    },

    isLoggedIn() {
      return !!sessionStorage.getItem('token')
    },

    getRol() {
      return sessionStorage.getItem('rol')
    }
  }
})
