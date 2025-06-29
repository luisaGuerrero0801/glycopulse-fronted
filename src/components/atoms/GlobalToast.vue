<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useNotificacionesStore } from '@/stores/notificaciones'

const store = useNotificacionesStore()

// Control de visibilidad de emergentes
const visibles = ref<{ mensaje: string; id: number }[]>([])

onMounted(() => {
  store.lista.forEach((n, index) => {
    if (!n.leido) {
      visibles.value.push({ mensaje: n.mensaje, id: index })

      setTimeout(() => {
        visibles.value = visibles.value.filter(v => v.id !== index)
      }, 5000 + index * 300)
    }
  })
})
</script>

<template>
  <div class="fixed top-5 right-5 z-50 flex flex-col gap-2">
    <transition-group name="fade-slide" tag="div">
      <div
        v-for="(n, index) in visibles"
        :key="n.id"
        class="bg-blue-600 text-white px-4 py-2 rounded shadow-lg min-w-[250px] flex justify-between items-center"
      >
        <span>{{ n.mensaje }}</span>
        <button @click="visibles.splice(index, 1)" class="ml-3 text-sm underline">X</button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-enter-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
