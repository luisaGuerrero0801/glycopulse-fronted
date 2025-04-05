<script setup lang="ts">
import ImputAtom from '../atoms/ImputAtom.vue';

</script>

<template>
  <div class="flex items-center bg-white pr-6 pl-6 pt-4 pb-4 rounded-md shadow space-x-6">
    <ImputAtom label="Fecha" type="date" class=""/>
    <ImputAtom label="Rango de Glucometría" type="select" placeholder="Selecciona"
    :options="[
        { value: 'no', label: 'Normal' },
        { value: 'md', label: 'Medio' },
        { value: 'al', label: 'Alto' }]"
     />
    <ImputAtom label="Hora" type="time"/>
  </div>
</template>
