<script lang="ts" setup>
import { InputForm, ButtonLogin, LabelForm } from '../../atoms'
import _ from 'lodash'

import { useRegister } from '@/composables/auth/useRegister'
const { availableCities } = useRegister()
const {
  form,
  registrarUsuario,
  resetForm,
  isLoading,
  successMessage,
  validarFormulario,
  soloLetras,
  onlyLetters
} = useRegister()
</script>

<template>
  <div class="min-h-screen bg-indigo-50 flex items-center justify-center p-1 overflow-x-hidden">
    <div
      class="flex flex-col md:flex-row w-full max-w-5xl shadow-lg bg-white rounded-xl overflow-hidden"
      style="min-height: 90vh"
    >
      <!-- Imagen (oculta en móviles) -->
      <div class="hidden md:block md:w-1/2 bg-gray-100">
        <img
          class="w-full h-full object-cover"
          src="/assets/img/fondoLogin.png"
          alt="Imagen de registro"
        />
      </div>

      <!-- Formulario -->
      <div class="w-full md:w-1/2 p-2 md:p-4 flex flex-col">
        <h1 class="text-xl font-bold text-gray-700 mb-0.5 text-center">Crea una cuenta fácil</h1>

        <!-- Mensaje de éxito -->
        <div v-if="successMessage" class="mb-4 p-1 bg-green-100 text-green-700 rounded-lg text-sm">
          {{ successMessage }}
        </div>

        <form @submit.prevent="registrarUsuario" class="flex flex-col gap-1 flex-grow">
          <!-- Nombre -->
          <LabelForm nameForm="Nombre" />
          <InputForm
            namePlaceholder="Nombre"
            v-model="form.nombresUsuario"
            @input="
              () => {
                form.nombresUsuario = _.startCase(_.toLower(form.nombresUsuario))
                soloLetras('nombresUsuario')
              }
            "
            @keypress="onlyLetters($event)"
            @blur="validarFormulario"
          />

          <!-- Apellido -->
          <div>
            <LabelForm nameForm="Apellido" />
            <InputForm
              namePlaceholder="Apellido"
              v-model="form.apellidosUsuario"
              @input="
                () => {
                  form.apellidosUsuario = _.startCase(_.toLower(form.apellidosUsuario))
                  soloLetras('apellidosUsuario')
                }
              "
              @keypress="onlyLetters($event)"
              @blur="validarFormulario"
            />
          </div>

          <!-- Fecha de Nacimiento -->
          <div>
            <LabelForm nameForm="Fecha de Nacimiento" />
            <InputForm
              namePlaceholder="Fecha de nacimiento"
              inputType="date"
              v-model="form.fechaNacimientoUsuario"
              @blur="validarFormulario"
            />
          </div>

          <!-- Tipo de Sangre -->
          <div>
            <LabelForm nameForm="Tipo de Sangre" />
            <select
              v-model="form.rhUsuario"
              class="border border-gray-300 rounded-2xl w-full p-2 mt-0.5 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="validarFormulario"
            >
              <option value="" disabled selected>Selecciona tu tipo de sangre</option>
              <option value="A+">A+</option>
              <option value="O+">O+</option>
              <option value="B+">B+</option>
              <option value="AB+">AB+</option>
              <option value="A-">A-</option>
              <option value="O-">O-</option>
              <option value="B-">B-</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <!-- Género -->
          <div>
            <LabelForm nameForm="Género" />
            <select
              v-model="form.generoUsuario"
              class="border border-gray-300 rounded-2xl w-full p-2 mt-1 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="validarFormulario"
            >
              <option disabled value="">Selecciona tu género</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Otro">Otro</option>
              <option value="Prefiero no decirlo">Prefiero no decirlo</option>
            </select>
          </div>

          <!-- Correo -->
          <div>
            <LabelForm nameForm="Correo" />
            <InputForm
              namePlaceholder="Correo"
              inputType="email"
              v-model="form.correoUsuario"
              @blur="validarFormulario"
            />
          </div>

          <!-- Contraseña -->
          <div>
            <LabelForm nameForm="Contraseña" />
            <InputForm
              namePlaceholder="Contraseña"
              inputType="password"
              v-model="form.contrasenaUsuario"
              @blur="validarFormulario"
            />
          </div>

          <!-- Teléfono -->
          <div>
            <LabelForm nameForm="Celular" />
            <InputForm
              namePlaceholder="Número de celular"
              inputType="tel"
              v-model="form.celularUsuario"
              @blur="validarFormulario"
            />
          </div>

          <!-- Ciudad -->
          <div>
            <LabelForm nameForm="Ciudad" />
            <select
              v-model="form.region"
              class="border border-gray-300 rounded-2xl w-full p-2 mt-0.5 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="validarFormulario"
            >
              <option value="">Seleccione ciudad</option>
              <option
                v-for="(cityName, cityCode) in availableCities"
                :key="cityCode"
                :value="cityCode"
              >
                {{ cityName }}
              </option>
            </select>
          </div>

          <!-- Botón de registro -->
          <div class="pt-4">
            <ButtonLogin
              text="Registrate"
              :disabled="isLoading"
              :loading="isLoading"
              class="w-full"
            />
          </div>
        </form>

        <p class="text-gray-600 text-sm mt-2 text-center">
          ¿Tienes una cuenta?
          <RouterLink to="/" class="text-blue-500 hover:text-blue-700 font-medium">
            Iniciar Sesión
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rounded-2xl {
  border-radius: 1rem;
}
</style>
