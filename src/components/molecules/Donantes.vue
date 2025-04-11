<script lang="ts" setup>
import CardRh from '@/components/molecules/CardRh.vue';
import FiltroRh from '@/components/molecules/FiltroRh.vue';
</script>

<template>
  <section>
    <div class="w-full flex justify-between items-center px-12 pt-4 pb-2 ">
   
      <span class="text-3xl font-semibold">Donantes con RH compatible</span>
    </div>
    
    <div class="w-full flex ">
    <FiltroRh paciente="Search" ubicacion="Ubicacion" grupoSanguineo="Grupo Sanguineo"   class="mr-12 ml-2 mt-8 mb-4"/>
    </div>
    <hr class="border-t-2 border-gray-200 mx-12 mt-1" />
    <div class="   px-12 mt-8 pb-4">
     
    
    <CardRh class="mr-12 ml-12 mt-8"/>
    
   

  </div>
   
  </section>
</template>
