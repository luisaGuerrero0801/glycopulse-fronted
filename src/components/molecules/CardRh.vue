<!-- <script lang="ts" setup>
import rhdata from '../rhdata'
</script>

<template>
  <div class="mt-2 bg-white p-3 rounded-3xl shadow">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr>
          <th class="pr-2 pl-2 pt-2 pb-0">Perfil</th>
          <th class="pr-2 pl-2 pt-2 pb-0">Nombre</th>
          <th class="pr-2 pl-2 pt-2 pb-0">Ubicación</th>
          <th cla ss="pr-2 pl-2 pt-2 pb-0">Edad</th>
          <th class="pr-2 pl-2 pt-2 pb-0">Email</th>
          <th class="pr-2 pl-2 pt-2 pb-0">Teléfono</th>
          <th class="pr-2 pl-2 pt-2 pb-0">RH</th>
        </tr>
      </thead>
      <tbody>
       

        <tr v-for="donante in rhdata" :key="donante.id" class="border-b border-gray-200 ">
          <td class="p-2">
            <img
              src="C:\Users\death\Desktop\Repositorios Clone\FrontEnd\glycopulse-fronted\src\assets\Avatar.png"
              alt="Perfil"
              class="w-12 h-12 rounded-full"
            />
          </td>
          <td class="p-2">{{ donante.nombre }}</td>
          <td class="p-2">{{ donante.email }}</td>
          <td class="p-2">{{ donante.telefono }}</td>
          <td class="p-2">{{ donante.edad }}</td>
          <td class="p-2">{{ donante.ciudad }}</td>
          <td class="p-2">{{ donante.rh }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template> -->

<template>
  <div  class=" space-y-4 ">
   
    <div
      class="bg-white shadow-md rounded-xl p-4 flex item-center justify-between"
      v-for="donante in rhdata"
      :key="donante.id"
    >
      <div class="flex space-x-28 text-sm text-center w-full">
        <div>
          <p class="text-black font-bold w-10 h-10">Perfil</p>
          <img :src="donante.imagen" alt="icon" />
        </div>

        <div>
          <p class="text-black font-bold h-12">Nombre</p>
          <p class="text-gray-500">{{ donante.nombre }}</p>
        </div>
        <div>
          <p class="text-black font-bold h-12 ">Ubicacion</p>
          <p class="text-gray-500">{{ donante.ubicacion }}</p>
        </div>
        <div>
          <p class="text-black font-bold h-12 ">Edad</p>
          <p class="text-gray-500">{{ donante.edad }}</p>
        </div>

        <div>
          <p class="text-black font-bold h-12 ">Email</p>
          <p class="text-gray-500">{{ donante.email }}</p>
        </div>
        <div>
          <p class="text-black font-bold h-12">Telefono</p>
          <p class="text-gray-500">{{ donante.telefono }}</p>
        </div>
        <div>
          <p class="text-black font-bold h-12">RH</p>
          <p class="text-gray-500">{{ donante.rh }}</p>
        </div>
        <div>
          <span class="material-icons text-gray-600 h-12">help_outline</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import rhdata from '@/data/rhdata'
console.log(rhdata)

</script>
