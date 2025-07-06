<template>
  <section class="w-72 h-screen bg-gray-700">
    <LogoApp text="Glycopulse" />
    <div class="pb-8 pt-8 pr-10 pl-10">
      <h2 class="text-white font-bold text-lg">
        GLYCOPULSE
        <hr class="border-gray-500 my-2" />
      </h2>
    </div>
    <div class="pb-8 pt-8 pr-10 pl-8">
      <ul>
        <li>
          <RouterLink
            to="/admin/panel"
            class="inline-flex items-center w-full gap-2 px-4 py-2 font-sans text-sm text-red-50 hover:bg-gray-900 rounded-md"
          >
            <span class="material-icons text-white">home</span>
            Inicio
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/admin/dashboard"
            class="inline-flex items-center w-full gap-2 px-4 py-2 font-sans text-sm text-red-50 hover:bg-gray-900 rounded-md"
          >
            <span class="material-icons text-white">dashboard</span>
            Dashboard
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/admin/users"
            class="inline-flex items-center w-full gap-2 px-4 py-2 font-sans text-sm text-red-50 hover:bg-gray-900 rounded-md"
          >
            <span class="material-icons text-white">people_alt</span>
            Usuarios
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/admin/favoritos"
            class="inline-flex items-center w-full gap-2 px-4 py-2 font-sans text-sm text-red-50 hover:bg-gray-900 rounded-md"
          >
            <span class="material-icons text-white">restaurant_menu</span>
            Recetas
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/admin/support"
            class="inline-flex items-center w-full gap-2 px-4 py-2 font-sans text-sm text-red-50 hover:bg-gray-900 rounded-md"
            @click="logout"
          >
            <span class="material-icons text-white">exit_to_app</span>
            Salir
          </RouterLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { loginStore } from '@/stores/login'

const store = loginStore()

function logout() {
  store.logout()
}
</script>
