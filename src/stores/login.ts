import { defineStore } from 'pinia'
import Login from '@/providers/LoginProvider'
import { toast } from 'vue3-toastify'
import router from '@/router'
import jwtDecode from 'jwt-decode'

interface DecodedToken {
  sub: number
  emailUser: string
  rol: string
}

export const loginStore = defineStore('login', {
  state: () => ({
    token: '',
    rol: '',
    idUsuario: null as number | null
  }),
  actions: {
     initStore() {
      // Mantener sesión al recargar
      this.token = sessionStorage.getItem('token') || ''
      this.rol = sessionStorage.getItem('rol') || ''
      const storedId = sessionStorage.getItem('idUsuario')
      this.idUsuario = storedId ? Number(storedId) : null
    },

async validateUser(correoUsuario: string, contrasenaUsuario: string) {
      try {
        const res = await Login.login({ correoUsuario, contrasenaUsuario })
        this.token = res.data.token
        const decodedToken: DecodedToken = jwtDecode(this.token)
        this.rol = decodedToken.rol
        this.idUsuario = decodedToken.sub

        sessionStorage.setItem('token', this.token)
        sessionStorage.setItem('rol', this.rol)
        if (this.idUsuario !== null) sessionStorage.setItem('idUsuario', this.idUsuario.toString())
        if (this.rol === 'Doctor' && this.idUsuario !== null) sessionStorage.setItem('idDoctor', this.idUsuario.toString())

        toast('Login correcto', { type: toast.TYPE.SUCCESS })

        if (this.rol === 'Paciente') router.push('/recetas-saludables')
        else if (this.rol === 'Doctor') router.push('/doctor/pacientes')
        else if (this.rol === 'Admin') router.push('/admin/panel')

      } catch (e: any) {
        const mensaje = e?.response?.data?.message || 'Error al iniciar sesión'
        toast(mensaje === 'El usuario está inactivo' ? 'Tu cuenta está inhabilitada.' : `❌ ${mensaje}`, 
              { type: mensaje === 'El usuario está inactivo' ? toast.TYPE.WARNING : toast.TYPE.ERROR })
        this.logout()
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
    },

    getUserId() {
      if (this.idUsuario !== null) return this.idUsuario
      const storedId = sessionStorage.getItem('idUsuario')
      return storedId !== null ? Number(storedId) : null
    }
  }
})
