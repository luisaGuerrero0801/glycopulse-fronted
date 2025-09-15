<script lang="ts" setup>
const props = defineProps<{
  id: number,
  fecha: string,
  hora: string,
  glucosa: number,
  comentario: string
}>()

const emit = defineEmits(['verGluco', 'editarGluco'])

const verDetalle = () => emit('verGluco', props.id)

const editarRegistro = () => {
  emit('editarGluco', {
    id: props.id,
    fecha: props.fecha,
    hora: props.hora,
    glucosa: props.glucosa,
  })
}
</script>

<template>
  <div class="mt-6 space-y-5 w-full max-w-[700px] mx-auto">
    <!-- Desktop / Tablet: Table -->
    <div class="hidden md:block bg-white p-5 sm:p-6 rounded-2xl shadow-md overflow-hidden">
      <table class="w-full text-left border-collapse table-fixed text-base">
        <thead class="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th class="w-[160px] px-4 py-3 text-gray-800 font-medium">Fecha Glucometría</th>
            <th class="w-[120px] px-4 py-3 text-gray-800 font-medium">Hora</th>
            <th class="w-[140px] px-4 py-3 text-gray-800 font-medium">Glucometría</th>
            <th class="w-auto max-w-[280px] px-4 py-3 text-gray-800 font-medium">Recomendación</th>
            <th class="w-[140px] px-4 py-3 text-gray-800 font-medium text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr class="odd:bg-white even:bg-gray-50 hover:bg-gray-200 transition-colors">
            <td class="px-4 py-3">{{ fecha }}</td>
            <td class="px-4 py-3">{{ hora }}</td>
            <td class="px-4 py-3 font-semibold text-gray-700">{{ glucosa }}</td>
            <td class="px-4 py-3 text-gray-600 truncate break-words" :title="comentario">{{ comentario }}</td>
            <td class="px-4 py-3 flex gap-3 justify-center flex-wrap">
              <button class="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition" @click="verDetalle">
                Ver
              </button>
              <button class="bg-gray-400 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-500 transition" @click="editarRegistro">
                Editar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile: Card layout -->
    <div class="md:hidden space-y-4">
      <div class="bg-white p-5 sm:p-6 rounded-2xl shadow-md flex flex-col space-y-3 text-base w-full">
        <div class="flex flex-col sm:flex-row justify-between gap-4">
          <div class="flex flex-col">
            <span class="font-medium text-gray-800">Fecha:</span>
            <span class="text-gray-700 text-lg sm:text-xl">{{ fecha }}</span>
          </div>
          <div class="flex flex-col">
            <span class="font-medium text-gray-800">Hora:</span>
            <span class="text-gray-700 text-lg sm:text-xl">{{ hora }}</span>
          </div>
        </div>
        <div class="flex flex-col">
          <span class="font-medium text-gray-800">Glucometría:</span>
          <span class="text-gray-700 font-semibold text-lg sm:text-xl">{{ glucosa }}</span>
        </div>
        <div class="flex flex-col">
          <span class="font-medium text-gray-800">Recomendación:</span>
          <p class="text-gray-600 mt-1 text-base sm:text-lg break-words">{{ comentario }}</p>
        </div>
        <div class="flex gap-3 justify-end flex-wrap">
          <button class="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition" @click="verDetalle">
            Ver
          </button>
          <button class="bg-gray-400 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-500 transition" @click="editarRegistro">
            Editar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
