<template>
  <div class="min-h-screen bg-gray-100 p-2" id="capture">
    <div class="fixed top-4 right-4 z-50">
      <button
        @click="captureScreen"
        class="bg-[var(--colorPrimarioButton)] hover:bg-[var(--colorSecundarioButton)] text-white px-3 py-1 rounded-lg shadow"
      >
        Descargar Informe
      </button>
    </div>

    <div class="max-w-6xl mx-auto space-y-6">
      <div class="text-center">
        <h1 class="text-2xl font-bold">📊 Dashboard</h1>
        <p class="text-gray-600 text-sm">Resumen de información actual</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
        <div class="bg-white shadow rounded-xl p-4 flex flex-col items-center">
          <span class="text-orange-600 font-semibold">🤱🏻 Pacientes</span>
          <p class="text-2xl font-bold text-orange-600">{{ totalPacientes }}</p>
        </div>
        <div class="bg-white shadow rounded-xl p-4 flex flex-col items-center">
          <span class="text-purple-600 font-semibold">👨‍⚕️ Doctores</span>
          <p class="text-2xl font-bold text-purple-600">{{ totalDoctores }}</p>
        </div>
        <div class="bg-white shadow rounded-xl p-4 flex flex-col items-center">
          <span class="text-blue-600 font-semibold">⚖️ Promedio Pacientes/Doctor</span>
          <p class="text-2xl font-bold text-blue-600">{{ pacientesPromedioPorDoctor }}%</p>
        </div>
        <div class="bg-white shadow rounded-xl p-4 flex flex-col items-center">
          <span class="text-green-600 font-semibold"> Pacientes con Doctor </span>
          <p class="text-2xl font-bold text-green-600">{{ porcentajeConDoctor }}%</p>
        </div>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="bg-white p-3 rounded-lg shadow h-[300px]">
          <Pie :data="chartDataRoles" :options="{ responsive: true }" />
        </div>

        <div class="bg-white p-3 rounded-lg shadow h-[300px]">
          <Bar :data="chartDataPacientesPorDoctor" :options="chartOptionsPacientesPorDoctor" />
        </div>

        <div class="bg-white p-3 rounded-lg shadow h-[300px]">
          <Pie :data="chartDataPacientesAsignacion" :options="chartOptionsPacientesAsignacion" />
        </div>

        <div class="bg-white p-3 rounded-lg shadow h-[300px]">
          <Pie :data="chartDataDoctoresPacientes" :options="chartOptionsDoctoresPacientes" />
        </div>
      </div>

      <div class="bg-white p-3 rounded-lg shadow h-[400px]">
        <LMap
          ref="map"
          style="height: 100%"
          :zoom="mapZoom"
          :center="mapCenter"
          @ready="onMapReady"
        >
          <LTileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </LMap>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUsuariosStore } from '@/stores/donantes';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { Bar, Pie } from 'vue-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import html2canvas from 'html2canvas';

// Importaciones para el mapa
import { LMap, LTileLayer, LPopup } from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Solución para el error de los íconos de los marcadores
// eslint-disable-next-line
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, ChartDataLabels);

const usuariosStore = useUsuariosStore();
const { usuariosFiltrados } = storeToRefs(usuariosStore);

let intervalId: number | undefined;
const isLoading = ref(false);

// Variables para el mapa
const mapCenter = ref([4.711, -74.0721]);
const mapZoom = ref(6);
const map = ref(null);
let markerClusterLayer: any = null;

const pacientesConCoordenadas = computed(() => {
  return usuariosFiltrados.value.filter(u => u.rol.nombreRol === 'Paciente' && u.latitud && u.longitud);
});

function onMapReady() {
  if (map.value) {
    markerClusterLayer = (L as any).markerClusterGroup();
    (map.value as any).leafletObject.addLayer(markerClusterLayer);
    updateMarkers();
  }
}

function updateMarkers() {
  if (!markerClusterLayer || !pacientesConCoordenadas.value) return;

  markerClusterLayer.clearLayers();
  pacientesConCoordenadas.value.forEach(paciente => {
    const marker = L.marker([paciente.latitud, paciente.longitud]);
    marker.bindPopup(`
      <div>
        <h3>${paciente.nombre}</h3>
        <p>ID: ${paciente.id}</p>
      </div>
    `);
    markerClusterLayer.addLayer(marker);
  });
}

