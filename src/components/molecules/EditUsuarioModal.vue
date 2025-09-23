<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300"
    :class="{ 'opacity-100': visible, 'opacity-0': !visible }"
  >
    <div
      class="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-lg max-h-[95vh] transform transition-transform duration-300 scale-95"
      :class="{ 'scale-100': visible }"
    >
   <div class="bg-blue-600 px-6 py-4 flex items-center justify-center relative">
  <h2 class="text-4xl font-bold text-white text-center">
    Datos <br> de <br> <span class="text-white text-2xl">{{ form.nombresUsuario }}</span>
  </h2>
  <button @click="cancelar" class="absolute top-4 right-6 text-blue-200 hover:text-white transition-colors">
    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  </button>
</div>

      <form @submit.prevent="guardar" class="p-6 sm:p-8 space-y-6 overflow-y-auto">
        <div class="border-b border-gray-200 pb-5">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-3">Información Personal</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="nombres" class="block text-lg font-medium text-gray-700">Nombres</label>
              <input
                id="nombres"
                v-model="form.nombresUsuario"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm: text-lg  p-2"
                placeholder="Nombres del usuario"
              />
            </div>
            <div>
              <label for="apellidos" class="block  text-lg  font-medium text-gray-700">Apellidos</label>
              <input
                id="apellidos"
                v-model="form.apellidosUsuario"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm: text-lg  p-2"
                placeholder="Apellidos del usuario"
              />
            </div>
            <div class="md:col-span-2">
              <label for="correo" class="block  text-lg  font-medium text-gray-700">Correo Electrónico</label>
              <input
                id="correo"
                v-model="form.correoUsuario"
                type="email"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm: text-lg  p-2"
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div>
              <label for="rh" class="block  text-lg  font-medium text-gray-700">Tipo de Sangre (RH)</label>
              <input
                id="rh"
                v-model="form.rhUsuario"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm: text-lg  p-2"
                placeholder="Ej: A+, O-"
              />
            </div>
            <div>
              <label for="fechaNacimiento" class="block  text-lg  font-medium text-gray-700">Fecha de Nacimiento</label>
              <input
                id="fechaNacimiento"
                v-model="form.fechaNacimientoUsuario"
                type="date"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm: text-lg  p-2"
              />
            </div>
          </div>
        </div>

        <div class="pt-5">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-3">Otros Detalles</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="genero" class="block  text-lg  font-medium text-gray-700">Género</label>
              <select
                id="genero"
                v-model="form.generoUsuario"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm: text-lg  p-2"
              >
                <option value="">Selecciona</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label for="ciudad" class="block  text-lg  font-medium text-gray-700">Ciudad</label>
              <input
                id="ciudad"
                v-model="form.ciudadUsuario"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm: text-lg  p-2"
                placeholder="Ciudad"
              />
            </div>
            <div>
              <label for="rol" class="block  text-lg  font-medium text-gray-700">Rol del Usuario</label>
              <select
                id="rol"
                v-model="form.rolUsuario"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm: text-lg  p-2"
              >
                <option value="">Selecciona un rol</option>
                <option value="1">Paciente</option>
                <option value="2">Administrador</option>
                <option value="3">Doctor</option>
              </select>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            @click="cancelar"
            class="px-5 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors sm: text-lg "
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-5 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors sm: text-lg "
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, reactive } from "vue";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const props = defineProps<{
  visible: boolean;
  usuario: any;
}>();

const emit = defineEmits(["close", "save"]);

const form = reactive({
  nombresUsuario: "",
  apellidosUsuario: "",
  correoUsuario: "",
  rhUsuario: "",
  fechaNacimientoUsuario: "",
  generoUsuario: "",
  ciudadUsuario: "",
  paisUsuario: "", // Asumo que `paisUsuario` también debería estar en el formulario.
  rolUsuario: "",
});

watch(
  () => props.usuario,
  (nuevoUsuario) => {
    if (nuevoUsuario) {
      console.log("Datos del usuario a editar recibidos:", nuevoUsuario);
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
  emit("close");
}

async function guardar() {
  try {
    const usuarioId = props.usuario.idUsuario;
    const urlApi = `https://glycopulse-back-production.up.railway.app/api/v1/usuarios/${usuarioId}/`;
    const token = localStorage.getItem("token");

    if (!usuarioId) {
      showToast("⚠️ No se pudo obtener el ID del usuario para actualizar.", "#ff9800");
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

    const response = await axios.patch(urlApi, datosActualizados, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      showToast("✅ Usuario actualizado correctamente!", "#4CAF50");
      emit("save", response.data);
      emit("close");
    }
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 400) {
        showToast("⚠️ Datos de la solicitud incorrectos. Verifique el formato.", "#ff9800");
      } else if (error.response.status === 403) {
        showToast("🚫 No tienes permisos para realizar esta acción.", "#f44336");
      } else if (error.response.status === 404) {
        showToast("❌ El usuario no fue encontrado.", "#f44336");
      } else {
        showToast("⚠️ Ocurrió un error en el servidor.", "#f44336");
      }
    } else {
      showToast("❌ Ocurrió un error de red o desconocido.", "#f44336");
    }
  }
}

function showToast(message: string, color: string) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: color,
    close: true,
  }).showToast();
}
</script>