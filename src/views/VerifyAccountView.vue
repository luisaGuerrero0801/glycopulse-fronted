<template>
  <div class="verify-container">
    <div class="logo">GlycoPulse</div>
    <div class="icon" :class="exito ? 'success' : 'error'">
      {{ exito ? '✅' : '❌' }}
    </div>
    <h2>{{ titulo }}</h2>
    <p class="mensaje" :class="exito ? 'mensaje-exito' : 'mensaje-error'">{{ mensaje }}</p>
    
    <div v-if="cargando" class="loading">
      <div class="spinner"></div>
      <p>Verificando tu cuenta...</p>
    </div>
    
    <div v-if="!cargando" class="redirect-info">
      <small>Serás redirigido al login en <span class="countdown">{{ countdown }}</span> segundos...</small>
      <div class="button-container">
        <button @click="irAlLogin" class="btn-login">Ir al Login Ahora</button>
      </div>
    </div>
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
const titulo = ref('Verificación de Cuenta')
const exito = ref(false)
const cargando = ref(true)
const countdown = ref(5)

const irAlLogin = () => {
  router.push('/')
}

const iniciarCountdown = () => {
  const interval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(interval)
      irAlLogin()
    }
  }, 1000)
}

onMounted(async () => {
  const token = route.query.token

  if (!token) {
    titulo.value = 'Error de Verificación'
    mensaje.value = 'No se proporcionó un token de verificación válido'
    exito.value = false
    cargando.value = false
    iniciarCountdown()
    return
  }

  try {
    // Hacer la petición POST al endpoint específico para la app
    const response = await axios.post(`${VITE_API_URL}/auth/verify-token`, {
      token: token
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    // Manejo de respuesta exitosa
    if (response.data && response.data.message) {
      mensaje.value = response.data.message
      exito.value = true
      titulo.value = '¡Cuenta Verificada!'
    } else {
      mensaje.value = '✅ Cuenta verificada correctamente'
      exito.value = true
      titulo.value = '¡Cuenta Verificada!'
    }

  } catch (error) {
    console.error('Error en verificación:', error)
    
    titulo.value = 'Error de Verificación'
    exito.value = false
    
    // Manejo robusto de errores
    if (error.response?.data?.message) {
      mensaje.value = error.response.data.message
    } else if (error.response?.status === 400) {
      mensaje.value = 'El token de verificación es inválido o ha expirado'
    } else if (error.response?.status >= 500) {
      mensaje.value = 'Error interno del servidor. Por favor, intenta más tarde'
    } else {
      mensaje.value = 'Error de conexión. Verifica tu conexión a internet'
    }
  } finally {
    cargando.value = false
    iniciarCountdown()
  }
})
</script>

<style scoped>
.verify-container {
  max-width: 500px;
  margin: 50px auto;
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 40px 30px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  background: white;
}

.logo {
  color: #2563eb;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.icon.success {
  color: #22c55e;
}

.icon.error {
  color: #ef4444;
}

h2 {
  color: #374151;
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: 600;
}

.mensaje {
  font-size: 16px;
  margin: 20px 0;
  line-height: 1.5;
}

.mensaje-exito {
  color: #22c55e;
  font-weight: 500;
}

.mensaje-error {
  color: #ef4444;
  font-weight: 500;
}

.loading {
  margin: 30px 0;
}

.spinner {
  border: 3px solid #f3f4f6;
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.redirect-info {
  margin-top: 30px;
}

.countdown {
  font-weight: bold;
  color: #2563eb;
}

.button-container {
  margin-top: 20px;
}

.btn-login {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
}

small {
  color: #6b7280;
  font-size: 14px;
}
</style>