<template>
  <div class="flex flex-col items-center p-6 bg-gray-50 min-h-screen overflow-y-auto">
    <div class="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-indigo-700">Crear Receta</h1>
        <button @click="irARecetas" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
          Ir a recetas
        </button>
      </div>

      <form @submit.prevent="currentStep === 1 ? siguientePaso() : guardarReceta" class="space-y-6">
        <!-- PASO 1 -->
        <div v-if="currentStep === 1">
          <div class="flex flex-col md:flex-row gap-6">
            <div class="flex-shrink-0">
              <label for="imagenReceta" class="w-40 h-40 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 cursor-pointer rounded-lg overflow-hidden">
                <span v-if="!form.imagenPreview">Subir imagen</span>
                <img v-else :src="form.imagenPreview" alt="Vista previa" class="w-full h-full object-cover" />
              </label>
              <input id="imagenReceta" type="file" accept="image/*" class="hidden" @change="cargarImagen" />
            </div>

            <div class="flex flex-col flex-1 gap-4">
              <div>
                <label for="nombreReceta" class="block text-sm font-medium text-gray-700">Nombre *</label>
                <input v-model="form.nombre" id="nombreReceta" type="text" placeholder="Ej: Ensalada de frutas" required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label for="descripcionReceta" class="block text-sm font-medium text-gray-700">Descripción *</label>
                <textarea v-model="form.descripcion" id="descripcionReceta" rows="3" placeholder="Describe tu receta..." required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dificultad *</label>
              <select v-model="form.dificultad" required class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500">
                <option value="" disabled>Seleccionar...</option>
                <option value="Fácil">Fácil</option>
                <option value="Media">Media</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Porciones *</label>
              <input v-model.number="form.porciones" type="number" min="1" required placeholder="4"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Calorías *</label>
              <input v-model.number="form.calorias" type="number" min="1" required placeholder="200"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tiempo *</label>
              <input v-model="form.tiempo" type="text" required placeholder="30 min"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label class="block mb-2 font-semibold">Ingredientes *</label>
            <table class="w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead class="bg-gray-100">
                <tr>
                  <th class="p-2 text-left">Ingrediente</th>
                  <th class="p-2 text-left">Cantidad</th>
                  <th class="p-2 text-left">Unidad</th>
                  <th class="p-2"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in ingredientes" :key="index" class="border-b">
                  <td class="p-2">
                    <input v-model="item.nombre" type="text" required class="w-full border rounded px-2 py-1" placeholder="Ej: Harina" />
                  </td>
                  <td class="p-2">
                    <input v-model.number="item.cantidad" type="number" min="1" required class="w-full border rounded px-2 py-1" placeholder="Ej: 200" />
                  </td>
                  <td class="p-2">
                    <input v-model="item.unidad" type="text" required class="w-full border rounded px-2 py-1" placeholder="Ej: gramos" />
                  </td>
                  <td class="p-2 text-center">
                    <button @click="eliminarIngrediente(index)" type="button" class="text-red-500 hover:text-red-700">✕</button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="flex justify-between mt-4">
              <button @click="agregarIngrediente" type="button" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Agregar ingrediente</button>
              <button type="submit" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">Siguiente</button>
            </div>
          </div>
        </div>

        <!-- PASO 2 -->
        <div v-if="currentStep === 2">
          <label class="block mb-2 font-semibold">Pasos de preparación *</label>

          <div v-for="(paso, index) in pasosPreparacion" :key="index" class="flex items-center gap-2 mb-2">
            <span class="w-20">Paso {{ index + 1 }}</span>
            <input type="text" v-model="pasosPreparacion[index]" required placeholder="Describe el paso" class="flex-1 border border-gray-300 rounded p-2" />
            <button @click="eliminarPaso(index)" type="button" class="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center">✕</button>
          </div>

          <div class="flex justify-between mt-4">
            <button @click="agregarPaso" type="button" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">+ Agregar paso</button>

            <div class="flex gap-2">
              <button @click="pasoAnterior" type="button" class="bg-gray-400 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-500 transition">Anterior</button>
              <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Guardar receta</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useRecetasStore } from "@/stores/crearRecetasDoctor";

const router = useRouter();
const recetasStore = useRecetasStore();

const currentStep = ref(1);

const form = reactive({
  nombre: "",
  descripcion: "",
  dificultad: "",
  porciones: 1,
  calorias: 1,
  tiempo: "",
  imagen: null as File | null,
  imagenPreview: ""
});

interface Ingrediente {
  nombre: string;
  cantidad: number | null;
  unidad: string;
}
const ingredientes = reactive<Ingrediente[]>([{ nombre: "", cantidad: null, unidad: "" }]);
const pasosPreparacion = reactive<string[]>([""]);

const agregarIngrediente = () => ingredientes.push({ nombre: "", cantidad: null, unidad: "" });
const eliminarIngrediente = (index: number) => ingredientes.splice(index, 1);

const agregarPaso = () => pasosPreparacion.push("");
const eliminarPaso = (index: number) => pasosPreparacion.splice(index, 1);

const siguientePaso = () => currentStep.value = 2;
const pasoAnterior = () => currentStep.value = 1;

const cargarImagen = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    form.imagen = target.files[0];
    form.imagenPreview = URL.createObjectURL(target.files[0]);
  }
};

const guardarReceta = async () => {
  try {
    // construir objeto que espera la store (sin idReceta)
    const recetaPayload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      dificultad: form.dificultad,
      porciones: form.porciones,
      calorias: form.calorias,
      tiempo: form.tiempo,
      ingredientes,
      pasosPreparacion
    };

    await recetasStore.crearReceta(recetaPayload, form.imagen || undefined);

    alert("Receta guardada con éxito 🎉");
    router.push({ name: "DoctorRecetasHome" });
    resetForm();
  } catch (err) {
    console.error("guardarReceta error:", err);
    alert("Ocurrió un error al guardar la receta");
  }
};

const resetForm = () => {
  form.nombre = "";
  form.descripcion = "";
  form.dificultad = "";
  form.porciones = 1;
  form.calorias = 1;
  form.tiempo = "";
  form.imagen = null;
  form.imagenPreview = "";
  ingredientes.splice(0, ingredientes.length, { nombre: "", cantidad: null, unidad: "" });
  pasosPreparacion.splice(0, pasosPreparacion.length, "");
};

const irARecetas = () => {
  router.push({ name: "DoctorRecetasHome" });
};
</script>
