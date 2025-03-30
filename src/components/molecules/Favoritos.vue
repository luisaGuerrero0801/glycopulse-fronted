<template>
  <section>
    <div class="w-full flex justify-between items-center mr-0 ml-0 mt-0 mb-0 pt-4 pr-40 pb-2 pl-12">
      <div>
        <span class="text-2xl font-normal text-blue-800 border-b-4 border-blue-800 p-2">
          Favoritos
        </span>
        <span class="text-2xl font-normal text-gray-600"> Populares </span>
      </div>
    </div>
    <hr class="border-t-4 border-gray-200 mx-12" />

    <div class="flex flex-col items-center justify-center min-h-[600px] p-5 w-full">
      <p class="text-blue-800 font-semibold mb-6">¡Sin Favoritos!</p>
      <ButtomNew nameButton="Añadir" class="mx-auto" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import ButtomNew from '../atoms/ButtomNew.vue'
</script>
