<script setup lang="ts">
import VistaInicial from '@/components/molecules/NavbarApp.vue'
import HeaderApp from '@/components/molecules/HeaderApp.vue'
import VerGlucometrias from '@/components/molecules/VerGlucometrias.vue'
import UserList from '@/components/admin/UserList.vue'
import AdminPage from '@/components/admin/AdminPage.vue'
</script>
<!-- 
<template>
  <div class="w-full flex">
    <AdminPage />
    <div class="w-full flex-col">
      <HeaderApp pagename="Glucometria" />
      <UserList />
    </div>
  </div>
</template> -->

<template>
  <div class="w-full flex">
    <!-- Barra lateral o menú de navegación -->
     <AdminPage />
    
    <!-- Contenido principal -->
    <div class="w-full flex-col">
      <!-- Header de la página -->
      <HeaderApp pagename="Glucometria" />
      
      <!-- Aquí se inyectan las rutas hijas -->
      <router-view>
        
      </router-view>
    </div>
  </div>
</template>