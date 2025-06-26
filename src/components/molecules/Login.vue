<template>
  <div class="flex min-h-screen items-center justify-center bg-indigo-100">
    <div class="flex w-3/4 max-w-6xl shadow-xl overflow-hidden bg-white rounded-lg ">
      <div class="w-1/2 hidden md:block">
        <img class="w-full h-full object-cover shadow-lg" src="/img/fondoLogin.png" alt="logo" />
      </div>

      <div class="w-full md:w-1/2 p-8 flex flex-col justify-center">
        <img class="w-[100px] h-full object-cover mx-auto" src="/img/logocolor.png" alt="logoColorGlyco" />

        <h1 class="text-2xl font-bold text-gray-700 mb-4 text-center">Iniciar Sesión</h1>

        <form ref="form" @submit.prevent="handleClick" >
        <LabelForm nameForm="Correo" />
          <InputForm namePlaceholder="Ingrese su correo" inputId="correo" v-model="formData.correoUser"/> 

          <LabelForm nameForm="Contraseña"/>
          <InputForm namePlaceholder="Ingrese su contraseña" name="pass" inputId="pass" v-model="formData.pass" inputType="password"/>

          <RouterLink to="/recover" class="inline-block w-full px-4 py-2 font-sans text-sm text-blue-500">¿Has olvidado la contraseña?</RouterLink>
          <div>
            <ButtonUno text="Iniciar Sesión" @-on-click="handleClick" />
          </div>
        </form>

        <p class="text-gray-600 text-sm mt-4 text-center">
          No tienes una cuenta? <RouterLink to="/register" class="inline-block w-full px-4 py-2 font-sans text-sm text-blue-500">Crea una Aquí</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import{ LabelForm, InputForm} from "../atoms/index.js";
import { loginStore } from "@/stores/login.js";
import { reactive } from "vue";
import ButtonUno from "../atoms/ButtonUno.vue";

const login = loginStore();
const formData = reactive({correoUser: '', pass:''})

const handleClick = () => {
  if (!formData.correoUser || !formData.pass) {
    return alert("Por favor, llena todos los campos.");
  }
  login.validateUser(formData.correoUser, formData.pass)
}
</script>