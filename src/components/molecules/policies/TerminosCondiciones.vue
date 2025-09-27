<template>
  <div class="flex h-screen">
    <div class="sidebar w-64 bg-gray-800 text-white p-4 flex flex-col">
      <h2 class="text-2xl font-semibold mb-8">Términos y Condiciones</h2>
      <ul class="flex flex-col space-y-4">
        <li>
          <a href="#section1" class="text-lg hover:text-blue-300">1. Aceptación de los Términos</a>
        </li>
        <li>
          <a href="#section2" class="text-lg hover:text-blue-300">2. Uso adecuado de la aplicación</a>
        </li>
        <li>
          <a href="#section3" class="text-lg hover:text-blue-300">3. Modificaciones de los términos</a>
        </li>
        <li>
          <a href="#section4" class="text-lg hover:text-blue-300">4. Responsabilidad del usuario</a>
        </li>
        <li>
          <a href="#section5" class="text-lg hover:text-blue-300">5. Limitación de Responsabilidad</a>
        </li>
        <li>
          <a href="#section6" class="text-lg hover:text-blue-300">6. Terminación de la cuenta</a>
        </li>
        <li>
          <a href="#section7" class="text-lg hover:text-blue-300">7. Propiedad intelectual</a>
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
        <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">Términos y Condiciones de Uso de GlycoPulse</h1>

        <div class="section mb-8 p-6 bg-white rounded-lg shadow-md" id="section1">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">1. Aceptación de los Términos</h2>
          <p class="text-gray-600 leading-relaxed">
            Al usar GlycoPulse, aceptas estos Términos y Condiciones. Si no estás de acuerdo con estos términos, por favor, no utilices la aplicación. Estos términos regulan el uso de nuestra aplicación y todos los servicios relacionados.
          </p>
        </div>

        <div class="section mb-8 p-6 bg-white rounded-lg shadow-md" id="section2">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">2. Uso adecuado de la aplicación</h2>
          <p class="text-gray-600 leading-relaxed">
            Te comprometes a utilizar la aplicación de acuerdo con las leyes y regulaciones locales, nacionales e internacionales aplicables. GlycoPulse es una herramienta para gestionar y monitorear datos relacionados con la salud, y no debe usarse para ningún otro propósito no autorizado.
          </p>
        </div>

        <div class="section mb-8 p-6 bg-white rounded-lg shadow-md" id="section3">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">3. Modificaciones de los términos</h2>
          <p class="text-gray-600 leading-relaxed">
            GlycoPulse se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Cualquier cambio será efectivo al ser publicado en la aplicación o en nuestra página web. Te recomendamos revisar periódicamente los términos para estar al tanto de los cambios.
          </p>
        </div>

        <div class="section mb-8 p-6 bg-white rounded-lg shadow-md" id="section4">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">4. Responsabilidad del usuario</h2>
          <p class="text-gray-600 leading-relaxed">
            Eres responsable de mantener la confidencialidad de tu cuenta y de cualquier actividad realizada bajo tu cuenta. Si detectas cualquier actividad no autorizada en tu cuenta, debes notificarnos de inmediato.
          </p>
        </div>

        <div class="section mb-8 p-6 bg-white rounded-lg shadow-md" id="section5">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">5. Limitación de Responsabilidad</h2>
          <p class="text-gray-600 leading-relaxed">
            Aunque nos esforzamos por ofrecer un servicio sin fallos, no garantizamos que la aplicación esté libre de errores, interrupciones o fallos. No nos hacemos responsables de daños directos, indirectos o consecuentes derivados del uso de la aplicación.
          </p>
        </div>

        <div class="section mb-8 p-6 bg-white rounded-lg shadow-md" id="section6">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">6. Terminación de la cuenta</h2>
          <p class="text-gray-600 leading-relaxed">
            Nos reservamos el derecho de suspender o cancelar tu cuenta en cualquier momento si violas estos Términos y Condiciones.
          </p>
        </div>

        <div class="section p-6 bg-white rounded-lg shadow-md" id="section7">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">7. Propiedad intelectual</h2>
          <p class="text-gray-600 leading-relaxed">
            El contenido y los materiales de la aplicación (incluyendo texto, gráficos, logos, imágenes, etc.) son propiedad de GlycoPulse y están protegidos por las leyes de propiedad intelectual. No se permite el uso no autorizado de estos materiales.
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
