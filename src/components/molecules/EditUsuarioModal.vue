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
  
        <div>
          <label>Fecha de Nacimiento</label>
          <input v-model="form.fechaNacimientoUsuario" type="date" class="w-full border rounded p-2" />
        </div>
  
        <div>
          <label>Género</label>
          <select v-model="form.generoUsuario" class="w-full border rounded p-2">
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>
  
        <div>
          <label>Ciudad</label>
          <input v-model="form.ciudadUsuario" class="w-full border rounded p-2" />
        </div>
  
        <div>
          <label>País</label>
          <input v-model="form.paisUsuario" class="w-full border rounded p-2" />
        </div>
  
        <div class="flex justify-end space-x-2">
          <button @click="cancelar" class="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
          <button @click="guardar" class="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { watch, reactive } from 'vue'
  
  const props = defineProps<{
    visible: boolean
    usuario: any
  }>()
  
  const emit = defineEmits(['close', 'save'])
  
  const form = reactive({
    nombresUsuario: '',
    apellidosUsuario: '',
    correoUsuario: '',
    rhUsuario: '',
    fechaNacimientoUsuario: '',
    generoUsuario: '',
    ciudadUsuario: '',
    paisUsuario: ''
  })
  
  watch(
    () => props.usuario,
    (nuevoUsuario) => {
      if (nuevoUsuario) {
        form.nombresUsuario = nuevoUsuario.nombresUsuario
        form.apellidosUsuario = nuevoUsuario.apellidosUsuario
        form.correoUsuario = nuevoUsuario.correoUsuario
        form.rhUsuario = nuevoUsuario.rhUsuario
        form.fechaNacimientoUsuario = nuevoUsuario.fechaNacimientoUsuario
        form.generoUsuario = nuevoUsuario.generoUsuario
        form.ciudadUsuario = nuevoUsuario.ciudadUsuario
        form.paisUsuario = nuevoUsuario.paisUsuario
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
  