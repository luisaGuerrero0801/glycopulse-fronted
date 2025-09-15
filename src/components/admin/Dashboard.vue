<template>
  <div class="min-h-screen bg-gray-100 p-4 overflow-x-hidden" id="capture">
    <!-- Botón descargar -->
    <div class="fixed top-4 right-4 z-50">
      <button
        @click="captureScreen"
        class="bg-[var(--colorPrimarioButton)] hover:bg-[var(--colorSecundarioButton)] text-white px-4 py-2 rounded-lg shadow"
      >
        Descargar
      </button>
    </div>

    <!-- Contenedor grid principal -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-full mx-auto">
      <!-- Tarjetas estadísticas -->
      <div class="bg-white shadow-md rounded-xl p-4 w-full">
        <h2 class="text-lg font-bold mb-2">Estadísticas</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-[var(--colorPrimarioButton)] text-white rounded-lg p-4">
            <p class="text-sm">Total Usuarios</p>
            <p class="text-2xl font-bold">{{ totalUsuarios }}</p>
          </div>
          <div class="bg-[var(--colorSecundarioButton)] text-white rounded-lg p-4">
            <p class="text-sm">Doctores</p>
            <p class="text-2xl font-bold">{{ totalDoctores }}</p>
          </div>
          <div class="bg-green-500 text-white rounded-lg p-4">
            <p class="text-sm">Pacientes</p>
            <p class="text-2xl font-bold">{{ totalPacientes }}</p>
          </div>
          <div class="bg-purple-500 text-white rounded-lg p-4">
            <p class="text-sm">Activos</p>
            <p class="text-2xl font-bold">{{ totalActivos }}</p>
          </div>
        </div>
      </div>

      <!-- Gráfico de barras: Pacientes por Doctor -->
      <div class="bg-white shadow-md rounded-xl p-4 w-full overflow-hidden">
        <h2 class="text-lg font-bold mb-2">Pacientes por Doctor</h2>
        <div class="w-full h-[250px] md:h-[300px] max-w-full">
          <Bar :data="barChartData" :options="barChartOptions" @click="handleBarClick"/>
        </div>
      </div>

      <!-- Contenedor combinado: Pacientes por género + Mapa -->
      <div class="col-span-1 md:col-span-2 xl:col-span-2">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Pie: Pacientes por género -->
          <div v-if="!isMobile || currentPage === 1" class="bg-white shadow-md rounded-xl p-4 w-full overflow-hidden">
            <h2 class="text-lg font-bold mb-2">Pacientes por Género</h2>
            <div class="w-full h-[250px] md:h-[300px] max-w-full">
              <Pie :data="pieChartData" :options="pieChartOptions"/>
            </div>
          </div>

          <!-- Mapa -->
          <div v-if="!isMobile || currentPage === 2" class="bg-white shadow-md rounded-xl p-4 w-full overflow-hidden">
            <h2 class="text-lg font-bold mb-2">Mapa de Pacientes</h2>
            <div class="w-full h-[250px] md:h-[300px] rounded-lg overflow-hidden">
              <LMap ref="map" :zoom="mapZoom" :center="mapCenter" style="height: 100%">
                <LTileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
              </LMap>
            </div>
          </div>
        </div>

        <!-- Paginación móvil -->
        <div v-if="isMobile" class="flex items-center justify-center gap-4 mt-4">
          <button @click="prevPage" :disabled="currentPage===1" class="px-3 py-1 rounded border disabled:opacity-50">Anterior</button>
          <div class="flex items-center gap-2">
            <span v-for="n in totalPages" :key="n" @click="setPage(n)"
                  :class="['w-3 h-3 rounded-full cursor-pointer', currentPage===n?'bg-[var(--colorPrimarioButton)]':'bg-gray-300']"/>
          </div>
          <button @click="nextPage" :disabled="currentPage===totalPages" class="px-3 py-1 rounded border disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useUsuariosStore } from '@/stores/donantes';
import { storeToRefs } from 'pinia';
import { Bar, Pie } from 'vue-chartjs';
import html2canvas from 'html2canvas';
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Configurar Leaflet iconos
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Chart.js
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, ChartDataLabels);

// Store de usuarios
const usuariosStore = useUsuariosStore();
const { usuariosFiltrados } = storeToRefs(usuariosStore);

// Map
const map = ref(null);
const markerClusterLayer: any = ref(null);
const mapCenter = ref([4.6097, -74.0817]);
const mapZoom = ref(6);

// Pacientes con coordenadas
const pacientesConCoordenadas = computed(() =>
  usuariosFiltrados.value.filter(u => u.rol.nombreRol==='Paciente' && u.latitud && u.longitud)
);

