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
  <div class="mt-2 bg-white p-4 rounded-md shadow ">
    <table class="w-full text-left border-collapse table-fixed">
      <thead class="sticky top-0 bg-white z-10">
        <tr>
          <th class="w-[150px] pr-2 pl-2 pt-2 pb-0">Fecha Glucometría</th>
          <th class="w-[100px] pr-2 pl-2 pt-2 pb-0">Hora</th>
          <th class="w-[130px] pr-2 pl-2 pt-2 pb-0">Glucometría</th>
          <th class="w-[250px] pr-2 pl-2 pt-2 pb-0">Recomendación</th>
          <th class="w-[130px] pr-2 pl-2 pt-2 pb-0">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="p-2">{{ fecha }}</td>
          <td class="p-2">{{ hora }}</td>
          <td class="p-2">{{ glucosa }}</td>
          <td class="p-2">
            <p class="truncate overflow-hidden whitespace-nowrap" :title="comentario">
              {{ comentario }}
            </p>
          </td>
          <td class="p-2 flex gap-2">
            <button class="text-blue-800" @click="verDetalle">Ver</button>
            <button class="text-blue-800">Editar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
