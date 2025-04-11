<script lang="ts" setup>
import DropdownMenu from '../atoms/DropdownMenu.vue';

</script>

<template>
  <section>
    <div class="relative">
      <div class="absolute inset-y-8 left-8 flex items-center pl-2">
        <span
          class="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pl-3"
          >search</span
        >
        <input
          type="text"
          class="w-full h-10 rounded-md shadow-sm border-zinc-100 pl-12 pr-4 py-2.5 text- font-light bg-red-50 text-gray-400 placeholder-gray-500"
          placeholder="Search"
        />
        <div class="relative inline-block">
          <span class="material-icons text-3xl text-gray-400 mr-8 pl-4 pt-4 pb-4"
            >notifications</span
          >
          <span
            class="absolute top-6 right-9 w-2.5 h-2.5 bg-blue-500 rounded-full border border-red-50"
          ></span>
        </div>
        <div class="w-16 h-10 justify-center">
          <DropdownMenu/>
        </div>
      </div>
    </div>
  </section>
</template>
