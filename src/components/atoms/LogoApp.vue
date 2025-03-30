<script lang="ts" setup>
interface Props{
    text: string
}

defineProps<Props>();
</script>

<template>
  <section class="flex items-center space-x-2">
    <img src="/src/assets/7.png"  alt="LogoApp" class="h-12 w-12 mt-8 mb-8 ml-6"/> 
    <span class="font-sans text-3xl text-red-50 font-semibold mt-8 mr-4 mb-8 ml-8"> {{ text }} </span>
  </section>
</template>
