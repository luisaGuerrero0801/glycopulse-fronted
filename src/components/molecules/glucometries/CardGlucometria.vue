<script lang="ts" setup>
const props = defineProps<{
  id: number
  fecha: string
  hora: string
  glucosa: number
  comentario: string
  mostrarVer?: boolean
  mostrarEditar?: boolean
}>()

const emit = defineEmits(['verGluco', 'editarGluco'])

const verDetalle = () => emit('verGluco', props.id)

const editarRegistro = () => {
  emit('editarGluco', {
    id: props.id,
    fecha: props.fecha,
    hora: props.hora,
    glucosa: props.glucosa
  })
}
</script>

<template>
  <div class="w-full">
    <!-- Desktop / Tablet: Grid layout que coincide con el header -->
    <div class="hidden md:block bg-white p-5 sm:p-6 rounded-2xl shadow-md hover:bg-gray-50 transition-colors overflow-hidden w-full">
      <div class="w-full text-left text-base">
        <div class="grid items-center" style="grid-template-columns: 0.9fr 0.8fr 0.8fr 2fr 1fr;">
          <!-- FECHA - mismo ancho que el header -->
          <div class="px-4 py-3 text-gray-800 text-lg">
            {{ fecha }}
          </div>
          
          <!-- HORA - mismo ancho que el header -->
          <div class="px-4 py-3 text-gray-800 text-lg">
            {{ hora }}
          </div>
          
          <!-- GLUCOMETRÍA - mismo ancho que el header -->
          <div class="px-4 py-3 font-semibold text-gray-700 text-lg">
            {{ glucosa }}
          </div>
          
          <!-- RECOMENDACIÓN - mismo ancho que el header -->
          <div class="pl-0 py-3 text-gray-600 break-words text-lg" :title="comentario">
            {{ comentario }}
          </div>
          
          <!-- ACCIONES - mismo ancho que el header -->
          <div class="px-16 py-3">
            <div class="flex justify-end gap-3 flex-wrap">
              <button
              v-if="mostrarVer"
                class="flex-shrink-0 bg-gray-300 text-lg text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                @click="verDetalle"
              >
                Ver
              </button>
              <button
              v-if="mostrarEditar"
                class="flex-shrink-0 bg-blue-900 text-lg text-stone-50 px-4 py-2 rounded-md hover:bg-gray-500 transition"
                @click="editarRegistro"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile: Card layout -->
    <div class="md:hidden w-full">
      <div class="bg-white p-5 rounded-2xl shadow-md flex flex-col space-y-4">
        <div class="flex flex-col sm:flex-row justify-between gap-4">
          <div class="flex flex-col">
            <span class="font-medium text-gray-800">Fecha:</span>
            <span class="text-gray-700 text-lg">{{ fecha }}</span>
          </div>
          <div class="flex flex-col">
            <span class="font-medium text-gray-800">Hora:</span>
            <span class="text-gray-700 text-lg">{{ hora }}</span>
          </div>
        </div>
        <div class="flex flex-col">
          <span class="font-medium text-gray-800">Glucometría:</span>
          <span class="text-gray-700 font-semibold text-lg">{{ glucosa }}</span>
        </div>
        <div class="flex flex-col">
          <span class="font-medium text-gray-800">Recomendación:</span>
          <p class="text-gray-600 mt-2 text-base break-words">
            {{ comentario }}
          </p>
        </div>
        <div class="flex gap-3 justify-end flex-wrap">
          <button
            class="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition flex-shrink-0"
            @click="verDetalle"
          >
            Ver
          </button>
          <button
            class="bg-gray-400 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-500 transition flex-shrink-0"
            @click="editarRegistro"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>