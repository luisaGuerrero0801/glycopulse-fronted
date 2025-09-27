import { defineStore } from 'pinia';
import { useUsuariosStore } from './usuarios';
import { computed, ref } from 'vue';

export const useGraficosAdminStore = defineStore('graficosAdmin', () => {
  const usuariosStore = useUsuariosStore();
  const loading = ref(false);

  // Usa la propiedad 'usuarios' directamente del store de usuarios
  const usuarios = computed(() => usuariosStore.usuarios);

  // 1. Lógica para los KPIs (Estadísticas)
  const totalUsuarios = computed(() => usuarios.value.length);
  const totalPacientes = computed(() => usuarios.value.filter(u => u.rol?.nombreRol === 'Paciente').length);
  const totalDoctores = computed(() => usuarios.value.filter(u => u.rol?.nombreRol === 'Doctor').length);
  const totalActivos = computed(() => usuarios.value.filter(u => u.estado === 'Activo').length);

  // ✅ Corregido: soporta tanto "Admin" como "Administrador"
  const totalAdministradores = computed(() =>
    usuarios.value.filter(u => ['Admin', 'Administrador'].includes(u.rol?.nombreRol)).length
  );

  // 2. Gráfico de Pacientes por Doctor
  const chartPacientesPorDoctor = computed(() => {
    const doctores = usuarios.value.filter(u => u.rol?.nombreRol === 'Doctor');
    const labels = doctores.map(d => `${d.nombresUsuario} ${d.apellidosUsuario}`);
    const data = doctores.map(d => {
      return usuarios.value.filter(
        p => p.rol?.nombreRol === 'Paciente' && p.idUsuarioResponsable === d.idUsuario
      ).length;
    });
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#3b82f6', '#22c55e', '#ef4444'],
      }]
    };
  });

  // 3. Gráfico de Pacientes sin Doctor
  const totalSinDoctor = computed(() =>
    usuarios.value.filter(u => u.rol?.nombreRol === 'Paciente' && !u.idUsuarioResponsable).length
  );
  const totalConDoctor = computed(() => totalPacientes.value - totalSinDoctor.value);
  const sinDoctorChartData = computed(() => ({
    labels: ['Sin Doctor', 'Con Doctor'],
    datasets: [{
      data: [totalSinDoctor.value, totalConDoctor.value],
      backgroundColor: ['#FF6384', '#36A2EB'],
    }]
  }));

  // 4. Gráfico de Evolución de Usuarios
  const lineChartData = computed(() => {
    const counts: Record<string, number> = {};
    usuarios.value.forEach(u => {
      // ✅ CORRECCIÓN: Usar 'fechaRegistroUsuario'
      if (u.fechaRegistroUsuario) {
        const fecha = new Date(u.fechaRegistroUsuario);
        const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        counts[mes] = (counts[mes] || 0) + 1;
      }
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
        tension: 0.3,
      }]
    };
  });

  // 5. Gráfico de Pacientes por Género
 const pieChartData = computed(() => {
  const hombres = usuarios.value.filter(
    u => u.rol?.nombreRol === 'Paciente' && u.generoUsuario === 'Hombre'
  ).length;

  const mujeres = usuarios.value.filter(
    u => u.rol?.nombreRol === 'Paciente' && u.generoUsuario === 'Mujer'
  ).length;

  const otros = usuarios.value.filter(
    u => u.rol?.nombreRol === 'Paciente' && !['Hombre', 'Mujer'].includes(u.generoUsuario)
  ).length;

  return {
    labels: ['Hombres', 'Mujeres', 'Otros'],
    datasets: [{
      data: [hombres, mujeres, otros],
      backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      }]
    };
  });

  // Acción para cargar los datos
  const cargarDatos = async () => {
    loading.value = true;
    try {
      await usuariosStore.fetchUsuarios();
    } catch (error) {
      console.error('Error al cargar datos para los gráficos:', error);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    totalUsuarios,
    totalPacientes,
    totalDoctores,
    totalActivos,
    totalAdministradores, // ✅ ahora robusto
    chartPacientesPorDoctor,
    sinDoctorChartData,
    totalSinDoctor,
    lineChartData,
    pieChartData,
    cargarDatos
  };
});
