// src/composables/useLogin.ts
import { reactive } from 'vue'
import { toast } from 'vue3-toastify'
import { loginStore } from '@/stores/login'

export function useLogin() {
  const formData = reactive({
    correoUser: '',
    pass: ''
  })

  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com)$/
  const login = loginStore()

 const handleClick = async () => {
    if (!formData.correoUser || !emailRegex.test(formData.correoUser)) {
      toast.warning('Ingrese un correo válido')
      return
    }

    if (!formData.pass) {
      toast.warning('Ingrese una contraseña')
      return
    }

    try {
      await login.validateUser(formData.correoUser, formData.pass)
    } catch (error) {
      console.error(error)
    }
  }

  return {
    formData,
    handleClick
  }
}
