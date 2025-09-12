<template>
  <div class="min-h-screen bg-gray-100 flex flex-row-reverse font-sans text-gray-800">
    <aside class="w-64 flex-shrink-0 bg-white border-l border-gray-200 p-6 shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-gray-900">Filtros</h2>
      <nav class="space-y-2">
        <button
          @click="filtro = 'all'"
          class="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-200"
          :class="{'bg-blue-600 text-white hover:bg-blue-700': filtro === 'all', 'text-gray-700 hover:bg-gray-200': filtro !== 'all'}">
          Todas
        </button>
        <button
          @click="filtro = 'unread'"
          class="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center justify-between"
          :class="{'bg-blue-600 text-white hover:bg-blue-700': filtro === 'unread', 'text-gray-700 hover:bg-gray-200': filtro !== 'unread'}">
          <span>Sin Leer</span>
          <span v-if="noLeidas.length > 0" class="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{{ noLeidas.length }}</span>
        </button>
        <button
          @click="filtro = 'read'"
          class="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-200"
          :class="{'bg-blue-600 text-white hover:bg-blue-700': filtro === 'read', 'text-gray-700 hover:bg-gray-200': filtro !== 'read'}">
          Leídas
        </button>
      </nav>
      <div class="mt-8 pt-6 border-t border-gray-200">
        <button
          @click="marcarTodasComoLeidas"
          class="w-full text-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
          Marcar todas como leídas
        </button>
      </div>
    </aside>

    <main class="flex-1 overflow-y-auto">
      <div class="p-8">
        <h1 class="text-3xl font-bold mb-6">Bandeja de Entrada</h1>
        
        <div v-if="notificacionesVisibles.length === 0" class="bg-white rounded-lg shadow-md p-12 text-center text-gray-400">
          <p class="text-lg">✨ Tu bandeja de entrada está vacía.</p>
        </div>
        
        <ul class="space-y-4">
          <li
            v-for="n in notificacionesVisibles"
            :key="n.id"
            @click="marcarLeido(n.id)"
            class="bg-white rounded-lg shadow p-6 flex items-start gap-4 transition-all duration-200 transform hover:scale-[1.005] hover:shadow-lg cursor-pointer"
            :class="{ 'border-l-4 border-blue-600': !n.leido }">
            
            <div class="flex-shrink-0 mt-1">
              <svg v-if="!n.leido" class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-6h2v6zm0-8h-2V7h2v1z"></path>
              </svg>
              <svg v-else class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path>
              </svg>
            </div>
            
            <div class="flex-1">
              <p class="text-gray-900 font-medium">{{ n.mensaje }}</p>
              <span class="text-xs text-gray-500 mt-1 block">{{ n.fecha }}</span>
            </div>
            
            <div class="flex-shrink-0">
              <button
                v-if="!n.leido"
                @click.stop="marcarLeido(n.id)"
                class="text-blue-600 hover:text-blue-800 transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path>
                </svg>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useNotificacionesStore } from '@/stores/notificaciones'
import { computed, ref } from 'vue'

const store = useNotificacionesStore()
const filtro = ref('all')

const notificacionesVisibles = computed(() => {
  if (filtro.value === 'unread') {
    return store.lista.filter(n => !n.leido)
  }
  if (filtro.value === 'read') {
    return store.lista.filter(n => n.leido)
  }
  return store.lista
})

const noLeidas = computed(() => store.lista.filter(n => !n.leido))

const marcarLeido = (id: number) => {
  const notificacionRealIndex = store.lista.findIndex(n => n.id === id)
  if (notificacionRealIndex !== -1) {
    store.marcarLeido(notificacionRealIndex)
  }
}

const marcarTodasComoLeidas = () => {
  store.lista.forEach((notif) => {
    if (!notif.leido) {
      const notificacionRealIndex = store.lista.findIndex(n => n.id === notif.id)
      if (notificacionRealIndex !== -1) {
        store.marcarLeido(notificacionRealIndex)
      }
    }
  })
}
</script>

---

Ahora que el diseño de la barra lateral está a la derecha, ¿qué te gustaría hacer a continuación?