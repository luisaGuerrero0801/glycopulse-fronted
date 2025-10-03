import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useResetPasswordStore } from '@/stores/resetPassword'

export function useResetPassword() {
  const router = useRouter()
  const route = useRoute()
  const store = useResetPasswordStore()

  // Cargar token desde URL
  store.token = String(route.query.token || '')

  // Función de validación
  const validarFormulario = (): boolean => {
    if (!store.nuevaContrasena || store.nuevaContrasena.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres')
      return false
    }
    if (store.nuevaContrasena !== store.confirmarContrasena) {
      toast.error('Las contraseñas no coinciden')
      return false
    }
    return true
  }

  // Acción para cambiar contraseña
  const cambiarContrasena = async () => {
    if (!validarFormulario()) return // ❌ Si no pasa la validación, no continúa

    try {
      store.cargando = true
      const exito = await store.enviarNuevaContrasena()
      if (exito) {
        toast.success('Tu contraseña ha sido cambiada exitosamente.')
        setTimeout(() => {
          router.push('/')
        }, 2000)
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al cambiar la contraseña')
    } finally {
      store.cargando = false
    }
  }

  // Acción para cancelar y resetear formulario
  const cancelar = () => {
    store.resetFormulario()
    router.push('/')
  }

  return {
    store,
    cambiarContrasena,
    cancelar,
    validarFormulario, // opcionalmente puedes exponerla si quieres usarla en el template
  }
}
