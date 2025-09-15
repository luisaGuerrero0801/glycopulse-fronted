<template>
  <div v-if="visible" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856a2 2 0 001.789-2.895L13.789 2.105a2 2 0 00-3.578 0L3.341 16.105A2 2 0 005.13 19z"></path>
        </svg>
        <h3 class="mt-2 text-lg leading-6 font-bold text-gray-900">
          Confirmar Acción
        </h3>
        <div class="mt-2">
          <p class="text-lg text-gray-500">
            {{ message }}
          </p>
        </div>
      </div>
      <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
        <button
          @click="confirmAction"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-lg transition-colors"
        >
          Confirmar
        </button>
        <button
          @click="cancelAction"
          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-lg transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const confirmAction = () => {
  emit('confirm')
}

const cancelAction = () => {
  emit('cancel')
}
</script>