<script setup lang="ts">
import { type PropType } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import GlucoseForm from '@/components/molecules/glucometries/FormGlucos.vue'
import GlucoInfo from '@/components/molecules/glucometries/GlucoInfo.vue'
import type { Glucometria } from '@/types/glucometria'

const props = defineProps({
  isVisible: { type: Boolean, required: true },
  modalType: { type: String as PropType<'form' | 'info'>, required: true },
  form: { type: Object as PropType<any>, default: () => ({}) },
  glucometria: { type: Object as PropType<Glucometria | null>, default: null },
  isEdit: { type: Boolean, default: false },
  closeModal: Function,
  submitForm: Function,
})

const emit = defineEmits(['closeModal', 'update:form'])

const handleCloseModal = () => emit('closeModal')

const updateForm = (newForm: typeof props.form) => emit('update:form', newForm)

const handleSubmit = () => {
  if (!props.form?.fecha || !props.form?.hora) {
    toast.error('La fecha y la hora son requeridas.')
    return
  }

  const selectedDateTime = new Date(`${props.form.fecha}T${props.form.hora}`)
  const now = new Date()

  if (selectedDateTime > now) {
    toast.error('La fecha y hora no pueden ser mayores a la actual.')
    return
  }

  props.submitForm?.()
}
</script>

<style scoped>
.bg-white {
  background-color: white;
}
</style>

<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
  >
    <div class="bg-white rounded-lg px-6 py-4 w-full max-w-4xl">
      <div class="flex justify-end items-center">
        <button @click="handleCloseModal" class="text-gray-500 hover:text-gray-700 ">
          <span class="material-icons ">close</span>
        </button>
      </div>

      <!-- Vista FORMULARIO -->
      <GlucoseForm
        v-if="modalType === 'form'"
        :form="form"
        :submitForm="isEdit ? undefined : handleSubmit"
        :submitEdit="isEdit ? handleSubmit : undefined"
        @update:form="updateForm"
      />

      <!-- Vista INFORMACIÓN -->
      <GlucoInfo
        v-else-if="modalType === 'info'"
        :glucometria="glucometria"
        @close="handleCloseModal"
      />

  </div>
  </div>
</template>

