<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <h1 class="text-3xl font-bold mb-6">📥 Bandeja de Notificaciones</h1>

    <!-- 🔔 Sección de no leídas -->
    <div>
      <h2 class="text-2xl font-semibold mb-3 text-blue-600">No leídas</h2>

      <div v-if="noLeidas.length === 0" class="text-gray-500 mb-6">No tienes notificaciones nuevas.</div>

      <ul class="space-y-3 mb-10">
        <li
          v-for="(n, index) in noLeidas"
          :key="'noLeida-' + index"
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

    <!-- ✅ Sección de leídas -->
    <div>
      <h2 class="text-2xl font-semibold mb-3 text-green-600">Leídas</h2>

      <div v-if="leidas.length === 0" class="text-gray-400">No hay notificaciones leídas aún.</div>

      <ul class="space-y-3">
        <li
          v-for="(n, index) in leidas"
          :key="'leida-' + index"
          class="bg-gray-200 shadow-sm rounded-lg p-4"
        >
          <p class="text-gray-700 font-medium">{{ n.mensaje }}</p>
          <p class="text-gray-500 text-sm">{{ n.fecha }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificacionesStore } from '@/stores/notificaciones'
import { computed } from 'vue'

const store = useNotificacionesStore()

const noLeidas = computed(() => store.lista.filter(n => !n.leido))
const leidas = computed(() => store.lista.filter(n => n.leido))

const marcarLeido = (index: number) => {
  const notificacionRealIndex = store.lista.findIndex(n => n === noLeidas.value[index])
  if (notificacionRealIndex !== -1) {
    store.marcarLeido(notificacionRealIndex)
  }
}
</script>
