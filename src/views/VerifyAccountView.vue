<template>
  <div class="verify-container">
    <h2>Verificación de cuenta</h2>
    <p :class="exito ? 'mensaje-exito' : 'mensaje-error'">{{ mensaje }}</p>
    <small>Serás redirigido al login en 3 segundos...</small>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const { VITE_API_URL } = import.meta.env
const route = useRoute()
const router = useRouter()

const mensaje = ref('')
const exito = ref(false)

onMounted(async () => {
  const token = route.query.token

  if (!token) {
    mensaje.value = '❌ Token no proporcionado'
    exito.value = false
    return
  }

  try {
    const response = await axios.get(`${VITE_API_URL}auth/verify?token=${token}`)

    // Maneja tanto JSON como texto plano
    mensaje.value =
      response.data?.message ||
      (typeof response.data === 'string' ? response.data : '✅ Cuenta verificada correctamente')
    exito.value = true
  } catch (error) {
    // Manejo robusto de errores en producción
    mensaje.value =
      error.response?.data?.message ||
      (typeof error.response?.data === 'string' ? error.response.data : '❌ Token inválido o expirado')
    exito.value = false
  }

  // Redirigir al login después de 3 segundos
  setTimeout(() => {
    router.push('/')
  }, 3000)
})
</script>

<style scoped>
.verify-container {
  max-width: 500px;
  margin: 50px auto;
  text-align: center;
  font-family: Arial, sans-serif;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.mensaje-exito {
  color: green;
  font-weight: bold;
  margin: 20px 0;
}

.mensaje-error {
  color: red;
  font-weight: bold;
  margin: 20px 0;
}

small {
  color: #555;
}
</style>
