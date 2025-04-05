
<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
  import{ LabelForm, InputForm} from "../atoms/index";
  import { loginStore } from "@/stores/login.js";
  import { reactive } from "vue";
  import ButtonLogin from "../atoms/ButtonLogin.vue";
  const login = loginStore();
  const formData = reactive({correoUser: '', pass:''})
  
  const handleClick = () => {
    alert(formData.correoUser)
    login.validateUser(formData.correoUser, formData.pass)
  }
  </script>
<template>
    <div class="flex min-h-screen items-center justify-center bg-white">
      <div class="flex w-3/4 max-w-6xl shadow-lg overflow-hidden bg-white">
        <div class="w-1/2 hidden md:block">
          <img class="w-full h-full object-cover shadow-lg" src="/assets/img/fondoLogin.png" alt="logo" />
        </div>
  
        <div class="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <img class="w-[150px] h-full object-cover mx-auto" src="/assets/img/logo.png" alt="" />
  
          <h1 class="text-2xl font-bold text-gray-700 mb-4 text-center">Iniciar Sesión</h1>
  
          <form ref="form"  class="flex flex-col justify-between h-full">
          <LabelForm nameForm="Nombre" />
            <InputForm namePlaceholder="Nombre" inputId="correo" v-model="formData.correoUser"/> 
  
            <LabelForm nameForm="Contraseña"/>
            <InputForm namePlaceholder="ingrese su contraseña" name="pass" inputId="pass" v-model="formData.pass" inputType="password"/>
  
            <a class="mb-4 text-blue-500 text-sm text-end" href="#">¿Has olvidado tu contraseña?</a>
  
            <!-- <button
              class="w-full bg-blue-800 text-white py-3 rounded rounded-lg hover:bg-blue-700 transition"
              @click="login"
            >
              Iniciar sesión
            </button> -->
            <div >
              <ButtonLogin text="Iniciar Sesión" @-on-click="handleClick" />
            </div>
          </form>
  
          <p class="text-gray-600 text-sm mt-4 text-center">
            No tienes una cuenta? <a class="text-blue-500 hover:underline" href="#">Crea una aquí</a>
          </p>
        </div>
      </div>
    </div>
   
  </template>
