<template>
  <div class="container mx-auto ">
  

    <div class="mt-12 md:flex">
      <PatientForm />
      <PatientList/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import PatientForm from '@/components/atoms/PatientForm.vue'
import PatientList from '@/components/atoms/PatientList.vue'
</script>
