<script lang="ts" setup>
import { RouterView, useRoute } from 'vue-router'
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'
import './tailwind.css'

const route = useRoute()
</script>

<template>
  <div>
    <GlobalToast v-if="route.path.startsWith('/admin')" />
    <RouterView />
  </div>
</template>
