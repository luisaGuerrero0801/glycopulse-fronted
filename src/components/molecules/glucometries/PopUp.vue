<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
  >
    <div class="bg-white rounded-lg p-6 w-96">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-medium">Glucometría</h2>
        <button @click="handleCloseModal" class="text-gray-500 hover:text-gray-700">
          <span class="material-icons">close</span>
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
      <GlucoseInfo
        v-else-if="modalType === 'info'"
        :fecha="form?.fecha || 'No disponible'"
        :hora="form?.hora || 'No disponible'"
        :glucosa="form?.glucosa || 0"
        :comentario="form?.comentario || 'No disponible'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import GlucoseForm from '@/components/molecules/glucometries/FormGlucos.vue'
import GlucoseInfo from '@/components/molecules/glucometries/GlucoInfo.vue'

const props = defineProps({
  isVisible: Boolean,
  modalType: String as PropType<'form' | 'info'>,
  form: Object as PropType<{
    fecha: string
    hora: string
    glucosa: number
    comentario: string
  }>,
  isEdit: Boolean,
  closeModal: Function,
  submitForm: Function
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
