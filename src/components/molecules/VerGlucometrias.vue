<script lang="ts" setup>
import ButtomNew from '../atoms/ButtomNew.vue'
import CardGlucometria from './CardGlucometria.vue'
import FiltrosGluco from './FiltrosGluco.vue'
import ProxGluco from './ProxGluco.vue'
import { ref, onMounted } from 'vue'
import PopUp from '@/components/molecules/PopUp.vue'
import { useGlucometriasStore } from '@/stores/AllGlucometrias'

const storeGluco = useGlucometriasStore()

const isModalVisible = ref(false)
const modalType = ref<'form' | 'info'>('form')


const form = ref({
  fecha: '',
  hora: '',
  glucosa: 0,
  comentario: '' 
})

onMounted(() => {
  storeGluco.verGlucos()
})

const openModal = () => {
  isModalVisible.value = true
  modalType.value = 'form'
}

const closeModal = () => {
  isModalVisible.value = false
  form.value = {
    fecha: '',
    hora: '',
    glucosa: 0,
    comentario: ''
  }
}

const verDetalleGlucometria = async (id: number) => {
  const detalle = await storeGluco.verDetalleGlucometria(id)

  if (detalle) {
    form.value = {
      fecha: detalle.fechaGlucometria,
      hora: detalle.hora,
      glucosa: detalle.nivelGlucometria,
      comentario: detalle.recomendacionGlucometria || ''
    }

    modalType.value = 'info'
    isModalVisible.value = true
  }
}

const handleSubmit = async () => {
  console.log('Formulario enviado:', form.value)
  await storeGluco.crearGlucometria({
    fechaGlucometria: form.value.fecha,
    horaGlucometria: form.value.hora,
    nivelGlucometria: form.value.glucosa
  })

  form.value = {
    fecha: '',
    hora: '',
    glucosa: 0,
    comentario: ''
  }

  closeModal()
}
</script>

<template>
  <section>
    <div class="w-full flex justify-between items-center mr-0 ml-0 mt-0 mb-0 pt-4 pr-44 pb-2 pl-12">
      <span class="text-3xl font-semibold"> Glucometrías </span>
      <ButtomNew nameButton="Nuevo" iconButton="add_circle" @click="openModal" />
    </div>

    <hr class="border-t-2 border-gray-200 mx-12 mt-6" />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mx-12 mt-8 mb-8">
      <ProxGluco />
      <FiltrosGluco class="col-span-2" />
    </div>

    <div v-if="storeGluco.loading" class="ml-12 mt-2">Cargando glucometrias ...</div>
    <div v-else-if="storeGluco.error" class="ml-12 mt-2 text-red-600">{{ storeGluco.error }}</div>

    <div v-else class="mx-12 grid grid-cols-1 gap-2 overflow-y-auto" style="height: 460px">
      <CardGlucometria
        v-for="(g, index) in storeGluco.glucometrias"
        :key="index"
        :id="g.idGlucometria"
        :fecha="g.fechaGlucometria"
        :hora="g.hora"
        :glucosa="g.nivelGlucometria"
        :comentario="g.recomendacionGlucometria"
        @verGluco = "verDetalleGlucometria(g.idGlucometria)"
      />
    </div>

    <PopUp
      :isVisible="isModalVisible"
      :modalType="modalType"
      v-model:form="form"
      :submitForm="handleSubmit"
      @closeModal="closeModal"
    />

  </section>
</template>
