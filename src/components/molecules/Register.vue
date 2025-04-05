<template>
  <div class="flex min-h-screen items-center justify-center bg-white">
    <div class="flex w-3/4 max-w-6xl shadow-lg overflow-hidden bg-white">
      <div class="w-1/2 hidden md:block">
        <img class="w-full h-full object-cover shadow-lg" src="/img/fondoLogin.png" alt="logo" />
      </div>

      <div class="w-full md:w-1/2 p-8 flex flex-col justify-center">
        <h1 class="text-2xl font-bold text-gray-700 mb-4 text-center">crea una cuenta facil</h1>
        <form action="">
          <LabelForm nameForm="Nombre" />
          <InputForm namePlaceholder="Nombre" />

          <LabelForm nameForm="Apellido" />
          <InputForm namePlaceholder="Apellido" />

          <LabelForm nameForm="Fecha de Nacimiento" />
          <InputForm namePlaceholder="Fecha de nacimiento" inputType="date" />

          <!--inicio genero-->

          <LabelForm nameForm="Genero" />
          <div class="flex space-x-4">
            <div
              class="border rounded-2xl w-[100px] bg-gray-50 flex items-center justify-center p-2"
            >
              <input
                type="radio"
                id="genero_hombre"
                v-model="genero"
                required
                class="w-5 h-5 border-gray-300 bg-gray-50"
              />
              <label for="genero_hombre" class="ml-2">Hombre</label>
            </div>
            <div
              class="border rounded-2xl w-[100px] bg-gray-50 flex items-center justify-center p-2"
            >
              <input
                type="radio"
                id="genero_mujer"
                v-model="genero"
                required
                class="w-5 h-5 border-gray-300 bg-gray-50"
              />
              <label for="genero_mujer" class="ml-2">Mujer</label>
            </div>
          </div>

          <!--fin genero-->

          <LabelForm nameForm="Correo" />
          <InputForm namePlaceholder="Correo" inputType="email" />

          <LabelForm nameForm="Contraseña" />
          <InputForm namePlaceholder="Contraseña" inputType="password" />

          <LabelForm nameForm="Celular" />
          <InputForm namePlaceholder="Numero de celular " inputType="number" />

          <a class="mb-4 text-blue-500 text-sm text-end" href="#">¿Has olvidado tu contraseña?</a>

          <Button text="Registrate" />
        </form>

        <p class="text-gray-600 text-sm mt-4 text-center">
          tienes una cuenta? <a class="text-blue-500 hover:underline" href="#">Iniciar</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**import { Button, LabelForm, InputForm } from '../atomos/index.js'**/
</script>
