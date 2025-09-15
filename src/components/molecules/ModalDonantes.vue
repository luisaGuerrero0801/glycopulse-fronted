<script setup lang="ts">
defineProps(['donante'])
const emit = defineEmits(['cerrar'])

const calcularEdad = (fechaNacimiento: string) => {
  if (!fechaNacimiento) return 'No disponible'
  const hoy = new Date()
  const nacimiento = new Date(fechaNacimiento)
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }
  return edad
}

const getCorreoLink = (correo: string) => {
  const dominio = correo.split("@")[1]?.toLowerCase()
  if (dominio?.includes("gmail.com")) return `https://mail.google.com/mail/?view=cm&to=${correo}`
  if (dominio?.includes("hotmail.com") || dominio?.includes("outlook.com") || dominio?.includes("live.com"))
    return `https://outlook.live.com/mail/0/deeplink/compose?to=${correo}`
  if (dominio?.includes("yahoo.com")) return `https://compose.mail.yahoo.com/?to=${correo}`
  return `mailto:${correo}`
}

const datosContacto = [
  { icono: 'telefono', valor: (donante: any) => donante.celularUsuario || 'No disponible' },
  { icono: 'correo', valor: (donante: any) => donante.correoUsuario || 'No disponible' }
]
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#1A5DE9]/20 backdrop-blur-sm p-4">
    <div class="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 max-w-md sm:max-w-lg lg:max-w-xl w-full relative animate-fadeIn">

      <!-- Botón cerrar -->
      <button
        @click="emit('cerrar')"
        class="absolute top-4 right-5 text-gray-400 hover:text-gray-600 text-3xl z-10 transition-transform hover:scale-110"
      >
        ×
      </button>

      <!-- Encabezado -->
      <div class="flex items-center w-full mb-6">
        <span class="text-[#2D3E74] font-bold text-lg sm:text-xl pb-1 border-b-2 border-[#2D3E74]">
          Información Personal
        </span>
        <div class="flex-1 h-[2px] bg-gray-200 ml-3 mt-6"></div>
      </div>

      <!-- Avatar + nombre -->
      <div class="flex flex-col items-center text-center mb-8">
        <div class="bg-gradient-to-tr from-indigo-200 to-indigo-400 text-indigo-800 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold mb-3 shadow-lg">
          {{ donante.nombresUsuario.charAt(0) }}
        </div>
        <div class="font-semibold text-xl sm:text-2xl md:text-3xl text-center">
          {{ donante.nombresUsuario }} {{ donante.apellidosUsuario }}
        </div>
        <div class="text-sm sm:text-base text-gray-500 mt-1">
          {{ donante.ciudadUsuario }}
        </div>
      </div>

      <!-- Datos personales -->
      <div class="border border-gray-200 rounded-2xl flex flex-col sm:flex-row text-center overflow-hidden my-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 text-sm sm:text-base">
        <div class="flex-1 py-4 px-4">
          <p class="font-bold text-[#2D3E74] mb-1">EDAD</p>
          <p class="font-semibold text-gray-800">{{ calcularEdad(donante.fechaNacimientoUsuario) }}</p>
        </div>
        <div class="flex-1 py-4 px-4">
          <p class="font-bold text-[#2D3E74] mb-1">GRUPO RH</p>
          <p class="font-semibold text-gray-800">{{ donante.rhUsuario }}</p>
        </div>
        <div class="flex-1 py-4 px-4">
          <p class="font-bold text-[#2D3E74] mb-1">GENERO</p>
          <p class="font-semibold text-gray-800">{{ donante.generoUsuario }}</p>
        </div>
      </div>

      <!-- Datos de contacto -->
      <div class="flex flex-col gap-5 mt-4">
        <div
          v-for="(contacto, index) in datosContacto"
          :key="index"
          class="flex items-center gap-4 text-gray-700 text-base sm:text-lg"
        >
          <template v-if="contacto.icono === 'telefono'">
            <img src="@/assets/icons/Telefono.png" alt="Teléfono" class="w-8 h-8" />
            <span class="font-medium">{{ contacto.valor(donante) }}</span>
          </template>

          <template v-else-if="contacto.icono === 'correo'">
            <img src="@/assets/icons/Mail.png" alt="Correo" class="w-8 h-8" />
            <a
              :href="getCorreoLink(contacto.valor(donante))"
              target="_blank"
              class="font-medium text-blue-600 hover:underline hover:text-blue-700 transition-colors"
            >
              {{ contacto.valor(donante) }}
            </a>
          </template>
        </div>
      </div>

    </div>
  </div>
</template>

<style>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>
