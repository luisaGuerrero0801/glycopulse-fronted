<script lang="ts" setup>
interface Props {
  text: string
  colorButton: string
  colorButtonHover: string
}

defineEmits<{ OnClick: [] }>()

const props = withDefaults(defineProps<Props>(), {
  colorButton: 'bg-blue-800',
  colorButtonHover: 'hover:bg-blue-700'
})
</script>
<template>
  <section>
    <button
      :class="`w-full ${colorButton} text-white py-2 text-sm rounded-lg ${colorButtonHover} transition`"
      @click="$emit('OnClick')"
    >
      {{ text }}
    </button>
  </section>
</template>
