<script lang="ts" setup>
    import LogoApp from '../atoms/LogoApp.vue';
    import { RouterLink } from 'vue-router';

</script>

<template>
    <section class="w-96 h-screen bg-blue-950">
        <LogoApp text="Glycopulse"/>
        <div class="pb-8 pt-8 pr-10 pl-10">
            <input type="text" placeholder="Search..." 
            class="w-54 bg-transparent border-t-0 border-r-0 border-l-0 border-b border-white text-white text-base placeholder-white"/>
        </div>
        <div class="pb-8 pt-8 pr-10 pl-8">
            <ul>
                <li>
                    <a href="#" class="inline-block w-full px-4 py-2 font-sans text-base text-red-50 hover:bg-blue-900 rounded-md">Donantes</a> 
                </li>
                <li>
                    <a href="#" class="inline-block w-full px-4 py-2 font-sans text-base text-red-50 hover:bg-blue-900 rounded-md">Glucometría</a> 
                </li>
                <li>
                    <RouterLink to="/recetas-saludables" class="inline-block w-full px-4 py-2 font-sans text-base text-red-50 hover:bg-blue-900 rounded-md">Recetas Saludables</RouterLink> 
                </li>
                <li>
                    <a href="#" class="inline-block w-full px-4 py-2 font-sans text-base text-red-50 hover:bg-blue-900 rounded-md">Reportes</a> 
                </li>
            </ul>
        </div>
    </section>
</template>