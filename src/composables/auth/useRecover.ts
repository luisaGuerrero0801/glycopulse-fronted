import { useRouter } from 'vue-router'
import { useRecoverAccountStore } from '@/stores/recoverAccount'

import { watch } from 'vue'


export function  useRecover(){


const store = useRecoverAccountStore()
const router = useRouter()

// Redirige si ya fue enviado
watch(
  () => store.enviado,
  (enviado) => {
    if (enviado) {
      store.limpiarEstado()
      router.push('/')
    }
  }
)

const cancelarRecuperacion = () => {
  store.limpiarEstado()
  router.push('/')
}

return{
    cancelarRecuperacion,
    store,
    router,

}
}