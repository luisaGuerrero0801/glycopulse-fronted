<template>
  <div class="flex min-h-screen items-center justify-center bg-white">
    <div class="flex w-3/4 max-w-6xl shadow-lg overflow-hidden bg-white">
      <div class="w-1/2 hidden md:block">
        <img class="w-full h-full object-cover shadow-lg" src="/img/fondoLogin.png" alt="logo" />
      </div>

      <div class="w-full md:w-1/2 p-8 flex flex-col justify-center">
        <h1 class="text-2xl font-bold text-gray-700 mb-4 text-center">Recuperar tu cuenta</h1>
        <p class="text text-sm text-gray-500 mb-5">
          Introduce tu correo electrónico o número de móvil para buscar tu cuenta.
        </p>

        <LabelForm nameForm="Correo de recuperacion" />
        <InputForm namePlaceholder="Ingrese su correo" inputType="email" />

        <div class="flex justify-center gap-2">
          <div>
            <Button
              colorButton="bg-gray-400"
              colorButtonHover="hover:bg-gray-600"
              text="Cancelar"
            />
          </div>
          <div>
            <Button text="Recuperar cuenta" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Button, LabelForm, InputForm } from '../atomos/index.js'
</script>
