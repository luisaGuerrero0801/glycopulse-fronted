<script lang="ts" setup>
import ButtomNew from '../atoms/ButtomNew.vue'
import CardGlucometria from '../atoms/CardGlucometria.vue';
import ProxGluco from '../atoms/ProxGluco.vue';
</script>

<template>
  <section>
    <div class="w-full flex justify-between items-center mr-0 ml-0 mt-0 mb-0 pt-4 pr-40 pb-2 pl-12">
      <span class="text-3xl font-semibold "> Glucometrías </span>
      <ButtomNew />
    </div>
    <hr class="bg-gray-600 mr-12 ml-12 mt-4">
    <ProxGluco class="mr-12 ml-12 mt-8"/>
    <CardGlucometria class="mr-12 ml-12 mt-8"/>
    <CardGlucometria class="mr-12 ml-12 mt-2"/>
    <CardGlucometria class="mr-12 ml-12 mt-2"/>
    <CardGlucometria class="mr-12 ml-12 mt-2"/>
  </section>
</template>
