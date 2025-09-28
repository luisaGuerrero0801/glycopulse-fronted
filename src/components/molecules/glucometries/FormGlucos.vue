<script setup lang="ts">
import { computed, watch } from 'vue'
import { MomentoGlucometria } from '@/enums/momento-glucometria.enum'

const props = defineProps({
  form: {
    type: Object,
    required: true,
    default: () => ({
      fecha: '',
      hora: '',
      glucosa: 0,
      momento: '',
    })
  },
  submitForm: Function,
  submitEdit: Function
})

const emit = defineEmits(['update:form'])

// Función para convertir de formato 12h a 24h
function convertTo24Hour(time12h: string): string {
  if (!time12h || !time12h.includes(' ')) return time12h
  const [time, modifier] = time12h.split(' ')
  let [hours, minutes] = time.split(':')
  let h = parseInt(hours, 10)
  if (modifier === 'PM' && h !== 12) h += 12
  if (modifier === 'AM' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${minutes}`
}

const hora24 = computed(() => convertTo24Hour(props.form.hora))

watch(
  () => props.form.hora,
  (newHora) => {
    if (newHora.includes('AM') || newHora.includes('PM')) {
      emit('update:form', {
        ...props.form,
        hora: convertTo24Hour(newHora)
      })
    }
  },
  { immediate: true }
)

const fechaISO = computed(() => {
  const f = props.form.fecha
  if (!f) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(f)) return f

  const parts = f.split(/[-/]/)
  if (parts.length !== 3) return ''
  let day = '',
    month = '',
    year = ''
  if (parseInt(parts[2]) > 31) [day, month, year] = parts
  else [month, day, year] = parts

  return `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
})

const updateField = (field: string, event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target) return
  let value: string | number | null = target.value

  if (field === 'glucosa') {
    value = target.value ? parseInt(target.value) : null
  } else if (field === 'fecha') {
    value = target.value ? String(target.value) : null
  } else if (field === 'momento') {
    value = target.value === '' ? null : target.value
  }
  emit('update:form', { ...props.form, [field]: value })
}

const handleSubmit = (event: MouseEvent) => {
  console.log("Payload glucometria FORMULARIO -------:", props.form)
  event.preventDefault()
  if (props.submitEdit) props.submitEdit()
  else if (props.submitForm) props.submitForm()
}

const momentos = Object.values(MomentoGlucometria)
</script>

<template>
  <div>
    <!-- Header -->
    <div>
      <h2 class="text-3xl font-semibold mb-3 mt-8">Glucometría</h2>
      <p class="border-b mb-6"></p>
    </div>

    <div class="mx-3 my-4">
      <!-- Fecha -->
      <div>
        <label class="block text-2xl font-medium mb-3 text-slate-950">Fecha Glucometria</label>
        <input
          type="date"
          :value="fechaISO"
          @input="updateField('fecha', $event)"
          class="w-full border text-xl border-gray-300 rounded-lg mb-6 px-3 py-4 bg-gray-100 text-gray-600"
        />
      </div>

      <div>
        <label class="block text-2xl font-medium mb-3 text-slate-950">Hora Glucometria</label>
        <input
          type="time"
          :value="hora24"
          @input="updateField('hora', $event)"
          class="w-full border text-xl border-gray-300 rounded-lg mb-6 px-3 py-4 bg-gray-100 text-gray-600"
        />
      </div>

      <div>
        <label class="block text-2xl font-medium mb-3 text-slate-950">Nivel de Glucometria</label>
        <input
          type="number"
          :value="form.glucosa"
          @input="updateField('glucosa', $event)"
          class="w-full border text-xl border-gray-300 rounded-lg mb-6 px-3 py-4 bg-gray-100 text-gray-600"
        />
      </div>

      <div>
      <label class="block text-2xl font-medium mb-3 text-slate-950">Momento del día de la toma</label>
      <select :value="form.momento ?? ''" @change="updateField('momento', $event)" class="w-full border text-xl border-gray-300 rounded-lg mb-2 px-3 py-4 bg-gray-100 text-gray-600">
        <option value="" disabled>Seleccione un momento</option>
        <option v-for="m in momentos" :key="m" :value="m">{{ m }}</option>
      </select>
    </div>

      <div class="text-right mt-6 flex justify-center">
        <button
          @click="handleSubmit"
          class="bg-blue-900 text-white px-14 pt-3 pb-4 rounded-lg text-2xl hover:bg-blue-800 transition"
        >
          {{ submitEdit ? 'Actualizar' : 'Agregar' }}
        </button>
      </div>
    </div>
  </div>
</template>
