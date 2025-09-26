<script lang="ts" setup>
interface Props {
  label?: string
  type?: string
  placeholder?: string
  options?: { value: string; label: string }[]
}

defineProps<Props>()

const modelValue = defineModel<string>()

const emit = defineEmits(["update:modelValue"])
const updateValue = (value: string) => {
  emit("update:modelValue", value)
}
</script>

<template>
  <section>
    <label v-if="label" class="text-indigo-950 font-semibold text-lg">{{ label }}</label>
    <div>
      <input
        v-if="type !== 'select'"
        :type="type"
        :placeholder="placeholder"
        v-model="modelValue"
        @input="updateValue(($event.target as HTMLInputElement).value)"
        class="mt-2 bg-transparent rounded-md border-zinc-400 font-light text-gray-500 w-full" 
      />

      <select
        v-else
        :value="modelValue"
        @change="updateValue(($event.target as HTMLSelectElement).value)"
        class="mt-2 bg-transparent rounded-md border-zinc-400 font-light text-gray-800 w-full"
      >
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
  </section>
</template>
