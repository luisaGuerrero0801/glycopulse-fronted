<script lang="ts" setup>
interface Props {
  label?: string
  type?: string
  placeholder?: string
  options?: { value: string; label: string }[]
}

defineProps<Props>()

const modelValue = defineModel<string>()


const emit = defineEmits(["update:modelValue"]);
const updateValue = (value: string) => {
  emit("update:modelValue", value);
};
</script>

<template>
  <section>
    <label v-if="label" class="text-blue-800 font-light text-base">{{ label }}</label>
    <div>
      <input
        v-if="type !== 'select'"
        :type="type"
        :placeholder="placeholder"
        :v-model="modelValue"
        @input="updateValue(($event.target as HTMLInputElement).value)"
        class="w-60 mt-2 bg-transparent rounded-md border-zinc-300 font-light bg-red-50 text-gray-400 filter"
      />

      <select
        v-else
        :value="modelValue"
        @change="updateValue(($event.target as HTMLInputElement).value)"
        class="w-60 mt-2 bg-transparent rounded-md border-zinc-300 font-light bg-red-50 text-gray-800 "
      >
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
  </section>
</template>
