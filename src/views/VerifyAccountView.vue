<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

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
    const response = await axios.get(`http://localhost:3000/api/v1/auth/verify?token=${token}`)
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
