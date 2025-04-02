<template>
  <section>
    <input
      :type="inputType"
      :id="inputId"
      :placeholder="namePlaceholder"
      v-model="internalValue"
      class="w-full p-2 border rounded-2xl mb-4 border border-gray-300 bg-gray-50"
    />
  </section>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps({
  inputType: {
    type: String,
    default: 'text'
  },
  inputId: String,
  namePlaceholder: String,
  modelValue: String
});

const emit = defineEmits(['update:modelValue']);

const internalValue = ref(props.modelValue);

// Verifica cuando internalValue cambie y emite la actualización
watch(internalValue, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>
