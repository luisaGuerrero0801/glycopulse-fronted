<script lang="ts" setup>
import ButtomNew from '../atoms/ButtomNew.vue'
import CardGlucometria from './CardGlucometria.vue';
import FiltrosGluco from './FiltrosGluco.vue';
import ProxGluco from './ProxGluco.vue';
</script>

<template>
  <section>
    <div class="w-full flex justify-between items-center mr-0 ml-0 mt-0 mb-0 pt-4 pr-40 pb-2 pl-12">
      <span class="text-3xl font-semibold"> Glucometrías </span>
      <ButtomNew nameButton="Nuevo" iconButton="add_circle" />
    </div>
    <hr class="border-t-2 border-gray-200 mx-12 mt-6" />
    <div class="w-full flex">
      <ProxGluco class="mr-2 ml-12 mt-8 mb-4"/>
      <FiltrosGluco class="mr-12 ml-2 mt-8 mb-4"/>
    </div>
    <CardGlucometria class="mr-12 ml-12 mt-8"/>
    <CardGlucometria class="mr-12 ml-12 mt-1"/>
    <CardGlucometria class="mr-12 ml-12 mt-1"/>
    <CardGlucometria class="mr-12 ml-12 mt-1"/>
  </section>
</template>
