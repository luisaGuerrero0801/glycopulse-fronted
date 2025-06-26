<template>
  <section>
    <input
      :type="inputType"
      :id="inputId"
      :placeholder="namePlaceholder"
      v-model="internalValue"
      :style="inputType === 'email' ? 'text-transform: lowercase' : ''"
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


watch(internalValue, (newValue) => {
  const value = props.inputType === 'email' ? newValue?.toLowerCase() : newValue
  emit('update:modelValue', value);
});
</script>
