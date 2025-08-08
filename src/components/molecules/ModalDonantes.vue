<script setup lang="ts">
defineProps(['donante'])
const emit = defineEmits(['cerrar'])

const datosContacto = [
  {
    icono: 'telefono',
    valor: (donante: any) => donante.telefonoUsuario || 'No disponible'
  },
  {
    icono: 'correo',
    valor: (donante: any) => donante.correoUsuario || 'No disponible'
  }
]
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#1A5DE9]/30">


    <div class="bg-white rounded-2xl shadow-2xl p-10 max-w-[480px] mx-auto relative">

      <!-- Botón cerrar -->
      <button
        @click="emit('cerrar')"
        class="absolute top-4 right-5 text-gray-400 hover:text-gray-600 text-xl z-10"
      >
        ×
      </button>

      <!-- Encabezado -->
      <div class="flex items-center w-full mb-4">
        <div class="relative">
          <span class="text-[#2D3E74] font-semibold text-sm leading-none pb-1 inline-block border-b-2 border-[#2D3E74]">
            Información Personal
          </span>
        </div>
        <div class="flex-1 h-[2px] bg-gray-200 ml mt-[24px]"></div>
      </div>

      <!-- Avatar + nombre -->
      <div class="flex flex-col items-center text-center">
        <div class="bg-indigo-100 text-indigo-700 w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-2">
          {{ donante.nombresUsuario.charAt(0) }}
        </div>
        <div class="font-semibold text-lg">
          {{ donante.nombresUsuario }} {{ donante.apellidosUsuario }}
        </div>
        <div class="text-sm text-gray-500">
          {{ donante.ciudadUsuario }}
        </div>
      </div>

      <!-- Datos personales -->
      <div class="border border-gray-200 rounded-xl flex text-center overflow-hidden my-4 divide-x divide-gray-200">
        <div class="flex-1 py-2 px-4">
          <p class="text-xs font-bold text-[#2D3E74]">EDAD</p>
          <p class="text-sm font-semibold text-gray-800">{{ donante.edadUsuario }} años</p>
        </div>
        <div class="flex-1 py-2 px-4">
          <p class="text-xs font-bold text-[#2D3E74]">GRUPO RH</p>
          <p class="text-sm font-semibold text-gray-800">{{ donante.rhUsuario }}</p>
        </div>
        <div class="flex-1 py-2 px-4">
          <p class="text-xs font-bold text-[#2D3E74]">SEXO</p>
          <p class="text-sm font-semibold text-gray-800">{{ donante.generoUsuario }}</p>
        </div>
      </div>

      <!-- Datos de contacto -->
      <div class="mt-4">
        <h3 class="text-md font-bold text-gray-800 mb-3">Información de Contacto</h3>
        <div class="space-y-2">
          <div
            v-for="(contacto, index) in datosContacto"
            :key="index"
            class="flex items-center gap-2 text-gray-700"
          >
            <template v-if="contacto.icono === 'telefono'">
              <img src="@/assets/icons/Telefono.png" alt="Teléfono" class="w-6 h-6" />
            </template>
            <template v-else-if="contacto.icono === 'correo'">
              <img src="@/assets/icons/Mail.png" alt="Correo" class="w-6 h-6" />
            </template>
            <span class="font-medium text-sm">{{ contacto.valor(donante) }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
