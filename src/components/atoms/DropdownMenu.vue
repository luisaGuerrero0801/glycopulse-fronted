<template>
  <Menu as="div" class="fixed top-4 right-4 z-50 mr-10">
    <MenuButton
      class="h-10 bg-indigo-200 border rounded-lg border-indigo-300 flex items-center px-3"
    >
      <img src="/src/assets/iconoC.png" alt="LogoApp" class="h-8 w-8 object-contain mr-2" />
      <span class="text-lg font-semibold"> {{ nombreUsuario }}</span>
      <ChevronDownIcon class="w-5 h-5 ml-2" aria-hidden="true" />
    </MenuButton>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        class="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="px-1 py-1">
          <MenuItem v-slot="{ active }">
            <button
              @click="logout"
              :class="[
                active ? 'bg-indigo-500 text-white' : 'text-gray-900',
                'group flex rounded-md items-center w-full px-2 py-2 text-sm'
              ]"
            >
              Cerrar sesión
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { loginStore } from '@/stores/login'

const store = loginStore()

import { onMounted, ref, computed } from 'vue'
import { useUsuariosStore } from '../../stores/donantes'
import { storeToRefs } from 'pinia'

const token = sessionStorage.getItem('token')
const rol = sessionStorage.getItem('rol')
const idUsuario = Number(sessionStorage.getItem('idUsuario'))

const usuariosStore = useUsuariosStore()
const { usuariosFiltrados, loading, error } = storeToRefs(usuariosStore)

onMounted(() => {
  usuariosStore.fetchUsuarios()
})

const nombreUsuario = computed(() => {
  const usuarioEncontrado = usuariosFiltrados.value.find((u) => u.idUsuario === idUsuario)
  return usuarioEncontrado ? usuarioEncontrado.nombresUsuario : 'Usuario'
})

const notificaciones = ref(3)

function logout() {
  store.logout()
}
</script>
