<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6" id="capture">
    <header class="mb-4 sm:mb-6 text-center">
      <h1 class="text-xl sm:text-2xl font-bold text-black mb-1">Estadísticas Generales</h1>
      <p class="text-gray-600 text-sm">Visualiza el estado general de la plataforma en tiempo real.</p>
    </header>

    <div class="flex justify-end mb-3">
      <button
        @click="captureScreen"
        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm rounded-lg shadow transition"
      >
        Descargar Informe
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-full mx-auto">
      <!-- Tarjeta de Estadísticas -->
      <div class="bg-white shadow-md rounded-lg p-3 w-full">
        <h2 class="text-base font-bold mb-2">Estadísticas</h2>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-[var(--colorPrimarioButton)] text-white rounded-lg p-3">
            <p class="text-xs">Total Usuarios</p>
            <p class="text-lg font-bold">{{ totalUsuarios }}</p>
          </div>
          <div class="bg-[var(--colorSecundarioButton)] text-white rounded-lg p-3">
            <p class="text-xs">Doctores</p>
            <p class="text-lg font-bold">{{ totalDoctores }}</p>
          </div>
          <div class="bg-green-500 text-white rounded-lg p-3">
            <p class="text-xs">Pacientes</p>
            <p class="text-lg font-bold">{{ totalPacientes }}</p>
          </div>
          <div class="bg-purple-500 text-white rounded-lg p-3">
            <p class="text-xs">Activos</p>
            <p class="text-lg font-bold">{{ totalActivos }}</p>
          </div>
          <div class="bg-blue-500 text-white rounded-lg p-3">
            <p class="text-xs">Administradores</p>
            <p class="text-lg font-bold">{{ totalAdministradores }}</p>
          </div>
        </div>
      </div>

      <!-- Gráfico de Pacientes por Doctor -->
      <div class="bg-white shadow-md rounded-lg p-3 w-full overflow-hidden">
        <h2 class="text-base font-bold mb-2">Pacientes por Doctor</h2>
        <div class="w-full h-[180px] md:h-[200px] max-w-full">
          <Bar :data="barChartData" :options="barChartOptions" @click="handleBarClick"/>
        </div>
      </div>

      <!-- Gráfico de Pacientes sin Doctor -->
      <div class="bg-white shadow-md rounded-lg p-3 w-full overflow-hidden">
        <h2 class="text-base font-bold mb-2">Pacientes sin Doctor</h2>
        <div class="relative w-full h-[180px] md:h-[200px] flex items-center justify-center">
          <Pie :data="sinDoctorChartData" :options="sinDoctorChartOptions" />
          <div class="absolute text-xl font-bold text-gray-700">
            {{ totalSinDoctor }}
          </div>
        </div>
      </div>

      <!-- Gráfico de Evolución de Usuarios -->
      <div class="bg-white shadow-md rounded-lg p-3 w-full overflow-hidden">
        <h2 class="text-base font-bold mb-2">Evolución de Usuarios</h2>
        <div class="w-full h-[180px] md:h-[200px] max-w-full">
          <Line :data="lineChartData" :options="lineChartOptions" />
        </div>
      </div>

      <!-- Gráfico de Pacientes por Género -->
      <div class="col-span-1 md:col-span-2 xl:col-span-2">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="!isMobile || currentPage === 1" class="bg-white shadow-md rounded-lg p-3 w-full overflow-hidden">
            <h2 class="text-base font-bold mb-2">Pacientes por Género</h2>
            <div class="w-full h-[180px] md:h-[200px] max-w-full">
              <Pie :data="pieChartData" :options="pieChartOptions"/>
            </div>
          </div>
        </div>

        <!-- Navegación para móviles -->
        <div v-if="isMobile" class="flex items-center justify-center gap-3 mt-3">
          <button @click="prevPage" :disabled="currentPage===1" class="px-2 py-1 text-sm rounded border disabled:opacity-50">Anterior</button>
          <div class="flex items-center gap-1">
            <span v-for="n in totalPages" :key="n" @click="setPage(n)"
                  :class="['w-2 h-2 rounded-full cursor-pointer', currentPage===n?'bg-[var(--colorPrimarioButton)]':'bg-gray-300']"/>
          </div>
          <button @click="nextPage" :disabled="currentPage===totalPages" class="px-2 py-1 text-sm rounded border disabled:opacity-50">Siguiente</button>
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
import { useGraficosAdminStore } from '@/stores/graficosAdmin';
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

const usuariosStore = useUsuariosStore();
const { usuariosFiltrados } = storeToRefs(usuariosStore);

const totalUsuarios = computed(() => usuariosFiltrados.value.length);
const totalPacientes = computed(() => usuariosFiltrados.value.filter(u=>u.rol?.nombreRol === 'Paciente').length);
const totalDoctores = computed(() => usuariosFiltrados.value.filter(u=>u.rol?.nombreRol === 'Doctor').length);
const totalActivos = computed(() => usuariosFiltrados.value.filter(u=>u.estado === 'Activo').length);
const totalAdministradores = computed(() => 
  usuariosFiltrados.value.filter(u => ['Admin', 'Administrador'].includes(u.rol?.nombreRol)).length
);

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
  plugins:{ 
    legend:{display:false}, 
    datalabels:{anchor:'end', align:'top', font: { size: 10 } } 
  },
  scales: {
    x: {
      ticks: {
        font: {
          size: 10
        }
      }
    },
    y: {
      ticks: {
        font: {
          size: 10
        }
      }
    }
  }
};

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
const pieChartOptions = { 
  responsive:true, 
  maintainAspectRatio:false, 
  plugins:{
    legend:{
      position:'bottom',
      labels: {
        font: {
          size: 10
        }
      }
    }
  }
};

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
  plugins: { 
    legend: { 
      position: 'bottom',
      labels: {
        font: {
          size: 10
        }
      }
    } 
  }
};

const lineChartData = computed(() => {
  const counts: Record<string, number> = {};
  usuariosFiltrados.value.forEach(u => {
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
  plugins: { 
    legend: { 
      position: 'bottom',
      labels: {
        font: {
          size: 10
        }
      }
    } 
  },
  scales: { 
    y: { beginAtZero: true },
    x: {
      ticks: {
        font: {
          size: 10
        }
      }
    },
    y: {
      ticks: {
        font: {
          size: 10
        }
      }
    }
  }
};

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

const windowWidth = ref(window.innerWidth);
const isMobile = computed(() => windowWidth.value<768);
const currentPage = ref(1);
const totalPages = 2;
function nextPage(){ if(currentPage.value<totalPages) currentPage.value++; }
function prevPage(){ if(currentPage.value>1) currentPage.value--; }
function setPage(n:number){ if(n>=1 && n<=totalPages) currentPage.value=n; }
watch(isMobile, mobile => { if(!mobile) currentPage.value=1; });
window.addEventListener('resize', ()=>windowWidth.value=window.innerWidth);

onMounted(() => { usuariosStore.fetchUsuarios(); });
</script>

<style>
html,body,#app{max-width:100%!important; overflow-x:hidden!important;}
</style>