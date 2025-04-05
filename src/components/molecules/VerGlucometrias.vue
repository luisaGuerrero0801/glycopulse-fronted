<script lang="ts" setup>
import ButtomNew from '../atoms/ButtomNew.vue'
import CardGlucometria from './CardGlucometria.vue';
import FiltrosGluco from './FiltrosGluco.vue';
import ProxGluco from './ProxGluco.vue';
import { onMounted } from 'vue';
import { useGlucometriasStore } from '@/stores/AllGlucometrias';

const storeGluco = useGlucometriasStore();

onMounted(() => {
  storeGluco.verGlucos();
});

</script>

<template>
  <section>
    <div class="w-full flex justify-between items-center mr-0 ml-0 mt-0 mb-0 pt-4 pr-40 pb-2 pl-12">
      <span class="text-3xl font-semibold"> Glucometrías </span>
      <ButtomNew nameButton="Nuevo" iconButton="add_circle" />
    </div>

    <hr class="border-t-2 border-gray-200 mx-12 mt-6" />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mx-12 mt-8 mb-4">
      <ProxGluco/>
      <FiltrosGluco class="col-span-2"/>
    </div>

    <div v-if="storeGluco.loading" class="ml-12 mt-8"> Cargando glucometrias ...</div>
    <div v-else-if="storeGluco.error" class="ml-12 mt-8 text-red-600">{{ storeGluco.error }}</div>
    
    <div v-else class="mx-12 grid grid-cols-1 gap-4">
    <CardGlucometria 
        v-for="(g, index) in storeGluco.glucometrias"
        :key="index"
        :fecha="g.fechaGlucometria"
        :hora="g.hora"
        :glucosa="g.nivelGlucometria"
        :comentario=" g.recomendacionGlucometria"
    />
  </div>
  </section>
</template>
