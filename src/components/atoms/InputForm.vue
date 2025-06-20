<template>
  <section>
    <input
      :type="inputType"
      :id="inputId"
      :placeholder="namePlaceholder"
      v-model="internalValue"
    class="w-full p-2 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400" 
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
