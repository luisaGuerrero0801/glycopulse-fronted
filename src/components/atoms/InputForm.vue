<template>
  <section>
    <input
      :type="inputType"
      :id="inputId"
      :placeholder="namePlaceholder"
      v-model="internalValue"
      :class="[
        'w-full border rounded-xl mb-1 border-gray-300 bg-gray-50 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400',
        inputClass
      ]"
    />
  </section>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps({
  inputType: {
    type: String,
    default: 'text'
  },
  inputId: String,
  namePlaceholder: String,
  modelValue: String,
  inputClass: {
    type: String,
    default: 'py-1 px-2'
  }
})

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)

watch(internalValue, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>
