<script lang="ts" setup>
interface Props {
  nameButton: string
  iconButton?: string
}
defineProps<Props>()
</script>

<template>
  <button
    class="inline-flex items-center gap-2 bg-[var(--colorPrimarioButton)] text-white px-4 py-1.5 hover:bg-[var(--colorSecundarioButton)] font-medium rounded shadow"
  >
    <span class="text-white text-2xl">{{ nameButton }}</span>
    <span v-if="iconButton" class="material-icons text-3xl" style="color: inherit;">
      {{ iconButton }}
    </span>
  </button>
</template>
