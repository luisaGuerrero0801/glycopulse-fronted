<template>
  <section>
    <!-- <button
      :class="`w-full bg-blue-800 text-white py-3 rounded rounded-lg hover:bg-blue-700 transition`"   @click = "$emit('OnClick')"
    >
      {{ text }}
    </button> -->
    <button
      :class="`w-full ${colorButton} text-white py-3 rounded rounded-lg ${colorButtonHover} transition mb-15`"
      @click = "$emit('OnClick')"
    >
      {{ text }}
    </button>
  </section>
</template>

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
