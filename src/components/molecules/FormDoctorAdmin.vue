<template>
  <form @submit.prevent="handleSubmit" class="p-6 space-y-4 bg-white rounded-xl shadow-md">
    <h2 class="text-xl font-bold text-gray-700">Registrar Doctor</h2>

    <div class="grid grid-cols-2 gap-4">
      <input v-model="form.nombresUsuario" type="text" placeholder="Nombres" class="input" required />
      <input v-model="form.apellidosUsuario" type="text" placeholder="Apellidos" class="input" required />

      <input v-model="form.fechaNacimientoUsuario" type="date" class="input" required />
      <select v-model="form.generoUsuario" class="input" required>
        <option disabled value="">Seleccione género</option>
        <option value="Masculino">Masculino</option>
        <option value="Femenino">Femenino</option>
      </select>

      <input v-model="form.rhUsuario" type="text" placeholder="RH (ej: O+)" class="input" required />
      <input v-model="form.celularUsuario" type="tel" placeholder="Celular" class="input" required />

      <input v-model="form.correoUsuario" type="email" placeholder="Correo electrónico" class="input col-span-2" required />
      <input v-model="form.contrasenaUsuario" type="password" placeholder="Contraseña" class="input col-span-2" required />

      <input v-model="form.ciudadUsuario" type="text" placeholder="Ciudad" class="input" required />
      <input v-model="form.paisUsuario" type="text" placeholder="País" class="input" required />
    </div>

    <button type="submit" class="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
      Registrar Doctor
    </button>
  </form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL // ej: http://localhost:3000/api/v1/

const form = ref({
  nombresUsuario: '',
  apellidosUsuario: '',
  fechaNacimientoUsuario: '',
  generoUsuario: '',
  rhUsuario: '',
  correoUsuario: '',
  contrasenaUsuario: '',
  celularUsuario: '',
  ciudadUsuario: '',
  paisUsuario: '',
  idRol: 3, // 🚀 Fijo porque es Doctor
  estado: 'Activo'
})

const handleSubmit = async () => {
  try {
    await axios.post(`${API_URL}usuarios`, form.value)
    alert('Doctor registrado con éxito ✅')
    Object.keys(form.value).forEach(key => (form.value as any)[key] = '') // limpiar
    form.value.idRol = 3 // volver a fijar rol doctor
    form.value.estado = 'Activo'
  } catch (err) {
    console.error(err)
    alert('❌ Error al registrar el doctor')
  }
}
</script>

<style scoped>
.input {
  @apply w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300;
}
</style>
