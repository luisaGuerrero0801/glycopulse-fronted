<script setup lang="ts">
import { computed, watch } from 'vue';

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
  submitForm: Function,
  submitEdit: Function
});

const emit = defineEmits(['update:form']);

// Función para convertir de formato 12h a 24h
function convertTo24Hour(time12h: string): string {
  if (!time12h || !time12h.includes(' ')) return time12h;
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  let h = parseInt(hours, 10);
  if (modifier === 'PM' && h !== 12) h += 12;
  if (modifier === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${minutes}`;
}

const hora24 = computed(() => convertTo24Hour(props.form.hora));

watch(
  () => props.form.hora,
  (newHora) => {
    if (newHora.includes('AM') || newHora.includes('PM')) {
      emit('update:form', {
        ...props.form,
        hora: convertTo24Hour(newHora)
      });
    }
  },
  { immediate: true }
);

const fechaISO = computed(() => {
  const f = props.form.fecha;
  if (!f) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(f)) return f;

  const parts = f.split(/[-/]/);
  if (parts.length !== 3) return '';
  let day = '', month = '', year = '';
  if (parseInt(parts[2]) > 31) [day, month, year] = parts;
  else [month, day, year] = parts;

  return `${year.padStart(4,'0')}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;
});

const updateField = (field: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target) return;
  let value: string | number = target.value;
  if (field === 'glucosa') value = parseInt(target.value);
  else if (field === 'fecha') value = String(target.value);
  emit('update:form', { ...props.form, [field]: value });
};

const handleSubmit = (event: MouseEvent) => {
  event.preventDefault();
  if (props.submitEdit) props.submitEdit();
  else if (props.submitForm) props.submitForm();
};
</script>

<template>
  <div class="bg-white p-6 sm:p-7 md:p-8 lg:p-10 rounded-2xl shadow-lg space-y-6 sm:space-y-7 md:space-y-8 w-full max-w-[750px] mx-auto">

    <div>
      <label class="block text-base sm:text-lg font-medium mb-1">Fecha</label>
      <input type="date" :value="fechaISO" @input="updateField('fecha', $event)" class="w-full border px-4 py-3 rounded-md text-base sm:text-lg" />
    </div>

    <div>
      <label class="block text-base sm:text-lg font-medium mb-1">Hora</label>
      <input type="time" :value="hora24" @input="updateField('hora', $event)" class="w-full border px-4 py-3 rounded-md text-base sm:text-lg" />
    </div>

    <div>
      <label class="block text-base sm:text-lg font-medium mb-1">Nivel de Glucosa</label>
      <input type="number" :value="form.glucosa" @input="updateField('glucosa',$event)" class="w-full border px-4 py-3 rounded-md text-base sm:text-lg" />
    </div>

    <div class="text-right">
      <button 
        @click="handleSubmit" 
        class="bg-blue-600 text-white px-6 py-3 rounded-lg text-base sm:text-lg hover:bg-blue-700 transition">
        {{ submitEdit ? 'Actualizar' : 'Guardar' }}
      </button>
    </div>

  </div>
</template>
