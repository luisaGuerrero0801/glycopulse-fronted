import HeaderApp from '@/components/molecules/HeaderApp.vue';
<template>
  <div class="w-full flex">
    <AdminPage />

    <div class="w-full flex-col">
      <HeaderApp pagename="Glucometria" />
      <router-view> </router-view>
    </div>
  </div>
</template>