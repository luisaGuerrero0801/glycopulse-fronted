<script lang="ts" setup>
interface Props{
nameButton:string
iconButton:string
}
defineProps<Props>()
</script>

<template>
  <section >
    <div class="relative">
      <div class="absolute inset-y-1/2 flex items-center">
        <button class="w-28 bg-blue-900 pr-6 pt-1.5 pb-1.5 hover:bg-blue-700 text-white font-medium rounded">
       {{nameButton}}
        </button>
        <span class="material-icons absolute bg-blue-900 left-16 top-1/2 transform -translate-y-1/2 text-red-50 text-xl ml-3">{{iconButton}}</span>
      </div>
    </div>
  </section>
</template>
