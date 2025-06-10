// src/stores/login.ts
import { defineStore } from 'pinia'
import Login from '@/providers/LoginProvider'
import { toast } from 'vue3-toastify'
import router from '@/router'
import jwtDecode from 'jwt-decode'


interface DecodedToken {
  sub: number;
  emailUser: string;
  rol: string;
}

export const loginStore = defineStore('login', {
  state: () => ({
    token: '',
    rol: '',
    idUsuario: null as number | null
  }),
  actions: {
    async validateUser(correoUsuario: string, contrasenaUsuario: string) {
      try {
        const res = await Login.login({
          correoUsuario,
          contrasenaUsuario
        })

        this.token = res.data.token
        const decodedToken: DecodedToken = jwtDecode(this.token)
        this.rol = decodedToken.rol
        this.idUsuario = decodedToken.sub

        sessionStorage.setItem('token', this.token)
        sessionStorage.setItem('rol', this.rol)
    
        if (this.idUsuario !== null) {
          sessionStorage.setItem('idUsuario', this.idUsuario.toString())
        } else {
          console.warn('ID de usuario no definido, no se guardó en sessionStorage')
        }

        toast('Login Correcto', { type: toast.TYPE.SUCCESS })

        if (this.rol === 'Paciente') {
          router.push('/recetas-saludables')
        } else if (this.rol === 'Doctor') {
          router.push('/register')
        } else if (this.rol=== 'Admin') {
          router.push('/admin')
        }
      } catch (e) {
        toast('Login Incorrecto', { type: toast.TYPE.ERROR })
      }
    },

    logout() {
      this.token = ''
      this.rol = ''
      sessionStorage.clear()
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('rol')
      sessionStorage.removeItem('idUsuario')
      router.push('/')
    },

    isLoggedIn() {
      return !!sessionStorage.getItem('token')
    },

    getRol() {
      return sessionStorage.getItem('rol')
    },

    getUserId() {
      if (this.idUsuario !== null) return this.idUsuario
      const storedId = sessionStorage.getItem('idUsuario')
      return storedId !== null ? Number(storedId) : null
    }
  }
})
