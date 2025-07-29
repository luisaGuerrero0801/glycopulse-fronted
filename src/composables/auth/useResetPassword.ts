import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useResetPasswordStore } from '@/stores/resetPassword'

export function useResetPassword() {
  const router = useRouter()
  const route = useRoute()
  const store = useResetPasswordStore()

  // Cargar token desde URL
  store.token = String(route.query.token || '')

  // Acciones
  const cambiarContrasena = async () => {
    const exito = await store.enviarNuevaContrasena()
    if (exito) {
      toast.success('Tu contraseña ha sido cambiada exitosamente.')
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
  }

  const cancelar = () => {
    store.resetFormulario()
    router.push('/')
  }

  return {
    cambiarContrasena,
    cancelar,
    store
  }
}
