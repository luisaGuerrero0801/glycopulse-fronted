<script lang="ts" setup>
import LogoApp from '../atoms/LogoApp.vue';
import { RouterLink } from 'vue-router';
import DropdownMenu from '../atoms/DropdownMenu.vue';
import {
  ref,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
  computed
} from 'vue';

// Iconos de Heroicons
import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  ChartBarIcon,
 ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline';
import { FolderIcon, FolderPlusIcon } from '@heroicons/vue/20/solid';

const sidebarOpen = ref(false);
const searchQuery = ref('');

// Toggle del sidebar
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;

  if (sidebarOpen.value) {
    nextTick(() => {
      const firstFocusable = document.querySelector(
        'section[role="navigation"] input, section[role="navigation"] a'
      ) as HTMLElement | null;
      firstFocusable?.focus();
    });
  }
}

// Cerrar sidebar con tecla Esc
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && sidebarOpen.value) {
    sidebarOpen.value = false;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

// Bloqueo de scroll del body cuando sidebar está abierto
watch(sidebarOpen, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Lista con íconos
const links = [
  { name: 'Inicio', to: '/admin/panel', icon:  HomeIcon },
  { name: 'Dashboard', to: '/admin/dashboard', icon: ChartBarIcon },
  { name: 'Usuarios', to: '/admin/users', icon: UsersIcon },
  // { name: 'Recetas', to: '/admin/favoritos', icon: BookOpenIcon },
  { name: 'Salir', to: '/', icon:  ArrowRightOnRectangleIcon  },
];
// Filtro para la búsqueda
const filteredLinks = computed(() => {
  if (!searchQuery.value) return links;
  return links.filter(link =>
    link.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <div>
    <!-- Botón hamburguesa (móvil) -->
    <button
      @click="toggleSidebar"
      class="md:hidden p-4 text-white bg-blue-950"
      aria-label="Toggle sidebar"
      :aria-expanded="sidebarOpen.toString()"
    >
      ☰
    </button>

    <!-- Sidebar -->
    <section
      role="navigation"
      aria-label="Sidebar navigation"
      class="fixed top-0 left-0 z-50 w-72 h-screen bg-[var(--colorPrimarioVentanas)] transition-transform duration-300 ease-in-out
             md:translate-x-0 md:static md:block"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <LogoApp text="Glycopulse" />

      <!-- Input de búsqueda -->
      <div class="pb-8 pt-8 pr-10 pl-10">
        <input
          type="text"
          placeholder="Search..."
          v-model="searchQuery"
          class="w-full bg-transparent border-b border-white text-white text-base placeholder-white focus:outline-none"
          aria-label="Search navigation links"
        />
      </div>

      <!-- Enlaces -->
      <div class="pb-8 pt-4 pr-10 pl-8">
        <ul>
          <li
            v-for="link in filteredLinks"
            :key="link.name"
            class="mb-1"
          >
            <RouterLink 
              v-if="link.to !== '#'"
              :to="link.to"
              class="flex items-center gap-2 px-4 py-2 font-sans text-base text-red-50 hover:bg-blue-900 rounded-md"
              active-class="bg-blue-700 font-bold"
              exact-active-class="bg-blue-800 font-bold"
              @click="sidebarOpen = false"
            >
              <component :is="link.icon" class="w-12 h-11 text-red" />
              {{ link.name }}
            </RouterLink>

            <a
              v-else
              href="#"
              class="flex items-center gap-2 px-4 py-2 font-sans text-base text-red-50 hover:bg-blue-900 rounded-md"
              @click.prevent="sidebarOpen = false"
            >
              <component :is="link.icon" class="w-5 h-5 text-white" />
              {{ link.name }}
            </a>
          </li>
        </ul>
      </div>
    </section>

     <div class="w-16 h-10 justify-center">
          <DropdownMenu/>
        </div>

    <!-- Fondo oscuro para cerrar en móvil -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      aria-hidden="true"
    ></div>
  </div>
</template>
