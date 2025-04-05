<script lang="ts" setup>
interface Props{
    text: string,
    iconLabel: string,
    typeImp:{
        type: string,
        default: "text"
    }

}

defineProps<Props>();
</script>

<template>
    <section>
        <label>{{ text }}</label>
        <input
          :type="text"
          class="w-full h-10 rounded-md shadow-sm border-zinc-100 pl-12 pr-4 py-2.5 text- font-light bg-red-50 text-gray-400 placeholder-gray-500"
          placeholder="Search"
        />
    </section>
</template>