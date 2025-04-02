<template>
  <section>
    <label class="text-gray-600 text-lg font-semibold mb-1" for="email">{{ nameForm }}</label>
  </section>
</template>

<script lang="tsx" setup>
interface Props{
    nameForm:string
}

defineProps<Props>()
</script>
