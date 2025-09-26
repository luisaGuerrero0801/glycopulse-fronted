<script setup lang="ts">
import type { Glucometria } from '@/types/glucometria'
import { ref } from 'vue'

// Props
const props = defineProps<{
  glucometria: Glucometria | null
}>()

const emit = defineEmits(['close'])

type TabType = 'Recomendaciones' | 'Acudir al Médico'

const tabs: TabType[] = ['Recomendaciones', 'Acudir al Médico']
const activeTab = ref<TabType>('Recomendaciones')
</script>

<template>
  <div class="w-full px-2">
    <!-- Tabs -->
    <div class="border-b mb-4">
      <nav class="flex gap-6">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          class="pb-2 font-medium"
          :class="[
            activeTab === tab
              ? 'border-b-2 border-indigo-900 text-indigo-900 text-xl'
              : 'text-gray-500 hover:text-gray-700 text-xl'
          ]"
        >
          {{ tab }}
        </button>
      </nav>
    </div>

    <!-- Contenido -->
    <div v-if="glucometria">
      <!-- Tab 1 -->
      <div v-if="activeTab === 'Recomendaciones'" class="space-y-3">
        <div v-if="activeTab === 'Recomendaciones'" class="space-y-4">
          <!-- Card con información resumida -->
          <div class="flex justify-between mx-6 px-8 py-6 bg-white rounded-lg shadow">
            <!-- Glucometría -->
            <div class="flex flex-col items-center">
              <span class="text-indigo-950 text-xl font-semibold">Glucometría</span>
              <span class="text-gray-500 text-2xl font-medium">{{ glucometria.nivelGlucometria }} mg/dL</span>
            </div>

            <!-- Estado -->
            <div class="flex flex-col items-center border-l border-gray-300 pl-8">
              <span class="text-indigo-950 text-xl font-semibold">Estado</span>
              <span class="text-gray-500 text-xl font-medium" >
                {{ glucometria.estado?.nombreEstado }}
              </span>
            </div>

            <!-- Rango -->
            <div class="flex flex-col items-center border-l border-gray-300 pl-6">
              <span class="text-indigo-950 text-xl font-semibold">Rango</span>
              <span class="flex items-center  gap-2 text-gray-500 text-xl font-medium">
                {{ glucometria.rango?.nombreRango }}
                <span
                  class="w-7 h-7 rounded-full"
                  :style="{ backgroundColor: glucometria.rango?.color || '#ccc' }"
                ></span>
              </span>
            </div>
          </div>
          <p><strong>ID:</strong> {{ glucometria.idGlucometria }}</p>
          <p><strong>Fecha:</strong> {{ glucometria.fechaGlucometria }}</p>
          <p><strong>Hora:</strong> {{ glucometria.horaGlucometria }}</p>
          <p><strong>Nivel:</strong> {{ glucometria.nivelGlucometria }} mg/dL</p>
          <p><strong>Momento:</strong> {{ glucometria.momento }}</p>
          <p>
            <strong>Estado:</strong>
            <span
              :class="[
                glucometria.estado?.nombreEstado === 'Normal'
                  ? 'text-green-600 font-semibold'
                  : glucometria.estado?.nombreEstado === 'Alto'
                  ? 'text-red-600 font-semibold'
                  : 'text-yellow-600 font-semibold'
              ]"
            >
              {{ glucometria.estado?.nombreEstado }}
            </span>
          </p>
          <p><strong>Rango:</strong> {{ glucometria.rango?.nombreRango }}</p>
        </div>

        <!-- Tab 2 -->
        <div v-else-if="activeTab === 'Usuario'" class="space-y-3">
          <p>
            <strong>Nombre:</strong> {{ glucometria.usuario?.nombres }}
            {{ glucometria.usuario?.apellidos }}
          </p>
          <p><strong>Correo:</strong> {{ glucometria.usuario?.correo }}</p>
          <p><strong>Rol:</strong> {{ glucometria.usuario?.rol?.nombreRol }}</p>
        </div>

        <!-- Tab 3 -->
        <div v-else-if="activeTab === 'Acudir al Médico'" class="space-y-2">
          <ul v-if="glucometria.recomendaciones?.length" class="list-disc list-inside">
            <li v-for="rec in glucometria.recomendaciones" :key="rec.idRecomendacion">
              {{ rec.descripcionRecomendacion }}
            </li>
          </ul>
          <p v-else class="text-gray-500">No hay recomendaciones disponibles.</p>
        </div>
      </div>

      <div v-else class="text-center text-gray-600">Cargando detalles...</div>

      <!-- Footer -->
      <div class="mt-6 flex justify-end">
        <button
          @click="handleClose"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>
