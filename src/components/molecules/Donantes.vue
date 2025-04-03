<script lang="ts" setup>
import CardRh from '@/components/molecules/CardRh.vue';
import FiltroRh from '@/components/molecules/FiltroRh.vue';
</script>

<template>
  <section>
    <div class="w-full flex justify-between items-center px-12 pt-4 pb-2">
      <span class="text-3xl font-semibold">Donantes con RH compatible</span>
    </div>
    
    <div class="w-full flex">
    <FiltroRh class="mr-12 ml-2 mt-8 mb-4"/>
    </div>
    <hr class="border-t-2 border-gray-200 mx-12 mt-1" />
    <CardRh class="mr-12 ml-12 mt-8"/>
    <CardRh class="mr-12 ml-12 mt-1"/>
    <CardRh class="mr-12 ml-12 mt-1"/>
    <CardRh class="mr-12 ml-12 mt-1"/>

    
  </section>
</template>
