<!-- DoctorRecetaCardView.vue -->
<script setup lang="ts">
import DoctorLayout from '@/components/molecules/DoctorLayout.vue'
import DoctorRecetaCard from '@/components/molecules/DoctorRecetaCard.vue'
</script>

<template>
  <div class="w-full flex">
    <DoctorLayout />
    <div class="w-full flex flex-col p-6 bg-gray-50">
      <DoctorRecetaCard />
    </div>
  </div>
</template>