watch(pacientesConCoordenadas, () => {
  updateMarkers();
});

onMounted(() => {
  usuariosStore.fetchUsuarios();
  intervalId = setInterval(() => {
    usuariosStore.fetchUsuarios();
  }, 5000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
  if (map.value && markerClusterLayer) {
    (map.value as any).leafletObject.removeLayer(markerClusterLayer);
  }
});

function contarPorRol(rol: string) {
  return usuariosFiltrados.value.filter((usuario) => usuario.rol.nombreRol === rol).length;
}

const totalPacientes = computed(() => contarPorRol('Paciente'));
const totalDoctores = computed(() => contarPorRol('Doctor'));
const pacientesConDoctor = computed(() =>
  usuariosFiltrados.value.filter((u) => u.rol.nombreRol === 'Paciente' && u.usuarioResponsable).length
);
const pacientesSinDoctor = computed(() =>
  usuariosFiltrados.value.filter((u) => u.rol.nombreRol === 'Paciente' && !u.usuarioResponsable).length
);
const pacientesPromedioPorDoctor = computed(() => {
  return totalDoctores.value > 0 ? (totalPacientes.value / totalDoctores.value).toFixed(1) : 0;
});
const porcentajeConDoctor = computed(() => {
  return totalPacientes.value > 0 ? ((pacientesConDoctor.value / totalPacientes.value) * 100).toFixed(1) : 0;
});

const chartDataRoles = computed(() => ({
  labels: ['Pacientes', 'Doctores', 'Admins'],
  datasets: [
    {
      label: 'Usuarios',
      backgroundColor: ['#f97316', '#a855f7', '#22c55e'],
      data: [totalPacientes.value, totalDoctores.value, contarPorRol('Admin')]
    }
  ]
}));

const chartDataPacientesPorDoctor = computed(() => {
  const doctores = usuariosFiltrados.value.filter((u) => u.rol.nombreRol === 'Doctor');
  const labels = doctores.map((d) => d.nombre || `Doctor ${d.id}`);
  const data = doctores.map(
    (doc) => usuariosFiltrados.value.filter((p) => p.usuarioResponsable === doc.id).length
  );
  return {
    labels,
    datasets: [
      {
        label: 'Pacientes asignados',
        backgroundColor: '#6366f1',
        data
      }
    ]
  };
});

const chartOptionsPacientesPorDoctor = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: 'Pacientes por Doctor',
      font: { weight: 'bold', size: 16 }
    }
  }
};

const chartDataPacientesAsignacion = computed(() => ({
  labels: ['Con Doctor', 'Sin Doctor'],
  datasets: [
    {
      backgroundColor: ['#22c55e', '#ef4444'],
      data: [pacientesConDoctor.value, pacientesSinDoctor.value]
    }
  ]
}));

const chartOptionsPacientesAsignacion = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    legend: { display: true, position: 'bottom' as const },
    title: {
      display: true,
      text: 'Asignación de Pacientes',
      font: { weight: 'bold', size: 16 }
    },
    datalabels: {
      color: '#fff',
      formatter: (value: number) => `${value}`,
      font: { weight: 'bold', size: 12 }
    }
  }
};

const chartDataDoctoresPacientes = computed(() => ({
  labels: ['Pacientes', 'Doctores'],
  datasets: [
    {
      backgroundColor: ['#f97316', '#a855f7'],
      data: [totalPacientes.value, totalDoctores.value],
    },
  ],
}));

const chartOptionsDoctoresPacientes = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'bottom' as const },
    title: {
      display: true,
      text: 'Relación Doctores con Pacientes',
      font: { weight: 'bold', size: 16 }
    },
    datalabels: {
      color: '#fff',
      formatter: (value: number) => `${value}`,
      font: { weight: 'bold', size: 12 }
    }
  }
};

function captureScreen() {
  const element = document.getElementById('capture');
  if (element) {
    isLoading.value = true;
    html2canvas(element).then((canvas) => {
      const img = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = img;
      link.download = 'informe.png';
      link.click();
      isLoading.value = false;
    });
  }
}
</script>