<script lang="ts" setup>
interface Props {
  nameButton: string
  iconButton: string
}
defineProps<Props>()
</script>

<template>
  <section>
    <div class="relative">
      <div class="absolute inset-y-1/2 flex items-center">
        <button
          class="inline-flex items-center gap-2 bg-blue-900 text-white px-4 py-1.5 hover:bg-blue-700 font-medium rounded shadow"
        >
          <span>{{ nameButton }}</span>
          <span
            class="material-icons text-red-50 text-xl ml-3"
            >{{ iconButton }}</span
          >
        </button>
      </div>
    </div>
  </section>
</template>
