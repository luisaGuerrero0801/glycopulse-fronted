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
        <label>Rol</label>
        <select v-model="form.rolUsuario" class="w-full border rounded p-2">
          <option value="1">Paciente</option>
          <option value="2">Administrador</option>
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
import { watch, reactive } from 'vue';
import axios from 'axios';

const props = defineProps<{
  visible: boolean;
  usuario: any;
}>();

const emit = defineEmits(['close', 'save']);

const form = reactive({
  nombresUsuario: '',
  apellidosUsuario: '',
  correoUsuario: '',
  rhUsuario: '',
  fechaNacimientoUsuario: '',
  generoUsuario: '',
  ciudadUsuario: '',
  paisUsuario: '',
  rolUsuario: '',
});

watch(
  () => props.usuario,
  (nuevoUsuario) => {
    if (nuevoUsuario) {
      console.log('Datos del usuario a editar recibidos:', nuevoUsuario);
      form.nombresUsuario = nuevoUsuario.nombresUsuario;
      form.apellidosUsuario = nuevoUsuario.apellidosUsuario;
      form.correoUsuario = nuevoUsuario.correoUsuario;
      form.rhUsuario = nuevoUsuario.rhUsuario;
      form.fechaNacimientoUsuario = nuevoUsuario.fechaNacimientoUsuario;
      form.generoUsuario = nuevoUsuario.generoUsuario;
      form.ciudadUsuario = nuevoUsuario.ciudadUsuario;
      form.paisUsuario = nuevoUsuario.paisUsuario;
      form.rolUsuario = nuevoUsuario.rol.idRol;
    }
  },
  { immediate: true }
);

function cancelar() {
  emit('close');
}

async function guardar() {
  try {
    const usuarioId = props.usuario.idUsuario;
    
    // ** La URL correcta según tu `main.ts` **
    const urlApi = `http://localhost:3000/api/v1/usuarios/${usuarioId}`;
    
    const token = localStorage.getItem('token'); 

    if (!usuarioId) {
      console.error('El ID del usuario no está definido.');
      alert('No se pudo obtener el ID del usuario para actualizar.');
      return;
    }

    const datosActualizados = {
      nombresUsuario: form.nombresUsuario,
      apellidosUsuario: form.apellidosUsuario,
      correoUsuario: form.correoUsuario,
      rhUsuario: form.rhUsuario,
      fechaNacimientoUsuario: form.fechaNacimientoUsuario,
      generoUsuario: form.generoUsuario,
      ciudadUsuario: form.ciudadUsuario,
      paisUsuario: form.paisUsuario,
      idRol: Number(form.rolUsuario), 
    };

    console.log(`Enviando PATCH a ${urlApi} con los datos:`, datosActualizados);

    const response = await axios.patch(
      urlApi,
      datosActualizados,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      alert('Usuario actualizado correctamente!');
      emit('save', response.data); 
      emit('close');
    }
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 400) {
        alert('Datos de la solicitud incorrectos. Verifique el formato.');
      } else if (error.response.status === 403) {
        alert('No tienes permisos para realizar esta acción.');
      } else if (error.response.status === 404) {
        alert('El usuario no fue encontrado. Verifique la URL y el ID.');
      } else {
        alert('Ocurrió un error en el servidor.');
      }
    } else {
      alert('Ocurrió un error de red o desconocido.');
    }
  }
}
</script>