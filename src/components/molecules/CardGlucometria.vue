<script lang="ts" setup>
defineProps<{
  fecha: string;
  hora: string;
  glucosa: number;
  comentario: string;
}>();
</script>
<template>
            <div class="mt-2 bg-white p-4 rounded-md shadow">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="">
                            <th class="pr-2 pl-2 pt-2 pb-0">Fecha Glucometría</th>
                            <th class="pr-2 pl-2 pt-2 pb-0">Hora</th>
                            <th class="pr-2 pl-2 pt-2 pb-0">Glucometría</th>
                            <th class="pr-2 pl-2 pt-2 pb-0">Recomendación</th>
                            <th class="pr-2 pl-2 pt-2 pb-0">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="">
                            <td class="p-2">{{ fecha }}</td>
                            <td class="p-2">{{ hora }}</td>
                            <td class="p-2">{{ glucosa }}</td>
                            <td class="p-2">{{ comentario }}</td>
                            <td class="p-2 flex gap-2">
                                <button class="text-blue-800">Ver</button>
                                <button class="text-blue-800">Editar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
</template>