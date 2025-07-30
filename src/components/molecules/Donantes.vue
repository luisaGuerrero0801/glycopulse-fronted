<script lang="ts" setup>
import CardRh from '@/components/molecules/CardRh.vue';
import FiltroRh from '@/components/molecules/FiltroRh.vue';

</script>

<template>
  <section class="px-12 py-4">
  
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-3xl font-semibold">Donantes</h1>
    </div>
    
  
    <div class="flex justify-center mb-6">
      <FiltroRh 
        paciente="Search" 
        ubicacion="Ubicacion" 
        grupoSanguineo="Grupo Sanguineo" 
        class="mr-12"
      />
    </div>

  
    <hr class="border-t-2 border-gray-200 mb-8" />

    <div class="flex justify-center">
       <HeaderApp pagename="Glucometrías" />
      <CardRh />
    </div>
  </section>
</template>
