<template>
  <div class="min-h-screen bg-gray-100 p-4 overflow-x-hidden" id="capture">
    <div class="fixed top-4 right-4 z-50">
      <button
        @click="captureScreen"
        class="bg-[var(--colorPrimarioButton)] hover:bg-[var(--colorSecundarioButton)] text-white px-4 py-2 rounded-lg shadow"
      >
        Descargar
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-full mx-auto">
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

      <div class="bg-white shadow-md rounded-xl p-4 w-full overflow-hidden">
        <h2 class="text-lg font-bold mb-2">Pacientes por Doctor</h2>
        <div class="w-full h-[250px] md:h-[300px] max-w-full">
          <Bar :data="barChartData" :options="barChartOptions" @click="handleBarClick"/>
        </div>
      </div>

      <div class="bg-white shadow-md rounded-xl p-4 w-full overflow-hidden">
        <h2 class="text-lg font-bold mb-2">Pacientes sin Doctor</h2>
        <div class="relative w-full h-[250px] md:h-[300px] flex items-center justify-center">
          <Pie :data="sinDoctorChartData" :options="sinDoctorChartOptions" />
          <div class="absolute text-3xl font-bold text-gray-700">
            {{ totalSinDoctor }}
          </div>
        </div>
      </div>

      <div class="bg-white shadow-md rounded-xl p-4 w-full overflow-hidden">
        <h2 class="text-lg font-bold mb-2">Evolución de Usuarios</h2>
        <div class="w-full h-[250px] md:h-[300px] max-w-full">
          <Line :data="lineChartData" :options="lineChartOptions" />
        </div>
      </div>

      <div class="col-span-1 md:col-span-2 xl:col-span-2">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-if="!isMobile || currentPage === 1" class="bg-white shadow-md rounded-xl p-4 w-full overflow-hidden">
            <h2 class="text-lg font-bold mb-2">Pacientes por Género</h2>
            <div class="w-full h-[250px] md:h-[300px] max-w-full">
              <Pie :data="pieChartData" :options="pieChartOptions"/>
            </div>
          </div>

          </div>

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
import { ref, computed, onMounted, watch } from 'vue';
import { useUsuariosStore } from '@/stores/donantes';
import { storeToRefs } from 'pinia';
import { Bar, Pie, Line } from 'vue-chartjs';
import html2canvas from 'html2canvas';

// Se comentan las importaciones de las librerías del mapa
// import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import 'leaflet.heat'; 

// Se comenta la configuración de los íconos de Leaflet
/*
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});
*/

// Chart.js
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, ChartDataLabels, PointElement, LineElement);

// Store de usuarios
const usuariosStore = useUsuariosStore();
const { usuariosFiltrados } = storeToRefs(usuariosStore);

// Se comentan las variables y referencias del mapa
/*
const map = ref(null);
const heatLayer = ref<L.HeatLayer | null>(null);
const mapCenter = ref([4.6097, -74.0817]);
const mapZoom = ref(6);
*/

// Se comenta la propiedad computada que filtra los pacientes con coordenadas
/*
const pacientesConCoordenadas = computed(() =>
  usuariosFiltrados.value.filter(u => u.rol?.nombreRol === 'Paciente' && u.latitud && u.longitud)
);
*/

// Se comenta la función que actualiza el mapa de calor
/*
function updateHeatmap() {
  if (!map.value) return;

  if (heatLayer.value) {
    (map.value as any).leafletObject.removeLayer(heatLayer.value);
  }

  const heatData = pacientesConCoordenadas.value.map(p => [p.latitud, p.longitud, 1]);

  console.log('Datos del mapa de calor:', heatData);

  if (heatData.length > 0) {
    heatLayer.value = (L as any).heatLayer(heatData, {
      radius: 25,
      gradient: { '0.4': 'blue', '0.6': 'cyan', '0.7': 'lime', '0.8': 'yellow', '1.0': 'red' }
    });
    (map.value as any).leafletObject.addLayer(heatLayer.value);
  }
}
*/

// Se comenta el 'watch' que dependía de las coordenadas para actualizar el mapa
// watch(pacientesConCoordenadas, updateHeatmap, { deep: true, immediate: true });

