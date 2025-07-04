<script setup lang="ts">
import HeaderApp from '@/components/molecules/HeaderApp.vue'

import AdminPage from '@/components/admin/AdminPage.vue'
</script>


<template>
  <div class="w-full flex">
    <AdminPage />

    <div class="w-full flex-col">
      <router-view> </router-view>
    </div>
  </div>
</template>
