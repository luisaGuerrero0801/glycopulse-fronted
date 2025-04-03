<script lang="ts" setup>
import rhdata from '../rhdata';

</script>

<template>
    <div class="mt-2 bg-white p-3 rounded-3xl shadow">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr>
                    <th class="pr-2 pl-2 pt-2 pb-0">Perfil</th>
                    <th class="pr-2 pl-2 pt-2 pb-0">Nombre</th>
                    <th class="pr-2 pl-2 pt-2 pb-0">Ubicación</th>
                    <th class="pr-2 pl-2 pt-2 pb-0">Edad</th>
                    <th class="pr-2 pl-2 pt-2 pb-0">Email</th>
                    <th class="pr-2 pl-2 pt-2 pb-0">Teléfono</th>
                    <th class="pr-2 pl-2 pt-2 pb-0">RH</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="donante in rhdata" :key="donante.id">
                    <td class="p-2">
                        <img src="C:\Users\death\Desktop\Repositorios Clone\FrontEnd\glycopulse-fronted\src\assets\Avatar.png" 
                             alt="Perfil" class="w-12 h-12 rounded-full">
                    </td>
                    <td class="p-2">{{donante.nombre}}</td>
                    <td class="p-2">{{donante.email}}</td>
                    <td class="p-2">{{donante.telefono}}</td>
                    <td class="p-2">{{donante.edad}}</td>
                    <td class="p-2">{{donante.ciudad}}</td>
                    <td class="p-2">{{donante.rh}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
