<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { URL_BASE } from '@/helpers/configUrl'

const route = useRoute()
const router = useRouter()
const mensaje = ref('')
const exito = ref(false)

onMounted(async () => {
  const token = route.query.token

  if (!token) {
    mensaje.value = 'Token no proporcionado'
    return
  }

  try {
    const response = await axios.get(`${URL_BASE}/auth/verify?token=${token}`)
    mensaje.value = response.data.message || '✅ Cuenta verificada correctamente'
    exito.value = true
  } catch (error) {
    mensaje.value = error.response?.data?.message || '❌ Token inválido o expirado'
  }

  setTimeout(() => {
    router.push('/') // Redirige al login
  }, 3000)
})
</script>

<template>
  <div class="verify-container">
    <h2>Verificación de cuenta</h2>
    <p>{{ mensaje }}</p>
  </div>
</template>