// Función para actualizar marcadores
function updateMarkers() {
  if (!map.value || !pacientesConCoordenadas.value) return;
  if (!markerClusterLayer.value) markerClusterLayer.value = (L as any).markerClusterGroup();
  markerClusterLayer.value.clearLayers();
  pacientesConCoordenadas.value.forEach(p => {
    const marker = L.marker([p.latitud, p.longitud]);
    marker.bindPopup(`
      <div>
        <h3>${p.nombre}</h3>
        <p>ID: ${p.id}</p>
        <p>Edad: ${p.edad || 'N/A'}</p>
        <p>Doctor: ${p.usuarioResponsable || 'Sin asignar'}</p>
        <p>Estado: ${p.estado || 'N/A'}</p>
      </div>
    `);
    markerClusterLayer.value.addLayer(marker);
  });
  (map.value as any).leafletObject.addLayer(markerClusterLayer.value);
}

watch(pacientesConCoordenadas, () => updateMarkers());

// Estadísticas
const totalUsuarios = computed(() => usuariosFiltrados.value.length);
const totalPacientes = computed(() => usuariosFiltrados.value.filter(u=>u.rol.nombreRol==='Paciente').length);
const totalDoctores = computed(() => usuariosFiltrados.value.filter(u=>u.rol.nombreRol==='Doctor').length);
const totalActivos = computed(() => usuariosFiltrados.value.filter(u=>u.estado==='Activo').length);

// Gráficos
const barChartData = computed(() => {
  const doctores = usuariosFiltrados.value.filter(u=>u.rol.nombreRol==='Doctor');
  return {
    labels: doctores.map(d=>d.nombre),
    datasets:[{
      label:'Pacientes',
      data: doctores.map(d => usuariosFiltrados.value.filter(p => p.usuarioResponsable===d.id).length),
      backgroundColor: 'rgba(54,162,235,0.7)'
    }]
  };
});
const barChartOptions = {
  responsive:true,
  maintainAspectRatio:false,
  plugins:{ legend:{display:false}, datalabels:{anchor:'end', align:'top'}}
};

const pieChartData = computed(() => {
  const hombres = usuariosFiltrados.value.filter(u=>u.rol.nombreRol==='Paciente' && u.genero==='Hombre').length;
  const mujeres = usuariosFiltrados.value.filter(u=>u.rol.nombreRol==='Paciente' && u.genero==='Mujer').length;
  const otros = usuariosFiltrados.value.filter(u=>u.rol.nombreRol==='Paciente' && !['Hombre','Mujer'].includes(u.genero)).length;
  return {
    labels:['Hombres','Mujeres','Otros'],
    datasets:[{data:[hombres,mujeres,otros], backgroundColor:['#36A2EB','#FF6384','#FFCE56']}]
  };
});
const pieChartOptions = { responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}};

// Captura de pantalla
function captureScreen(){
  const element=document.getElementById('capture');
  if(element){
    html2canvas(element).then(canvas=>{
      const img=canvas.toDataURL('image/png');
      const link=document.createElement('a');
      link.href=img;
      link.download='dashboard.png';
      link.click();
    });
  }
}

// Móvil
const windowWidth = ref(window.innerWidth);
const isMobile = computed(() => windowWidth.value<768);
const currentPage = ref(1);
const totalPages = 2;
function nextPage(){ if(currentPage.value<totalPages) currentPage.value++; }
function prevPage(){ if(currentPage.value>1) currentPage.value--; }
function setPage(n:number){ if(n>=1 && n<=totalPages) currentPage.value=n; }
watch(isMobile, mobile => { if(!mobile) currentPage.value=1; });
window.addEventListener('resize', ()=>windowWidth.value=window.innerWidth);

// Zoom al doctor desde gráfica
function handleBarClick(evt:any){
  if(!evt[0]) return;
  const doctorIndex = evt[0].index;
  const doctores = usuariosFiltrados.value.filter(u=>u.rol.nombreRol==='Doctor');
  const doctorId = doctores[doctorIndex]?.id;
  if(!doctorId) return;
  const pacientesDoctor = pacientesConCoordenadas.value.filter(p=>p.usuarioResponsable===doctorId);
  if(pacientesDoctor.length){
    const bounds = L.latLngBounds(pacientesDoctor.map(p=>[p.latitud,p.longitud] as any));
    (map.value as any).leafletObject.fitBounds(bounds);
  }
}

// Fetch usuarios al montar
onMounted(() => { usuariosStore.fetchUsuarios(); });
</script>

<style>
html,body,#app{max-width:100%!important; overflow-x:hidden!important;}
</style>
