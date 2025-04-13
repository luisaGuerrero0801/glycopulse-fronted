<script lang="ts" setup>
const props = defineProps<{
  id: number,
  fecha: string
  hora: string
  glucosa: number
  comentario: string
}>()

const emit = defineEmits(['verGluco'])

const verDetalle = () => emit('verGluco', props.id)
</script>

<template>
  <div class="space-y-4 overflow-y-auto max-h-[600px]">
    <div class="bg-white shadow-md rounded-xl p-4">
      <table class="w-full">
        <thead>
          <tr class="text-left border-b">
            <th class="w-[150px] pb-2 text-black font-bold">Fecha Glucometría</th>
            <th class="w-[100px] pb-2 text-black font-bold">Hora</th>
            <th class="w-[130px] pb-2 text-black font-bold">Glucometría</th>
            <th class="w-[250px] pb-2 text-black font-bold">Recomendación</th>
            <th class="w-[130px] pb-2 text-black font-bold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr class="hover:bg-gray-50">
            <td class="py-3 text-gray-500">{{ fecha }}</td>
            <td class="py-3 text-gray-500">{{ hora }}</td>
            <td class="py-3 text-gray-500">{{ glucosa }}</td>
            <td class="py-3 text-gray-500 truncate max-w-[200px]">{{ comentario }}</td>
            <td class="py-3 text-gray-500">
              <div class="flex gap-2">
                <button 
                  class="text-blue-800 hover:text-blue-600 transition-colors"
                  @click="verDetalle"
                >
                  Ver
                </button>
                <button class="text-blue-800 hover:text-blue-600 transition-colors">
                  Editar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>