// Estadísticas
const totalUsuarios = computed(() => usuariosFiltrados.value.length);
const totalPacientes = computed(() => usuariosFiltrados.value.filter(u=>u.rol?.nombreRol === 'Paciente').length);
const totalDoctores = computed(() => usuariosFiltrados.value.filter(u=>u.rol?.nombreRol === 'Doctor').length);
const totalActivos = computed(() => usuariosFiltrados.value.filter(u=>u.estado === 'Activo').length);

// Gráfico de barras
const barChartData = computed(() => {
  const doctores = usuariosFiltrados.value.filter(u=>u.rol?.nombreRol === 'Doctor');
  return {
    labels: doctores.map(d=>`${d.nombresUsuario} ${d.apellidosUsuario}`),
    datasets:[{
      label:'Pacientes',
      data: doctores.map(d => usuariosFiltrados.value.filter(p => p.idUsuarioResponsable === d.idUsuario).length),
      backgroundColor: 'rgba(54,162,235,0.7)'
    }]
  };
});
const barChartOptions = {
  responsive:true,
  maintainAspectRatio:false,
  plugins:{ legend:{display:false}, datalabels:{anchor:'end', align:'top'} }
};

// Gráfico de pacientes por género
const pieChartData = computed(() => {
  const pacientes = usuariosFiltrados.value.filter(u => u.rol?.nombreRol === 'Paciente');
  const hombres = pacientes.filter(u => u.generoUsuario === 'Hombre').length;
  const mujeres = pacientes.filter(u => u.generoUsuario === 'Mujer').length;
  const otros = pacientes.filter(u => !['Hombre', 'Mujer'].includes(u.generoUsuario)).length;
  return {
    labels:['Hombres','Mujeres','Otros'],
    datasets:[{data:[hombres,mujeres,otros], backgroundColor:['#36A2EB','#FF6384','#FFCE56']}]
  };
});
const pieChartOptions = { responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}} };

// Pacientes sin doctor
const totalSinDoctor = computed(() =>
  usuariosFiltrados.value.filter(u => u.rol?.nombreRol === 'Paciente' && !u.idUsuarioResponsable).length
);
const totalConDoctor = computed(() =>
  usuariosFiltrados.value.filter(u => u.rol?.nombreRol === 'Paciente' && u.idUsuarioResponsable).length
);
const sinDoctorChartData = computed(() => ({
  labels: ['Sin Doctor', 'Con Doctor'],
  datasets: [{
    data: [totalSinDoctor.value, totalConDoctor.value],
    backgroundColor: ['#FF6384', '#36A2EB']
  }]
}));
const sinDoctorChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } }
};

// Evolución de usuarios (por mes)
const lineChartData = computed(() => {
  const counts: Record<string, number> = {};
  usuariosFiltrados.value.forEach(u => {
    // Usar una propiedad que exista en tus datos para la fecha de registro.
    const fecha = new Date(u.fechaNacimientoUsuario);
    const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    counts[mes] = (counts[mes] || 0) + 1;
  });
  const labels = Object.keys(counts).sort();
  return {
    labels,
    datasets: [{
      label: 'Usuarios registrados',
      data: labels.map(l => counts[l]),
      borderColor: 'rgba(75,192,192,1)',
      backgroundColor: 'rgba(75,192,192,0.2)',
      fill: true,
      tension: 0.3
    }]
  };
});
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
  scales: { y: { beginAtZero: true } }
};

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

// Se comenta la función que hace zoom en el mapa al hacer clic en la gráfica de barras
/*
function handleBarClick(evt:any){
  if(!evt[0]) return;
  const doctorIndex = evt[0].index;
  const doctores = usuariosFiltrados.value.filter(u=>u.rol?.nombreRol === 'Doctor');
  const doctorId = doctores[doctorIndex]?.idUsuario;
  if(!doctorId) return;
  const pacientesDoctor = pacientesConCoordenadas.value.filter(p=>p.idUsuarioResponsable === doctorId);
  if(pacientesDoctor.length){
    const bounds = L.latLngBounds(pacientesDoctor.map(p=>[p.latitud,p.longitud] as any));
    (map.value as any).leafletObject.fitBounds(bounds);
  }
}
*/

// Fetch usuarios al montar
onMounted(() => { usuariosStore.fetchUsuarios(); });
</script>

<style>
html,body,#app{max-width:100%!important; overflow-x:hidden!important;}
</style>