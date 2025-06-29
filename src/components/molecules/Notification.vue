<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <h1 class="text-3xl font-bold mb-4">📥 Bandeja de Notificaciones</h1>

    <div v-if="noLeidas.length === 0" class="text-gray-500 text-lg">
      No tienes notificaciones nuevas.
    </div>

    <ul class="space-y-3">
      <li
        v-for="(n, index) in noLeidas"
        :key="index"
        class="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
      >
        <div>
          <p class="text-gray-800 font-medium">{{ n.mensaje }}</p>
          <p class="text-gray-500 text-sm">{{ n.fecha }}</p>
        </div>
        <button
          @click="marcarLeido(index)"
          class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
        >
          Marcar como leído
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useNotificacionesStore } from '@/stores/notificaciones'
import { computed } from 'vue'

const store = useNotificacionesStore()

// Computed para filtrar solo las no leídas
const noLeidas = computed(() => store.lista.filter(n => !n.leido))

// Acción para marcar como leída
const marcarLeido = (index: number) => {
  const notificacionRealIndex = store.lista.findIndex(n => n === noLeidas.value[index])
  if (notificacionRealIndex !== -1) {
    store.marcarLeido(notificacionRealIndex)
  }
}
</script>
