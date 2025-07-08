<script lang="ts" setup>
import ButtomNew from '../atoms/ButtomNew.vue'
import CardGlucometria from './CardGlucometria.vue'
import FiltrosGluco from './FiltrosGluco.vue'
import ProxGluco from './ProxGluco.vue'
import { ref, onMounted } from 'vue'
import PopUp from '@/components/molecules/PopUp.vue'
import { useGlucometriasStore } from '@/stores/AllGlucometrias'
import { toast } from 'vue3-toastify'

const storeGluco = useGlucometriasStore()

const isModalVisible = ref(false)
const modalType = ref<'form' | 'info'>('form')

function parseApiFecha(fechaApi: string): string {
  const partes = fechaApi.split(' ');
  if (partes.length !== 4) return '';

  const dia = partes[1];
  const mesStr = partes[2].toLowerCase();
  const año = partes[3];

  const meses: Record<string, string> = {
    ene: '01', feb: '02', mar: '03', abr: '04',
    may: '05', jun: '06', jul: '07', ago: '08',
    sep: '09', oct: '10', nov: '11', dic: '12'
  };

  const mes = meses[mesStr] || '01';
  return `${año}-${mes}-${dia.padStart(2, '0')}`;
}

const form = ref({
  id: null as number | null,
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
  form.value = {
    id: null,
    fecha: '',
    hora: '',
    glucosa: 0,
    comentario: ''
  }
}

const closeModal = () => {
  isModalVisible.value = false
  form.value = {
    id: null,  
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
      id: detalle.idGlucometria,
      fecha: detalle.fechaGlucometria,
      hora: detalle.hora,
      glucosa: detalle.nivelGlucometria,
      comentario: detalle.recomendacionGlucometria || ''
    }

    modalType.value = 'info'
    isModalVisible.value = true
  }
}

const editarGlucometria = async (id: number) => {
  const detalle = await storeGluco.verDetalleGlucometria(id)

  if (detalle) {
    form.value = {
      id: detalle.idGlucometria,  
      fecha: parseApiFecha(detalle.fechaGlucometria),
      hora: detalle.hora,
      glucosa: detalle.nivelGlucometria,
      comentario: detalle.recomendacionGlucometria || ''
    }

    // console.log('Tipo de fecha:', typeof form.value.fecha)
    // console.log('Valor de fecha:', form.value.fecha)
    
    modalType.value = 'form' 
    isModalVisible.value = true
  }
}


const handleSubmit = async () => {
  if (!form.value.fecha || !form.value.hora || form.value.glucosa <= 0) {
    toast.error('Por favor, complete todos los campos correctamente.');
    return;
  }

  if (isNaN(form.value.glucosa)) {
    toast.error('Por favor, ingrese un valor numérico válido para la glucosa.');
    return;
  }

  const glucosa = Number(form.value.glucosa);
  if (glucosa < 30 || glucosa > 600) {
    toast.error('El valor de glucosa debe estar entre 30 y 600 mg/dL.');
    return;
  }

  if (form.value.id) {
    // console.log(form.value)
    await storeGluco.actualizarGlucometria(form.value.id, {
      fechaGlucometria: form.value.fecha,
      horaGlucometria: form.value.hora,
      nivelGlucometria: form.value.glucosa
    })
  } else {
    await storeGluco.crearGlucometria({
      fechaGlucometria: form.value.fecha,
      horaGlucometria: form.value.hora,
      nivelGlucometria: form.value.glucosa
    })
  }

  await storeGluco.verGlucos();
  
  form.value = {
    id: null, 
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
        @editarGluco="editarGlucometria(g.idGlucometria)"
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
