<script lang="ts" setup>
import { RouterView, useRoute } from 'vue-router'
import GlobalToast from '@/components/atoms/GlobalToast.vue'
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'

const route = useRoute()
</script>

<template>
  <div>
    <GlobalToast v-if="route.path.startsWith('/admin')" />
    <RouterView />
  </div>
</template>
