<script setup lang="ts">
const props = defineProps({
  form: {
    type: Object,
    required: true,
    default: () => ({
      fecha: '',
      hora: '',
      glucosa: 0,
      comentario: ''
    })
  },
  submitForm: Function
});


const emit = defineEmits(['update:form'])

const updateField = (field: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target) {
    const value = field === 'glucosa' ? parseInt(target.value) : target.value;
    emit('update:form', { ...props.form, [field]: value });
  }
};

const handleSubmit = (event: MouseEvent) => {
  event.preventDefault();
  props.submitForm?.();
};

</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium">Fecha</label>
      <input type="date" :value="form.fecha" @input="updateField('fecha', $event)" class="w-full border px-3 py-2 rounded-md" />
    </div>
    <div>
      <label class="block text-sm font-medium">Hora</label>
      <input type="time" :value="form.hora" @input="updateField('hora', $event)" class="w-full border px-3 py-2 rounded-md" />
    </div>
    <div>
      <label class="block text-sm font-medium">Nivel de Glucosa</label>
      <input type="number" :value="form.glucosa" @input="updateField('glucosa',$event)" class="w-full border px-3 py-2 rounded-md" />
    </div>
    <div class="text-right">
      <button @click="handleSubmit" class="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
    </div>
  </div>
</template>
