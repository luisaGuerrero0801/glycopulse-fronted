<template>
  <div class="relative">
    <input
      :type="isPasswordVisible ? 'text' : inputType"
      :id="inputId"
      :placeholder="namePlaceholder"
      v-model="internalValue"
      :style="inputType === 'email' ? 'text-transform: lowercase' : ''"
      class="w-full p-2 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />

    <!-- Botón de mostrar/ocultar contraseña -->
    <button
      v-if="inputType === 'password'"
      type="button"
      class="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600"
      @click="togglePasswordVisibility"
    >
      <span class="material-icons">
        {{ isPasswordVisible ? 'visibility_off' : 'visibility' }}
      </span>
    </button>
  </div>
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
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)
const isPasswordVisible = ref(false)

watch(internalValue, (newValue) => {
  const value = props.inputType === 'email' ? newValue?.toLowerCase() : newValue
  emit('update:modelValue', value)
})

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>
