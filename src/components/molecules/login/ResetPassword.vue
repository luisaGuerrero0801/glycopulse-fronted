<script lang="ts" setup>
import { InputForm, ButtonLogin, LabelForm } from '../../atoms'
import { useResetPassword } from '@/composables/auth/useResetPassword'
const { cambiarContrasena, store, cancelar } = useResetPassword()
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-indigo-50">
    <div class="flex w-3/4 max-w-6xl shadow-lg overflow-hidden bg-white">
      <div class="w-1/2 hidden md:block">
        <img class="w-full h-full object-cover" src="/assets/img/fondoLogin.png" alt="fondo" />
      </div>

      <div class="w-full md:w-1/2 p-8 flex flex-col justify-center">
        <h1 class="text-2xl font-bold text-gray-700 mb-4 text-center">Crea una contraseña nueva</h1>
        <p class="text-sm text-gray-500 mb-5">
          Crea una contraseña nueva y segura que no uses en otros sitios web.
        </p>

        <LabelForm nameForm="Contraseña nueva" />
        <InputForm
          inputType="password"
          namePlaceholder="*********"
          v-model="store.nuevaContrasena"
        />

        <LabelForm nameForm="Confirmar contraseña" />
        <InputForm
          inputType="password"
          namePlaceholder="*********"
          v-model="store.confirmarContrasena"
        />

        <div class="flex justify-between gap-4 mt-6">
          <ButtonLogin
            text="Cancelar"
            colorButton="bg-gray-400"
            colorButtonHover="hover:bg-gray-600"
            class="w-full"
            @click="cancelar"
          />
          <ButtonLogin
            text="Cambiar Contraseña"
            class="w-full"
            :disabled="store.cargando"
            @click="cambiarContrasena"
          />
        </div>
      </div>
    </div>
  </div>
</template>
