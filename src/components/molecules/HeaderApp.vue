
<template>
    <section>
        <div class="flex flex-row ">
            <div class="pt-8 pr-32 pb-8 pl-12 flex-grow max-w-full">
                <span>Pages</span>
                <span>/</span>
                <span>{{ pagename }}</span>
            </div>
            <div class="flex-1 min-w-0 pt-3 pr-12 pb-8 pl-8 ">
                <UserHeader/>
            </div>
        </div>
        
    </section>
</template>
    <script lang="ts" setup>
        import UserHeader from '../atoms/UserHeader.vue';
   interface Props{
    pagename:string
   }   
    defineProps<Props>()
    </script>