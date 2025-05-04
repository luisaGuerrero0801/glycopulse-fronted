<template>
    <div
      v-if="visible"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-[400px] space-y-4 shadow-lg">
        <h2 class="text-lg font-bold mb-2">Editar Usuario</h2>
  
        <div>
          <label>Nombres</label>
          <input v-model="form.nombresUsuario" class="w-full border rounded p-2" />
        </div>
  
        <div>
          <label>Apellidos</label>
          <input v-model="form.apellidosUsuario" class="w-full border rounded p-2" />
        </div>
  
        <div>
          <label>Correo</label>
          <input v-model="form.correoUsuario" class="w-full border rounded p-2" />
        </div>
  
        <div>
          <label>RH</label>
          <input v-model="form.rhUsuario" class="w-full border rounded p-2" />
        </div>
  
        <div class="flex justify-end space-x-2">
          <button @click="cancelar" class="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
          <button @click="guardar" class="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch, reactive } from 'vue'
  
  const props = defineProps<{
    visible: boolean
    usuario: any
  }>()
  
  const emit = defineEmits(['close', 'save'])
  
  const form = reactive({
    nombresUsuario: '',
    apellidosUsuario: '',
    correoUsuario: '',
    rhUsuario: '' // Agregamos el campo RH
  })
  
  watch(
    () => props.usuario,
    (nuevoUsuario) => {
      if (nuevoUsuario) {
        form.nombresUsuario = nuevoUsuario.nombresUsuario
        form.apellidosUsuario = nuevoUsuario.apellidosUsuario
        form.correoUsuario = nuevoUsuario.correoUsuario
        form.rhUsuario = nuevoUsuario.rhUsuario // Aseguramos que RH se copie también
      }
    },
    { immediate: true }
  )
  
  function cancelar() {
    emit('close')
  }
  
  function guardar() {
    emit('save', { ...props.usuario, ...form })
  }
  </script>
  