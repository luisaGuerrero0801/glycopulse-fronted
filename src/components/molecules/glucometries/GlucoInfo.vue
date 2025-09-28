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
    <div class="border-b mb-4 ml-2 mr-2">
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
        <div class="space-y-4">
          <!-- Card con información resumida -->
          <div
            class="flex flex-col md:flex-row bg-white border border-gray-200 rounded-2xl shadow mx-4 md:mx-6 py-6"
          >
            <!-- Glucometría -->
            <div
              class="flex flex-col items-center w-full md:w-1/4 md:border-r md:border-gray-300 px-4 py-4 md:py-0"
            >
              <span class="text-indigo-950 text-xl font-semibold">Glucometría</span>
              <span class="text-gray-500 text-2xl font-medium"
                >{{ glucometria.nivelGlucometria }} mg/dL</span
              >
            </div>

            <!-- Rango -->
            <div
              class="flex flex-col items-center w-full md:w-1/2 md:border-r md:border-gray-300 px-4 py-4 md:py-0"
            >
              <span class="text-indigo-950 text-xl font-semibold">Estado</span>
              <span class="text-gray-600 text-xl font-medium text-center">
                {{ glucometria.estado?.nombreEstado }}
              </span>
            </div>

            <!-- Estado -->
            <div class="flex flex-col items-center w-full md:w-1/4 px-4 py-4 md:py-0">
              <span class="text-indigo-950 text-xl font-semibold">Rango</span>
              <span class="flex items-center gap-2 text-gray-600 text-xl font-medium">
                {{ glucometria.rango?.nombreRango }}
                <span
                  class="w-6 h-6 rounded-full"
                  :style="{ backgroundColor: glucometria.rango?.color || '#ccc' }"
                ></span>
              </span>
            </div>
          </div>

          <div class="bg-white mx-2 px-4 pb-0 pt-0 w-full max-w-4xl">
            <!-- Título -->
            <div class="flex items-center mb-0">
              <h2 class="text-2xl font-bold text-gray-800 mr-4 mb-4">Recomendaciones</h2>
              <div class="flex-1 border-t border-gray-300"></div>
            </div>

            <!-- Intro -->
            <div
              v-if="
                glucometria.recomendaciones?.find(
                  (r) => r.tipoRecomendacion.toLowerCase() === 'general'
                )
              "
            >
              <p class="text-gray-600 text-xl font-normal px-0 py-0">
                {{
                  glucometria.recomendaciones.find(
                    (r) => r.tipoRecomendacion.toLowerCase() === 'general'
                  )?.descripcionRecomendacion
                }}
              </p>
            </div>

            <!-- Bloques de recomendaciones -->
            <div class="space-y-4 mb-8">
              <!-- Alimentación -->
              <div
                v-if="
                  glucometria.recomendaciones?.find(
                    (r) => r.tipoRecomendacion.toLowerCase() === 'alimentaria'
                  )
                "
              >
                <p class="text-xl font-semibold text-gray-800 mt-4">Alimentación:</p>
                <ul class="list-disc pl-6 mt-2 text-gray-600 text-xl font-normal marker:text-base">
                  <li>
                    {{
                      glucometria.recomendaciones.find(
                        (r) => r.tipoRecomendacion.toLowerCase() === 'alimentaria'
                      )?.descripcionRecomendacion
                    }}
                  </li>
                </ul>
              </div>

              <!-- Actividad Física -->
              <div
                v-if="
                  glucometria.recomendaciones?.find(
                    (r) => r.tipoRecomendacion.toLowerCase() === 'actividad física'
                  )
                "
              >
                <p class="text-xl font-semibold text-gray-800 mt-4">Actividad Física:</p>
                <ul class="list-disc pl-6 mt-2 text-gray-600 text-xl font-normal marker:text-base">
                  <li>
                    {{
                      glucometria.recomendaciones.find(
                        (r) => r.tipoRecomendacion.toLowerCase() === 'actividad física'
                      )?.descripcionRecomendacion
                    }}
                  </li>
                </ul>
              </div>

              <!-- Hidratación -->
              <div
                v-if="
                  glucometria.recomendaciones?.find(
                    (r) => r.tipoRecomendacion.toLowerCase() === 'hidratación'
                  )
                "
              >
                <p class="text-xl font-bold text-gray-800 mt-4">Hidratación:</p>
                <ul class="list-disc pl-6 mt-2 text-gray-600 text-xl font-normal marker:text-base">
                  <li>
                    {{
                      glucometria.recomendaciones.find(
                        (r) => r.tipoRecomendacion.toLowerCase() === 'hidratación'
                      )?.descripcionRecomendacion
                    }}
                  </li>
                </ul>
              </div>
              <!-- Control Continuo -->
              <div
                v-if="
                  glucometria.recomendaciones?.find(
                    (r) => r.tipoRecomendacion.toLowerCase() === 'control continuo'
                  )
                "
              >
                <p class="text-xl font-bold text-gray-800 mt-4">Control Continuo:</p>
                <ul class="list-disc pl-6 mt-2 text-gray-600 text-xl font-normal marker:text-base">
                  <li>
                    {{
                      glucometria.recomendaciones.find(
                        (r) => r.tipoRecomendacion.toLowerCase() === 'control continuo'
                      )?.descripcionRecomendacion
                    }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2 -->
      <div v-else-if="activeTab === 'Acudir al Médico'" class="space-y-2 ml-5">
        <div class="flex items-center mb-0">
          <h2 class="text-2xl font-semibold text-gray-800 mr-4 mb-4">Cuándo Acudir al Médico</h2>
          <div class="flex-1 border-t border-gray-300"></div>
        </div>
        <div>
          <p class="text-xl font-bold text-gray-800 mt-2">
            Síntomas de descontrol de glucosa alta (hiperglucemia):
          </p>
          <ul class="list-disc pl-6 mt-0 text-gray-600 text-xl font-normal marker:text-base">
            <li>Sed excesiva (polidipsia), visión borrosa y/o mareo.</li>
            <li>Aumento en la frecuencia de orina (poliuria).</li>
            <li>Cansancio extremo, debilidad y/o dolor de cabeza persistente.</li>
            <li>Heridas que tardan mucho en sanar.</li>
            <li>Pérdida de peso inesperada.</li>
          </ul>
        </div>
        <div>
          <p class="text-xl font-bold text-gray-800 mt-6">
            Señales de alerta que requieren atención inmediata:
          </p>
          <ul class="list-disc pl-6 mt-0 text-gray-600 text-xl font-normal marker:text-base">
            <li>
              Dolor en el pecho o dificultad para respirar: Puede indicar problemas
              cardiovasculares.
            </li>
            <li>
              Náuseas, vómitos o dolor abdominal severo: Posible cetoacidosis diabética (más común
              en diabetes tipo 1).
            </li>
            <li>
              Infecciones frecuentes o graves: Como infecciones en los pies, piel, tracto urinario o
              encías
            </li>
            <li>Hinchazón en piernas o pies: Puede ser señal de problemas renales.</li>
            <li>
              Entumecimiento o sensación de hormigueo en manos o pies: Indica posible neuropatía
              diabética.
            </li>
            <li>
              Somnolencia extrema o confusión: Podría ser una hiperglucemia grave o hipoglucemia
              severa.
            </li>
          </ul>
        </div>
      </div>

      <div v-else class="text-center text-2xl text-gray-800 font-light">Cargando detalles...</div>
      <!-- Botón Cerrar -->
      <div class="flex justify-end mt-6 mb-4 mr-2">
        <button
          @click="emit('close')"
          class="px-6 py-2 bg-indigo-900 text-white text-2xl font-medium rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>
