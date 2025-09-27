<template>
  <div class="flex h-screen">
    <div class="sidebar w-64 bg-gray-800 text-white p-4 flex flex-col">
      <h2 class="text-2xl font-semibold mb-8">Política de Privacidad</h2>
      <ul class="flex flex-col space-y-4">
        <li>
          <a href="#section1" class="text-lg hover:text-blue-300">1. Información que recabamos</a>
        </li>
        <li>
          <a href="#section2" class="text-lg hover:text-blue-300">2. Uso de los datos</a>
        </li>
        <li>
          <a href="#section3" class="text-lg hover:text-blue-300">3. Compartir y vender datos</a>
        </li>
      </ul>
    </div>

    <div class="content flex-1 bg-gray-100 p-8 overflow-auto">
      <button
        @click="goHome"
        class="absolute top-4 right-4 text-4xl text-gray-800 hover:text-gray-600 transition duration-300"
      >
        &times;
      </button>

      <div class="max-w-3xl mx-auto mt-16">
        <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">Política de Privacidad de GlycoPulse</h1>

        <div class="section mb-8 p-6 bg-white rounded-lg shadow-md" id="section1">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">1. Información que recabamos</h2>
          <p class="text-gray-600 leading-relaxed">
            En GlycoPulse, nos comprometemos a proteger tu privacidad. Solo recopilamos los datos estrictamente necesarios para brindarte una mejor experiencia de usuario. Estos son:
          </p>
          <ul class="list-disc pl-6 text-gray-600 mt-4">
            <li><strong>Correo electrónico:</strong> Lo usamos exclusivamente para enviarte notificaciones de la aplicación (verificación de cuenta, recuperación de contraseña y otras notificaciones relacionadas con tu cuenta).</li>
            <li><strong>Datos de uso:</strong> Recopilamos datos sobre cómo usas nuestra aplicación para mejorar nuestros servicios y ofrecerte una experiencia más personalizada.</li>
          </ul>
        </div>

        <div class="section mb-8 p-6 bg-white rounded-lg shadow-md" id="section2">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">2. Uso de los datos</h2>
          <p class="text-gray-600 leading-relaxed">
            Los datos que recopilamos se usan únicamente para los siguientes fines:
          </p>
          <ul class="list-disc pl-6 text-gray-600 mt-4">
            <li><strong>Enviarte correos electrónicos relacionados con tu cuenta:</strong> (por ejemplo, verificación de cuenta y recuperación de contraseña).</li>
            <li><strong>Mejorar nuestros servicios:</strong> Mediante el análisis de los datos de uso, con el fin de optimizar la app y la experiencia del usuario.</li>
          </ul>
        </div>

        <div class="section mb-8 p-6 bg-white rounded-lg shadow-md" id="section3">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">3. Compartir y vender datos</h2>
          <p class="text-gray-600 leading-relaxed">
            GlycoPulse no comparte ni vende tus datos personales a terceros. Tus datos se mantienen seguros y privados. Solo los utilizamos para los fines indicados en esta política de privacidad.
          </p>
        </div>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500">
            Al usar GlycoPulse, aceptas nuestras <a href="/terminos" class="text-blue-500 hover:underline">Condiciones</a>, <a href="/privacidad" class="text-blue-500 hover:underline">Política de Privacidad</a> y <a href="/terminos" class="text-blue-500 hover:underline">Términos y Condiciones</a>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}

.sidebar {
  background-color: #2d3748;
  color: white;
  height: 100%;
  padding-top: 2rem;
  position: fixed;
  width: 16rem;
}

.sidebar h2 {
  color: #edf2f7;
  margin-bottom: 1.5rem;
}

.sidebar a {
  color: #e2e8f0;
  transition: color 0.3s ease;
}

.sidebar a:hover {
  color: #63b3ed;
}

.content {
  margin-left: 16rem;
  padding: 2rem;
  flex: 1;
  overflow: auto;
}

button {
  transition: color 0.3s ease;
}

h1 {
  color: #4A4A4A;
  font-family: 'Poppins', sans-serif;
}

h2 {
  color: #5D5D5D;
}

.section {
  background-color: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.mt-6 {
  margin-top: 1.5rem;
}

.text-center {
  text-align: center;
}

.text-sm {
  font-size: 0.875rem;
}

.text-blue-500 {
  color: #3b82f6;
}

.text-blue-500:hover {
  color: #2563eb;
}

a {
  text-decoration: none;
}

.max-w-3xl {
  max-width: 50rem;
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
  }

  .content {
    margin-left: 0;
  }
}
</style>
