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
      this.token = sessionStorage.getItem('token') || ''
      this.rol = sessionStorage.getItem('rol') || ''
      const storedId = sessionStorage.getItem('idUsuario')
      this.idUsuario = storedId ? Number(storedId) : null
    },

    async validateUser(correoUsuario: string, contrasenaUsuario: string) {
      try {
        const res = await Login.login({
          correoUsuario,
          contrasenaUsuario
        })

        // Si el login fue exitoso, guardar token y datos
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

        // 👇 Guardar idDoctor si el usuario es Doctor
        if (this.rol === 'Doctor' && this.idUsuario !== null) {
          sessionStorage.setItem('idDoctor', this.idUsuario.toString())
        }

        toast('Login correcto', { type: toast.TYPE.SUCCESS })

        // Redirección por rol
        if (this.rol === 'Paciente') {
          router.push('/asignar')
        } else if (this.rol === 'Doctor') {
          router.push('/doctor/pacientes')
        } else if (this.rol === 'Admin') {
          router.push('/admin/panel')
        }

      } catch (e: any) {
        const mensaje = e?.response?.data?.message || 'Error al iniciar sesión. Verifica tus datos o intenta más tarde.'
        if (mensaje === 'El usuario está inactivo') {
          toast(' Tu cuenta está inhabilitada. Contacta al administrador.', {
            type: toast.TYPE.WARNING
          })
        } else {
          toast(`❌ ${mensaje}`, {
            type: toast.TYPE.ERROR
          })
        }
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