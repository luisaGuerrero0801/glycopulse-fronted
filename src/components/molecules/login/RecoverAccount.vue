<script lang="ts" setup>
import { useRecover } from '@/composables/auth/useRecover'
import { InputForm, ButtonLogin, LabelForm } from '../../atoms'

const { cancelarRecuperacion, store, router } = useRecover()
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-indigo-50">
    <div class="flex w-3/4 max-w-6xl shadow-lg overflow-hidden bg-white">
      <div class="w-1/2 hidden md:block">
        <img
          class="w-full h-full object-cover shadow-lg"
          src="/assets/img/fondoLogin.png"
          alt="logo"
        />
      </div>

      <div class="w-full md:w-1/2 p-8 flex flex-col justify-center">
        <h1 class="text-2xl font-bold text-gray-700 mb-4 text-center">Recuperar tu cuenta</h1>
        <p class="text-sm text-gray-500 mb-5">
          Introduce tu correo electrónico para buscar tu cuenta.
        </p>

        <LabelForm nameForm="Correo de recuperación" />
        <InputForm namePlaceholder="correo@ejemplo.com" inputType="email" v-model="store.correo" />

        <div class="flex justify-between gap-4 mt-6">
          <ButtonLogin
            colorButton="bg-gray-400"
            colorButtonHover="hover:bg-gray-600"
            text="Cancelar"
            class="w-full"
            @click="cancelarRecuperacion"
          />
          <ButtonLogin
            :disabled="store.cargando"
            text="Recuperar cuenta"
            class="w-full"
            @click="store.enviarCorreoRecuperacion"
          />
        </div>
      </div>
    </div>
  </div>
</template>
